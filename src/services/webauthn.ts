import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser';

import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/typescript-types';

import { webAuthnAPI } from './api';

export interface WebAuthnCredential {
  id: string;
  name: string;
  createdAt: string;
}

class WebAuthnService {
  isSupported(): boolean {
    return browserSupportsWebAuthn();
  }

  async registerCredential(username: string, credentialName: string): Promise<boolean> {
    try {
      const { options } = await webAuthnAPI.registerBegin({ username, credentialName });
      const attResp: RegistrationResponseJSON = await startRegistration(options);
      const { verified } = await webAuthnAPI.registerFinish({ username, credentialName, attResp });
      return verified;
    } catch (error) {
      console.error('WebAuthn registration failed:', error);
      throw error;
    }
  }

  async authenticateWithBiometric(username: string): Promise<boolean> {
    try {
      const { options } = await webAuthnAPI.authenticateBegin({ username });
      const authResp: AuthenticationResponseJSON = await startAuthentication(options);
      const { verified } = await webAuthnAPI.authenticateFinish({ username, authResp });
      return verified;
    } catch (error) {
      console.error('WebAuthn authentication failed:', error);
      throw error;
    }
  }

  async getCredentials(username: string): Promise<WebAuthnCredential[]> {
    try {
      const { credentials } = await webAuthnAPI.getCredentials(username);
      return credentials;
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
      return [];
    }
  }

  async deleteCredential(username: string, credentialId: string): Promise<boolean> {
    try {
      await webAuthnAPI.deleteCredential(username, credentialId);
      return true;
    } catch (error) {
      console.error('Failed to delete credential:', error);
      return false;
    }
  }
}

export const webAuthnService = new WebAuthnService();
