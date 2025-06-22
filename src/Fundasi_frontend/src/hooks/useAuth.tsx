import { useState, useEffect, useCallback } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { Fundasi_backend } from '../../../declarations/Fundasi_backend';
import type { _SERVICE, User } from '../../../declarations/Fundasi_backend/Fundasi_backend.did';

export const useAuth = () => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principalId, setPrincipalId] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeAuthClient = useCallback(async () => {
    const client = await AuthClient.create({
      idleOptions: {
        disableIdle: true,
      },
    });
    setAuthClient(client);
    return client;
  }, []);

  const login = useCallback(async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: 'https://identity.ic0.app',
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        Actor.agentOf(Fundasi_backend)?.replaceIdentity?.(identity);
        const principal = identity.getPrincipal().toText();
        setPrincipalId(principal);
        setIsAuthenticated(true);
        await fetchUserData(principal);
      },
      onError: (err) => {
        setError('Login failed');
        console.error(err);
      },
    });
  }, [authClient]);

  const logout = useCallback(async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipalId('');
    setUser(null);
  }, [authClient]);

  const fetchUserData = useCallback(async (pid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const principal = Principal.fromText(pid);
      const res = await Fundasi_backend.getUserByPrincipal(principal);

      if ('ok' in res) {
        setUser(res.ok as User);
      } else {
        console.error('User not found, registering new user...');
        const created = await Fundasi_backend.registerUser("Anonymous");
        if ('ok' in created) {
          setUser(created.ok);
        } else {
          setError(created.err);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const client = await initializeAuthClient();
      const isAuth = await client.isAuthenticated();
      setAuthClient(client);
      if (isAuth) {
        const identity = client.getIdentity();
        Actor.agentOf(Fundasi_backend)?.replaceIdentity?.(identity);
        const principal = identity.getPrincipal().toText();
        setPrincipalId(principal);
        setIsAuthenticated(true);
        await fetchUserData(principal);
      } else {
        setIsLoading(false);
      }
    };

    init();
  }, [initializeAuthClient, fetchUserData]);

  return {
    user,
    isAuthenticated,
    principalId,
    isLoading,
    error,
    login,
    logout,
  };
};
