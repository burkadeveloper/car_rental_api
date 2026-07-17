import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, isLoading, error } = useSelector((state) => state.auth);
  return { user, isLoading, error, isAuthenticated: !!user };
};
