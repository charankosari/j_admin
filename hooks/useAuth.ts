"use client";

import { useEffect, useState } from 'react';
import { APISDK, type IUser } from '@/libs/api';

export const useAuth = () => {
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Effect to get token from localStorage (runs once)
    useEffect(() => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                setAccessToken(token);
                setIsAuthenticated(true); // Set authenticated immediately if token exists
            } else {
                setIsLoading(false);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            setIsLoading(false);
            setIsAuthenticated(false);
        }
    }, []);
    
    // Effect to fetch user data when token is available
    useEffect(() => {
        if(!accessToken) {
            setIsLoading(false);
            return;
        }
        
        const fetchUser = async () => {
            try {
                const cleanToken = accessToken.startsWith('"') && accessToken.endsWith('"') 
                    ? accessToken.slice(1, -1) 
                    : accessToken;
                
                const api = APISDK.getInstance(cleanToken);
                const userData = await api.getUser();
                
                if (userData) {
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    throw new Error('Invalid user data received');
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                // Don't clear token on network errors
                if (error instanceof Error && error.message !== 'Failed to fetch') {
                    localStorage.removeItem('access_token');
                    setIsAuthenticated(false);
                    setUser(undefined);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [accessToken]);

    const refreshAuth = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setAccessToken(token);
        }
    };

    return {
        user,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        setUser,
        refreshAuth
    };
};
