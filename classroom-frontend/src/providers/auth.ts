import { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: error.message || "Invalid email or password",
          },
        };
      }

      if (data) {
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Login failed",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: (error as Error)?.message || "An error occurred during login",
        },
      };
    }
  },

  register: async ({ email, password, name, image, role, imageCldPubId }: { email: string; password: string; name: string; image?: string; role?: string; imageCldPubId?: string,  }) => {
    try {
      // Better-auth expects specific field names
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: image || undefined, // This is the built-in image field
        role: role || "student",
        imageCldPubId: imageCldPubId || undefined,
      });

      if (error) {
        console.error("Registration error:", error);
        return {
          success: false,
          error: {
            name: "RegisterError",
            message: error.message || "Registration failed",
          },
        };
      }

      if (data) {
        return {
          success: true,
          redirectTo: "/login",
        };
      }

      return {
        success: false,
        error: {
          name: "RegisterError",
          message: "Registration failed",
        },
      };
    } catch (error) {
      console.error("Registration exception:", error);
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: (error as Error)?.message || "An error occurred during registration",
        },
      };
    }
  },

  logout: async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        return {
          success: false,
          error: {
            name: "LogoutError",
            message: error.message || "Logout failed",
          },
        };
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LogoutError",
          message: (error as Error)?.message || "An error occurred during logout",
        },
      };
    }
  },

  check: async () => {
    try {
      const session = await authClient.getSession();

      if (session?.data) {
    return {
      authenticated: true,
    };
      }

      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
        message: (error as Error)?.message || "An error occurred during authentication check",
      };
    }
  },

  getIdentity: async () => {
    try {
      const session = await authClient.getSession();

      if (session?.data?.user) {
        return {
          id: session.data.user.id,
          name: session.data.user.name,
          email: session.data.user.email,
          avatar: session.data.user.image,
        };
      }

      return null;
    } catch (error) {
        console.error(error);
      return null;
    }
  },

  onError: async (error) => {
    console.error("Auth error:", error);
    return { error };
  },
};
