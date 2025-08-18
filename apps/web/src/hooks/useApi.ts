import { useAuth } from '@/contexts/AuthContext';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

export const useApi = () => {
  const { token, logout } = useAuth();

  const request = async <T>(
    endpoint: string,
    method: RequestMethod = 'GET',
    body: any = null,
    customHeaders: Record<string, string> = {}
  ): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    // Ajouter le token d'authentification s'il existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include', // Important pour les cookies HTTP-Only
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, config);
      
      // Si la réponse est 401 (Non autorisé), déconnecter l'utilisateur
      if (response.status === 401) {
        logout();
        return {
          data: null,
          error: 'Session expirée. Veuillez vous reconnecter.',
          status: 401,
        };
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          data: null,
          error: data.message || 'Une erreur est survenue',
          status: response.status,
        };
      }

      return {
        data: data as T,
        error: null,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null,
        error: 'Impossible de se connecter au serveur',
        status: 500,
      };
    }
  };

  // Méthodes HTTP courantes
  const get = <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, 'GET', null, headers);

  const post = <T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ) => request<T>(endpoint, 'POST', body, headers);

  const put = <T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ) => request<T>(endpoint, 'PUT', body, headers);

  const del = <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, 'DELETE', null, headers);

  const patch = <T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ) => request<T>(endpoint, 'PATCH', body, headers);

  return {
    request,
    get,
    post,
    put,
    delete: del,
    patch,
  };
};

export default useApi;
