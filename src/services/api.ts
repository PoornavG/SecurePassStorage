import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export interface LoginData {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  password: string;
}

export const authAPI = {
  login: async (data: LoginData) => {
    const response = await api.post('/login', data);
    return response.data;
  },

  signup: async (data: SignupData) => {
    const response = await api.post('/user-pass', data);
    return response.data;
  },

  checkUsername: async (username: string) => {
    const response = await api.get(`/check-username/${username}`);
    return response.data;
  },

  getLoginAttempts: async (username: string) => {
    const response = await api.get(`/login-attempts/${username}`);
    return response.data;
  },
};

export const webAuthnAPI = {
  registerBegin: async (data: { username: string; credentialName: string }) => {
    const response = await api.post('/webauthn/register/begin', data);
    return response.data;
  },

  registerFinish: async (data: { username: string; credentialName: string; attResp: any }) => {
    const response = await api.post('/webauthn/register/finish', data);
    return response.data;
  },

  authenticateBegin: async (data: { username: string }) => {
    const response = await api.post('/webauthn/authenticate/begin', data);
    return response.data;
  },

  authenticateFinish: async (data: { username: string; authResp: any }) => {
    const response = await api.post('/webauthn/authenticate/finish', data);
    return response.data;
  },

  getCredentials: async (username: string) => {
    const response = await api.get(`/webauthn/credentials/${username}`);
    return response.data;
  },

  deleteCredential: async (username: string, credentialId: string) => {
    const response = await api.delete(`/webauthn/credentials/${username}/${credentialId}`);
    return response.data;
  },
};

export default api;