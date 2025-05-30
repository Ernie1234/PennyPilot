import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/api";

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await api.get("/transactions");
      return data;
    },
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTransaction) => api.post("/transactions", newTransaction),
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
    },
  });
};
