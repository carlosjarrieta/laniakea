import api from './api';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const integrationsApi = {
  // Get all connected integrations
  getIntegrations: async (): Promise<IntegrationsResponse> => {
    const response = await api.get('/api/v1/integrations');
    return response.data;
  },

  // Disconnect an integration
  disconnectIntegration: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/integrations/${id}`);
  },

  // Build the Facebook auth URL (browser navigation, not AJAX)
  // The backend receives the JWT as a query param, saves user_id in session,
  // then redirects to Facebook. This ensures session cookies persist.
  // Uses ngrok URL so Facebook gets an HTTPS callback URL
  getFacebookAuthUrl: (token: string): string => {
    const fbAuthBase = process.env.NEXT_PUBLIC_FACEBOOK_AUTH_URL || API_URL;
    return `${fbAuthBase}/api/v1/facebook/auth_url?token=${token}`;
  },
};