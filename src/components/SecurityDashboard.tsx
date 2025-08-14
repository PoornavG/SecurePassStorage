import React from 'react';
import { Calendar, AlertCircle, Clock } from 'lucide-react';

interface Props {
  stats: {
    lastLogin: string;
    failedAttempts: number;
    nextPasswordChange: string;
  };
}

const SecurityDashboard: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center mb-3">
          <Clock className="h-6 w-6 text-orange-400 mr-2" />
          <h4 className="text-white font-bold">Last Login</h4>
        </div>
        <p className="text-gray-300">{stats.lastLogin || 'Loading...'}</p>
      </div>
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center mb-3">
          <AlertCircle className="h-6 w-6 text-red-400 mr-2" />
          <h4 className="text-white font-bold">Failed Attempts</h4>
        </div>
        <p className="text-gray-300">{stats.failedAttempts}</p>
      </div>
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center mb-3">
          <Calendar className="h-6 w-6 text-green-400 mr-2" />
          <h4 className="text-white font-bold">Next Password Change</h4>
        </div>
        <p className="text-gray-300">{stats.nextPasswordChange || 'Loading...'}</p>
      </div>
    </div>
  );
};

export default SecurityDashboard;
