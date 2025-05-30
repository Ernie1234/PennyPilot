import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { CATEGORY_ICONS } from "@/components/TransactionList";

type TTransactionCategory = keyof typeof CATEGORY_ICONS;

interface ITransaction {
  _id: string;
  userId: string;
  amount: number;
  title: string;
  description: string;
  category: TTransactionCategory | string;
  date: Date;
}

interface CreateTransactionDto {
  userId: string;
  title: string;
  amount: number;
  description: string;
  category: string;
}

export const useTransactions = (userId: string) => {
  return useQuery<ITransaction[]>({
    queryKey: ["transactions", userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/transaction/${userId}`);
      return data;
    },
  });
};

export const useCreateTransaction = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newTransaction: Omit<CreateTransactionDto, "userId">
    ) => {
      return api.post("/api/v1/transaction", { userId, ...newTransaction });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
    },
    onError: (error) => {
      console.error("Failed to create transaction:", error);
    },
  });
};

export const useDeleteTransaction = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/api/v1/transaction/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
    },
  });
};
