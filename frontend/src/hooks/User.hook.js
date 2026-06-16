import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginApi, signupApi, getProfileApi } from "../api/user.api";

// Login Hook
export const userLoginHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      if (data?.token) {
        queryClient.invalidateQueries(["get-user"]);
      }
    },
  });
};

// Register/Signup Hook
export const userRegisterHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signupApi,
    onSuccess: (data) => {
      if (data?.token) {
        queryClient.invalidateQueries(["get-user"]);
      }
    },
  });
};

// Logout Hook
export const userLogoutHook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
    },
    onSuccess: () => {
      queryClient.setQueryData(["get-user"], null);
      queryClient.removeQueries();
    },
  });
};

// Get Current User Hook
export const GetUserHook = () => {
  return useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;
      try {
        const profile = await getProfileApi();
        return { user: profile?.data };
      } catch (err) {
        // Clear invalid tokens
        localStorage.removeItem("token");
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
