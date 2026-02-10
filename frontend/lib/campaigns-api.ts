import api from './api';
import endpoints from './apiRoutes';

export interface Campaign {
  id: number;
  name: string;
  description: string;
  status: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  campaign_posts?: CampaignPost[];
}

export interface CampaignPost {
  id: number;
  campaign_id: number;
  platform: string;
  content: string;
  image_prompt?: string;
  image_url?: string;
  real_image_url?: string;
  status: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
  pagination: {
    page: number;
    items: number;
    count: number;
    pages: number;
    next: number | null;
    prev: number | null;
  };
}

export const campaignsApi = {
  getAll: async (page: number = 1, items: number = 12) => {
    const response = await api.get<CampaignsResponse>(endpoints.campaigns.list(page, items));
    return response.data;
  },

  getOne: async (id: number) => {
    const response = await api.get<Campaign>(endpoints.campaigns.one(id));
    return response.data;
  },

  create: async (data: Partial<Campaign>) => {
    const response = await api.post<Campaign>(endpoints.campaigns.create(), { campaign: data });
    return response.data;
  },

  update: async (id: number, data: Partial<Campaign>) => {
    const response = await api.put<Campaign>(endpoints.campaigns.update(id), { campaign: data });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(endpoints.campaigns.delete(id));
  }
};

export const campaignPostsApi = {
  create: async (campaignId: number, data: Partial<CampaignPost>) => {
    const response = await api.post<CampaignPost>(endpoints.campaigns.postsCreate(campaignId), { campaign_post: data });
    return response.data;
  },

  update: async (id: number, data: Partial<CampaignPost>) => {
    const response = await api.put<CampaignPost>(endpoints.campaignPosts.update(id), { campaign_post: data });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(endpoints.campaignPosts.delete(id));
  }
};