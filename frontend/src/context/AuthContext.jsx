import { createContext, useCallback, useMemo, useRef, useState } from "react";
import { authService } from "../services/authService";
import { configureHttpClient } from "../services/httpClient";
import { sessionStore } from "../utils/storage";
import { isTokenExpired } from "../utils/jwt";

export const AuthContext = createContext(null);

function loadSession() {
  const session = sessionStore.read();
  if (!session?.token || isTokenExpired(session.token)) {
    sessionStore.clear();
    return null;
  }
  return session;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);
  const tokenRef = useRef(session?.token ?? null);

  const logout = useCallback(() => {
    sessionStore.clear();
    tokenRef.current = null;
    setSession(null);
  }, []);

  // Configure synchronously so the first request after mount already has the token.
  configureHttpClient({
    tokenGetter: () => tokenRef.current,
    unauthorizedHandler: logout,
  });

  const login = useCallback(async (credentials) => {
    const { user, token } = await authService.login(credentials);
    const next = { user, token };
    sessionStore.write(next);
    tokenRef.current = token;
    setSession(next);
    return user;
  }, []);

  const register = useCallback(
    async ({ name, email, password }) => {
      await authService.register({ name, email, password });
      return login({ email, password });
    },
    [login]
  );

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.token),
      login,
      register,
      logout,
    }),
    [session, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
