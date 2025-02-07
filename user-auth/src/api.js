import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const checkUsernameAvailability = async (username) => {
    try {
        const response = await axios.get(`${BASE_URL}/check-username/${username}`);
        return response.data.exists;
    } catch (error) {
        console.error('Username check error:', error);
        throw error;
    }
};

export const signup = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/user-pass`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Signup error:', error.response.data);
        throw error.response.data;
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response.data);
        throw error.response.data;
    }
};