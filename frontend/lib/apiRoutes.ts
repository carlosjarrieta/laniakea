const DEFAULT_API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function withApi(path: string, version = DEFAULT_API_VERSION) {
  return `${API_BASE.replace(/\/$/, '')}/api/${version}/${path.replace(/^\/+/, '')}`;
}

export const campaignsRoutes = {
  list: (page = 1, items = 12, version?: string) => withApi(`campaigns?page=${page}&items=${items}`, version),
  one: (id: number, version?: string) => withApi(`campaigns/${id}`, version),
  create: (version?: string) => withApi('campaigns', version),
  update: (id: number, version?: string) => withApi(`campaigns/${id}`, version),
  delete: (id: number, version?: string) => withApi(`campaigns/${id}`, version),
  postsCreate: (campaignId: number, version?: string) => withApi(`campaigns/${campaignId}/campaign_posts`, version),
};

export const campaignPostsRoutes = {
  update: (id: number, version?: string) => withApi(`campaign_posts/${id}`, version),
  delete: (id: number, version?: string) => withApi(`campaign_posts/${id}`, version),
  publish: (id: number, version?: string) => withApi(`campaign_posts/${id}/publish`, version),
};

export const integrationsRoutes = {
  list: (version?: string) => withApi('integrations', version),
  disconnect: (id: number, version?: string) => withApi(`integrations/${id}`, version),
  facebookConnect: (version?: string) => withApi('integrations/facebook', version),
  facebookPages: (version?: string) => withApi('integrations/facebook_pages', version),
  facebookAuthUrl: (token: string, version?: string) => {
    const base = (process.env.NEXT_PUBLIC_FACEBOOK_AUTH_URL || API_BASE).replace(/\/$/, '');
    const ver = version || DEFAULT_API_VERSION;
    return `${base}/api/${ver}/facebook/auth_url?token=${token}`;
  },
};

export const endpoints = {
  campaigns: campaignsRoutes,
  campaignPosts: campaignPostsRoutes,
  integrations: integrationsRoutes,
};

export default endpoints;