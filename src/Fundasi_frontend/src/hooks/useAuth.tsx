import { useState, useEffect, useCallback } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { Fundasi_backend } from "../../../declarations/Fundasi_backend";
import type {
  _SERVICE,
  User,
} from "../../../declarations/Fundasi_backend/Fundasi_backend.did";

export const useAuth = () => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principalId, setPrincipalId] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [hasProfile, setHasProfile] = useState<boolean>(false);

  const initializeAuthClient = useCallback(async () => {
    const client = await AuthClient.create();
    setAuthClient(client);
    return client;
  }, []);

  const login = useCallback(async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        Actor.agentOf(Fundasi_backend)?.replaceIdentity?.(identity);
        const principal = identity.getPrincipal().toText();
        setPrincipalId(principal);
        setIsAuthenticated(true);
        await fetchUserData(principal);
      },
      onError: (err) => {
        setError("Login failed");
        console.error(err);
      },
    });
  }, [authClient]);

  const logout = useCallback(async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipalId("");
    setUser(null);
  }, [authClient]);

  const fetchUserData = useCallback(async (pid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const principal = Principal.fromText(pid);
      const res = await Fundasi_backend.getUserByPrincipal(principal);
      if ("ok" in res) {
        const userData = res.ok as User;
        setUser(userData);
        console.log("Fetched user from backend:", userData);
        // setHasProfile(userData.hasProfile);
      } else {
        console.error("User not found, registering new user..." + res.err);
        const tempUsername = "Anonymous_" + Date.now();
        const created = await Fundasi_backend.registerUser(tempUsername);
        if ("ok" in created) {
          const newUser = created.ok;
          setUser(newUser);
          console.log("User data set in useAuth:", newUser);
          // setHasProfile(false);
        } else {
          setError(created.err);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch user data");
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

  const refreshUser = useCallback(async () => {
    if (principalId) {
      await fetchUserData(principalId);
    }
  }, [principalId, fetchUserData]);

  return {
    user,
    // hasProfile,
    isAuthenticated,
    principalId,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
  };
};
