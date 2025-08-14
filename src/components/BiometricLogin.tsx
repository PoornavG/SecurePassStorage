import React, { useState } from 'react';
import { Fingerprint, Smartphone, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { webAuthnService } from '../services/webauthn';

interface BiometricLoginProps {
  username: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const BiometricLogin: React.FC<BiometricLoginProps> = ({ username, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'success' | 'error'>('idle');

  const handleBiometricLogin = async () => {
    if (!webAuthnService.isSupported()) {
      onError('WebAuthn is not supported in this browser');
      return;
    }

    setLoading(true);
    setStatus('authenticating');

    try {
      const success = await webAuthnService.authenticateWithBiometric(username);
      if (success) {
        setStatus('success');
        onSuccess();
      } else {
        setStatus('error');
        onError('Biometric authentication failed');
      }
    } catch (error: any) {
      setStatus('error');
      onError(error.response?.data?.error || 'Biometric authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'authenticating':
        return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-400" />;
      default:
        return <Fingerprint className="h-8 w-8 text-orange-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'authenticating':
        return 'Authenticating...';
      case 'success':
        return 'Authentication successful!';
      case 'error':
        return 'Authentication failed';
      default:
        return 'Use biometric authentication';
    }
  };

  if (!webAuthnService.isSupported()) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
          <span className="text-yellow-400">WebAuthn is not supported in this browser</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-4">Or use biometric authentication</p>
      </div>

      <button
        onClick={handleBiometricLogin}
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
      >
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </button>

      <div className="flex items-center justify-center space-x-6 text-gray-400 text-xs">
        <div className="flex items-center space-x-1">
          <Fingerprint className="h-4 w-4" />
          <span>Fingerprint</span>
        </div>
        <div className="flex items-center space-x-1">
          <Smartphone className="h-4 w-4" />
          <span>Face ID</span>
        </div>
        <div className="flex items-center space-x-1">
          <Key className="h-4 w-4" />
          <span>YubiKey</span>
        </div>
      </div>
    </div>
  );
};

export default BiometricLogin;