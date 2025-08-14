import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  Plus, 
  Trash2, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Smartphone,
  Key
} from 'lucide-react';
import { webAuthnService, WebAuthnCredential } from '../services/webauthn';
import { useAuth } from '../contexts/AuthContext';

const BiometricSettings: React.FC = () => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<WebAuthnCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newCredentialName, setNewCredentialName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (user) {
      loadCredentials();
    }
  }, [user]);

  const loadCredentials = async () => {
    if (!user) return;
    
    try {
      const creds = await webAuthnService.getCredentials(user);
      setCredentials(creds);
    } catch (error) {
      setError('Failed to load biometric credentials');
    }
  };

  const handleAddCredential = async () => {
    if (!user || !newCredentialName.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await webAuthnService.registerCredential(user, newCredentialName.trim());
      if (success) {
        setSuccess('Biometric credential added successfully!');
        setNewCredentialName('');
        setShowAddForm(false);
        await loadCredentials();
      } else {
        setError('Failed to register biometric credential');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to add biometric credential');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCredential = async (credentialId: string) => {
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await webAuthnService.deleteCredential(user, credentialId);
      if (success) {
        setSuccess('Biometric credential removed successfully!');
        await loadCredentials();
      } else {
        setError('Failed to remove biometric credential');
      }
    } catch (error) {
      setError('Failed to remove biometric credential');
    } finally {
      setLoading(false);
    }
  };

  const getCredentialIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('yubikey') || lowerName.includes('security key')) {
      return <Key className="h-5 w-5 text-amber-400" />;
    }
    if (lowerName.includes('face') || lowerName.includes('camera')) {
      return <Smartphone className="h-5 w-5 text-blue-400" />;
    }
    return <Fingerprint className="h-5 w-5 text-green-400" />;
  };

  if (!webAuthnService.isSupported()) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-orange-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Biometric Authentication</h3>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
            <span className="text-yellow-400">WebAuthn is not supported in this browser</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="h-6 w-6 text-orange-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Biometric Authentication</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Biometric</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
          <span className="text-green-400">{success}</span>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
          <h4 className="text-white font-semibold mb-4">Add New Biometric Credential</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Credential Name
              </label>
              <input
                type="text"
                value={newCredentialName}
                onChange={(e) => setNewCredentialName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all"
                placeholder="e.g., iPhone Face ID, YubiKey, Fingerprint"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddCredential}
                disabled={loading || !newCredentialName.trim()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Credential'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewCredentialName('');
                  setError('');
                  setSuccess('');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-white font-semibold">Your Biometric Credentials</h4>
        {credentials.length === 0 ? (
          <div className="text-center py-8">
            <Fingerprint className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No biometric credentials configured</p>
            <p className="text-gray-500 text-sm">Add a biometric credential to enable passwordless login</p>
          </div>
        ) : (
          <div className="space-y-3">
            {credentials.map((credential) => (
              <div
                key={credential.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {getCredentialIcon(credential.name)}
                  <div>
                    <p className="text-white font-medium">{credential.name}</p>
                    <p className="text-gray-400 text-sm">
                      Added {new Date(credential.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCredential(credential.id)}
                  disabled={loading}
                  className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-300 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-medium mb-1">Supported Authentication Methods:</p>
            <ul className="space-y-1 text-blue-400">
              <li>• Fingerprint sensors (Touch ID, Windows Hello)</li>
              <li>• Face recognition (Face ID, Windows Hello)</li>
              <li>• Hardware security keys (YubiKey, Titan Key)</li>
              <li>• Platform authenticators (TPM, Secure Enclave)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricSettings;