import api from './api';
import endpoints from './apiRoutes';

export interface Campaign {
  id: number;
  name: string;
  description: string;
  status: string;
  metadata?: Record<string, unknown>;
  daily_budget?: number;
  max_spend?: number;
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
  metrics?: {
    impressions?: number;
    clicks?: number;
    reactions?: number;
    spend?: number;
    updated_at?: string;
  };
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
  create: async (campaignId: number, data: Partial<CampaignPost>, imageFile?: File) => {
    let payload: any;
    let config = {};

    if (imageFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'metadata' && typeof value === 'object') {
            Object.entries(value as Record<string, any>).forEach(([mKey, mVal]) => {
              if (Array.isArray(mVal)) {
                mVal.forEach(v => formData.append(`campaign_post[metadata][${mKey}][]`, v));
              } else {
                formData.append(`campaign_post[metadata][${mKey}]`, String(mVal));
              }
            });
          } else {
            formData.append(`campaign_post[${key}]`, String(value));
          }
        }
      });
      formData.append('campaign_post[image]', imageFile);
      payload = formData;
      // Important: Set Content-Type to undefined so the browser sets it with the boundary
      config = { headers: { 'Content-Type': undefined } };
    } else {
      payload = { campaign_post: data };
    }

    const response = await api.post<CampaignPost>(endpoints.campaigns.postsCreate(campaignId), payload, config);
    return response.data;
  },

  update: async (id: number, data: Partial<CampaignPost>) => {
    const response = await api.put<CampaignPost>(endpoints.campaignPosts.update(id), { campaign_post: data });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(endpoints.campaignPosts.delete(id));
  },

  publish: async (id: number, pageId: string, pageAccessToken: string) => {
    const response = await api.post(endpoints.campaignPosts.publish(id), {
      page_id: pageId,
      page_access_token: pageAccessToken
    });
    return response.data;
  },

  refreshMetrics: async (id: number) => {
    const response = await api.post<{ message: string, metrics: CampaignPost['metrics'] }>(endpoints.campaignPosts.refreshMetrics(id));
    return response.data;
  }
};

export const statsApi = {
  getDashboard: async () => {
    const response = await api.get<any>(endpoints.stats.dashboard());
    return response.data;
  }
};