import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SecurityTester from './SecurityTester';
import { Shield, Lock, Key, Cpu, Database, CheckCircle, LogOut, User } from 'lucide-react';
import api, { authAPI } from '../services/api';

// Define a type for login attempts
interface LoginAttempt {
  status: string;
  ip: string;
  timestamp: string;
}

const Home: React.FC = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [protectedData, setProtectedData] = React.useState<string | null>(null);
  const [showToken, setShowToken] = React.useState(false);
  const [hideProtectedEndpoint, setHideProtectedEndpoint] = React.useState(false);
  const [hideShowToken, setHideShowToken] = React.useState(false);
  const [loginAttempts, setLoginAttempts] = React.useState<LoginAttempt[]>([]);

  React.useEffect(() => {
    // Check if user just signed up
    if (localStorage.getItem('justSignedUp')) {
      setHideProtectedEndpoint(true);
      setHideShowToken(true);
      localStorage.removeItem('justSignedUp'); // Only hide once
    }
    // Fetch login attempts
    if (user) {
      authAPI.getLoginAttempts(user).then((data) => {
        setLoginAttempts(data.attempts || []);
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const testProtectedEndpoint = async () => {
    try {
      const response = await api.get('/protected');
      setProtectedData(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      setProtectedData('Access denied or error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-orange-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">SecurePass</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-white">
                <User className="h-5 w-5 mr-2" />
                <span>Welcome, {user}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Your Account is <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-orange-400">Secure</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Your password is protected using military-grade encryption. Here's how we keep you safe.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Argon2 Hashing */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-full mr-4">
                <Cpu className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Argon2 Hashing</h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Your password is hashed using <strong className="text-orange-400">Argon2id</strong>, 
                the winner of the Password Hashing Competition and the gold standard for password security.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Memory-hard algorithm resistant to GPU attacks
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Configurable time and memory costs
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Parallel processing support
                </li>
              </ul>
            </div>
          </div>

          {/* Custom Salting */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-600 to-pink-600 p-3 rounded-full mr-4">
                <Key className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Advanced Salting</h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Each password uses a unique salt generated from your username using SHA-256, 
                then strategically mixed into your password.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Unique salt for every user
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Multi-part salt integration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Prevents rainbow table attacks
                </li>
              </ul>
            </div>
          </div>

          {/* Security Configuration */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-3 rounded-full mr-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Security Configuration</h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Our system uses enterprise-grade security parameters to maximize protection.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-400">65,536</div>
                  <div className="text-sm text-gray-400">Memory Cost (KB)</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-400">5</div>
                  <div className="text-sm text-gray-400">Time Cost</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">2</div>
                  <div className="text-sm text-gray-400">Parallelism</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-amber-400">SHA-256</div>
                  <div className="text-sm text-gray-400">Salt Hash</div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-full mr-4">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Data Protection</h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Your password is never stored in plain text. Only the final hash is saved to our secure database.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Zero-knowledge architecture
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Encrypted database storage
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Irreversible hashing process
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Process */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">How Your Password Gets Protected</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Salt Generation</h4>
              <p className="text-gray-400 text-sm">Your username is hashed with SHA-256 to create a unique salt</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-600 to-pink-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Password Salting</h4>
              <p className="text-gray-400 text-sm">Salt is strategically mixed into your password at multiple points</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Argon2 Hashing</h4>
              <p className="text-gray-400 text-sm">The salted password is hashed using Argon2id algorithm</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Secure Storage</h4>
              <p className="text-gray-400 text-sm">Only the final hash is stored in our encrypted database</p>
            </div>
          </div>
        </div>

        {/* Security Testing Suite */}
        <SecurityTester />
        <div className="mt-8 w-full max-w-5xl flex flex-col md:flex-row justify-between items-start gap-8 mx-auto">
          <div className="flex-1 flex flex-col items-start w-full md:w-1/2">
            {!hideProtectedEndpoint && (
              <button onClick={testProtectedEndpoint} className="px-4 py-2 bg-orange-600 text-white rounded mb-4">
                Test Protected Endpoint
              </button>
            )}
            {protectedData && (
              <pre className="bg-gray-900 text-green-400 p-4 rounded mt-2 w-full max-w-xl text-left">{protectedData}</pre>
            )}
          </div>
          <div className="flex-1 flex flex-col items-end w-full md:w-1/2">
            {!hideShowToken && (
              <button
                onClick={() => setShowToken((prev) => !prev)}
                className="px-4 py-2 bg-orange-600 text-white rounded mb-4 self-end"
              >
                {showToken ? 'Hide JWT Token' : 'Show JWT Token'}
              </button>
            )}
            {showToken && token && !hideShowToken && (
              <div className="w-full max-w-xl flex flex-col items-end self-end">
                <span className="text-orange-400 font-semibold mb-2 self-end">Your JWT Token:</span>
                <div className="bg-gray-900 text-orange-300 p-4 rounded border border-orange-400 shadow-inner w-full overflow-x-auto break-all text-sm select-all text-right self-end" style={{ wordBreak: 'break-all' }}>
                  {token}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Login Attempts Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">Recent Login Attempts</h3>
          {loginAttempts.length === 0 ? (
            <p className="text-gray-400">No login attempts found.</p>
          ) : (
            <table className="min-w-full text-sm text-gray-300">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Status</th>
                  <th className="px-2 py-1 text-left">IP</th>
                  <th className="px-2 py-1 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {loginAttempts.slice(0, 10).map((attempt, idx) => (
                  <tr key={idx}>
                    <td className={`px-2 py-1 font-semibold ${attempt.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{attempt.status}</td>
                    <td className="px-2 py-1">{attempt.ip}</td>
                    <td className="px-2 py-1">{new Date(attempt.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;