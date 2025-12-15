import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// TEMPORARY: Mock auth context without Supabase for screenshots
// TODO: Restore Supabase integration when ready

interface MockUser {
  id: string;
  email: string;
  user_metadata?: { full_name?: string };
}

interface AuthContextType {
  user: MockUser | null;
  session: any | null;
  userRole: "admin" | "student" | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string, 
    password: string, 
    fullName: string, 
    role?: "admin" | "student",
    classCode?: string,
    className?: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock user - change userRole to "student" to see student screens
  const [user] = useState<MockUser | null>({
    id: "mock-user-id",
    email: "usuario@teste.com",
    user_metadata: { full_name: "Maria Silva" }
  });
  const [session] = useState<any | null>({ user });
  const [userRole] = useState<"admin" | "student" | null>("admin"); // Change to "student" for student views
  const [loading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (_email: string, _password: string) => {
    return { error: null };
  };

  const signUp = async (
    _email: string, 
    _password: string, 
    _fullName: string, 
    _role: "admin" | "student" = "student",
    _classCode?: string,
    _className?: string
  ) => {
    return { error: null };
  };

  const signOut = async () => {
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
