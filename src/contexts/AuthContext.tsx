"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import StoreProvider from "@/lib/StoreProvider";
import { MessageGroupProvider } from "./MessageGroup";
import Cookies from "js-cookie"; // Import js-cookie
import {
  ILoginResponse,
  ILoginUser,
} from "@/app/(auth)/login/lib/types/loginTypes";
import { useRouter } from "next/navigation";
import {
  decryptData,
  encryptData,
  getDecryptedData,
  setEncryptedData,
} from "@/app/(auth)/login/lib/crypto/encryption";
import { BASE_URL_DEV } from "@/lib/api/apiSlice";

interface AuthContextType {
  user: ILoginResponse | null;
  login: (userData: ILoginResponse) => void;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: ILoginUser) => void;
  RedirectUrl: undefined | string;
  navigate: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ILoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  let RedirectUrl: undefined | string = undefined;

  const navigate = () => {
    if (RedirectUrl) {
      router.push(RedirectUrl);
      RedirectUrl = undefined;
    }
  };

  // Function to verify accessToken
  const verifyToken = async (
    token: string,
    sessionId: string,
    refreshToken: string,
  ) => {
    try {
      // Verify accessToken using /auth/verify
      const verifyResponse = await fetch(BASE_URL_DEV + "/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token }),
      });

      if (verifyResponse.ok) {
        // Token is valid
        return true;
      }

      // If token is invalid, attempt to refresh it
      if (verifyResponse.status === 401) {
        const refreshResponse = await fetch(BASE_URL_DEV + "/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();

          // Update tokens in localStorage and cookies
          setEncryptedData("token", data.accessToken, 1); // Encrypt and store token in cookies
          return true;
        }
      }

      // If refreshing fails, logout the user
      setUser(null);
      logout();

      return false;
    } catch (error) {
      console.error("Error verifying token:", error);
      setUser(null);
      logout();

      return false;
    }
  };

  // Function to retrieve and decrypt user data from localStorage
  const loadUserFromStorage = async () => {
    setIsLoading(true);
    const encryptedUser = localStorage.getItem("userData");
    const token = getDecryptedData("token"); // Get token from cookies
    const sessionId = getDecryptedData("sessionId");
    // const refreshToken = Cookies.get("refreshToken");
    const refreshToken = getDecryptedData("refreshToken");

    if (token && sessionId && refreshToken) {
      // Verify token and refresh if necessary
      const verified = await verifyToken(token, sessionId, refreshToken);

      if (verified && encryptedUser) {
        const decryptedUser = decryptData(encryptedUser);
        if (decryptedUser) {
          setUser(decryptedUser);
        }
      } else {
        logout();
      }
    } else {
      logout();
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadUserFromStorage(); // Load user on page reload
  }, []);

  const login = (userData: ILoginResponse) => {
    // Encrypt and store user data in localStorage and cookies
    const encryptedUserData = encryptData(userData); // Encrypt the whole user object
    localStorage.setItem("userData", encryptedUserData); // Store encrypted user in localStorage
    setEncryptedData("token", userData.authentication.accessToken, 1); // Encrypt and store token in cookies
    setEncryptedData("sessionId", userData.authentication.sessionId, 30); // Store sessionId in cookies
    setEncryptedData("refreshToken", userData.authentication.refreshToken, 30);

    setUser(userData);
  };

  const updateUser = (userData: ILoginUser) => {
    if (user) {
      const updatedData: ILoginResponse = {
        ...user,
        data: userData,
      };

      // Encrypt and update the user object in localStorage
      const encryptedUserData = encryptData(updatedData);
      localStorage.setItem("userData", encryptedUserData);

      // Update state with the decrypted user data
      const decryptedUser = decryptData(encryptedUserData);
      if (decryptedUser) {
        setUser(decryptedUser);
      }
    }
  };

  const logout = () => {
    // Clear user data from localStorage and cookies
    setUser(null);
    localStorage.removeItem("userData");
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("sessionId");
    navigate(); // Navigate to home page on logout
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        updateUser,
        RedirectUrl,
        navigate,
      }}
    >
      <StoreProvider>
        <MessageGroupProvider>{children}</MessageGroupProvider>
      </StoreProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
