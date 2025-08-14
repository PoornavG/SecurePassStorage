import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Key, ChevronRight } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-full">
                <Shield className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-white">
            Secure<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Pass</span>
          </h1>
          
          <div className="space-y-4 text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            <p className="leading-relaxed">
              Advanced password security using Argon2 encryption and custom salting algorithms.
            </p>
            <p className="leading-relaxed">
              Your credentials are protected with hashing that makes them virtually uncrackable.
            </p>
          </div>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <Lock className="h-8 w-8 text-orange-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Argon2 Encryption</h3>
            <p className="text-gray-400 text-sm">Industry-standard hashing algorithm resistant to GPU attacks</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <Key className="h-8 w-8 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Custom Salting</h3>
            <p className="text-gray-400 text-sm">Unique salt generation for each password adds extra security</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <Shield className="h-8 w-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Zero Knowledge</h3>
            <p className="text-gray-400 text-sm">Your passwords are never stored in plain text, ever</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            to="/login"
            className="group bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            Login
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link
            to="/signup"
            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/30 flex items-center justify-center"
          >
            Sign Up
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;