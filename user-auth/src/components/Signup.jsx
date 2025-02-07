import React, { useState } from 'react';
import { signup } from '../api';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const result = await signup(username, password);
            alert('Signup successful!');
        } catch (err) {
            setError(err.error || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;