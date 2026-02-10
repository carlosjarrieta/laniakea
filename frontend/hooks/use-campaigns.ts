import { useState } from 'react';
import api from '@/lib/api';
import { Campaign, CampaignPost, CampaignsResponse } from '@/lib/campaigns-api';
import endpoints from '@/lib/apiRoutes';

export const useCampaigns = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async (page: number = 1, items: number = 12) => {
    setLoading(true);
    try {
      const response = await api.get<CampaignsResponse>(endpoints.campaigns.list(page, items));
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading campaigns';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOne = async (id: number) => {
    setLoading(true);
    try {
      const response = await api.get<Campaign>(endpoints.campaigns.one(id));
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading campaign';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: Partial<Campaign>) => {
    setLoading(true);
    try {
      const response = await api.post<Campaign>(endpoints.campaigns.create(), { campaign: data });
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating campaign';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, data: Partial<Campaign>) => {
    setLoading(true);
    try {
      const response = await api.put<Campaign>(endpoints.campaigns.update(id), { campaign: data });
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating campaign';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    setLoading(true);
    try {
      await api.delete(endpoints.campaigns.delete(id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting campaign';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sub-resource: Campaign Posts
  const createPost = async (campaignId: number, data: Partial<CampaignPost>) => {
    setLoading(true);
    try {
      const response = await api.post<CampaignPost>(endpoints.campaigns.postsCreate(campaignId), { campaign_post: data });
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating post';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: number, data: Partial<CampaignPost>) => {
    setLoading(true);
    try {
      const response = await api.put<CampaignPost>(endpoints.campaignPosts.update(id), { campaign_post: data });
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating post';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    setLoading(true);
    try {
      await api.delete(endpoints.campaignPosts.delete(id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting post';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAll,
    getOne,
    create,
    update,
    deleteItem,
    createPost,
    updatePost,
    deletePost
  };
};