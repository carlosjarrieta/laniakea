import api from './api';
import endpoints from './apiRoutes';

export interface ConnectedAccount {
  id: number;
  provider: string;
  name: string;
  image: string;
  connected_at: string;
}

export interface IntegrationsResponse {
  integrations: ConnectedAccount[];
}

export const integrationsApi = {
  // Get all connected integrations
  getIntegrations: async (): Promise<IntegrationsResponse> => {
    const response = await api.get(endpoints.integrations.list());
    return response.data;
  },

  // Disconnect an integration
  disconnectIntegration: async (id: number): Promise<void> => {
    await api.delete(endpoints.integrations.disconnect(id));
  },

  // Build the Facebook auth URL (browser navigation, not AJAX)
  // Uses apiRoutes to construct the correct URL (handling ngrok if needed)
  getFacebookAuthUrl: (token: string): string => {
    return endpoints.integrations.facebookAuthUrl(token);
  },

  // Get managed Facebook pages
  getFacebookPages: async (): Promise<{ pages: any[] }> => {
    const response = await api.get(endpoints.integrations.facebookPages());
    return response.data;
  },
};