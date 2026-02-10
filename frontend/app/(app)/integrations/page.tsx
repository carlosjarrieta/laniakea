'use client';

import { useEffect, useState } from 'react';
import { integrationsApi, ConnectedAccount } from '@/lib/integrations-api';
import { Facebook, Trash2, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state: any) => state.token);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const data = await integrationsApi.getIntegrations();
      setIntegrations(data.integrations);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (provider: string) => {
    if (provider === 'facebook') {
      // Navegación directa al backend (no AJAX)
      // El backend guarda user_id en sesión y redirige a Facebook
      const authUrl = integrationsApi.getFacebookAuthUrl(token || '');
      window.location.href = authUrl;
    }
  };

  const handleDisconnect = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres desconectar esta cuenta?')) {
      return;
    }

    try {
      await integrationsApi.disconnectIntegration(id);
      setIntegrations(integrations.filter(i => i.id !== id));
    } catch (error) {
      console.error('Failed to disconnect:', error);
      alert('Error al desconectar la cuenta');
    }
  };

  const isFacebookConnected = integrations.some(i => i.provider === 'facebook');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Integraciones</h1>
        <p className="text-gray-600">
          Conecta tus cuentas de redes sociales para publicar contenido directamente desde Laniakea.
        </p>
      </div>

      <div className="space-y-4">
        {/* Facebook Integration Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Facebook className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Facebook</h3>
                <p className="text-sm text-gray-600">
                  Publica en tus páginas de Facebook
                </p>
                {isFacebookConnected && (
                  <div className="mt-2">
                    {integrations
                      .filter(i => i.provider === 'facebook')
                      .map(account => (
                        <div key={account.id} className="flex items-center gap-2 text-sm">
                          {account.image && (
                            <img
                              src={account.image}
                              alt={account.name}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="text-gray-700 font-medium">{account.name}</span>
                          <span className="text-green-600 text-xs">● Conectado</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              {isFacebookConnected ? (
                <button
                  onClick={() => {
                    const fbAccount = integrations.find(i => i.provider === 'facebook');
                    if (fbAccount) handleDisconnect(fbAccount.id);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={() => handleConnect('facebook')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Conectar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Placeholder for future integrations */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 border-dashed">
          <div className="text-center text-gray-500">
            <p className="text-sm">Más integraciones próximamente...</p>
            <p className="text-xs mt-1">LinkedIn, X (Twitter), Instagram</p>
          </div>
        </div>
      </div>
    </div>
  );
}
