import { createContext, useContext } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  isGuest: false,
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
