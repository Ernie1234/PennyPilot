import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import { useDeleteTransaction, useTransactions } from "@/hooks/useTransactions";
import { styles } from "@/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { formatMongoDate } from "@/libs/utils";

export const CATEGORY_ICONS = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Bills: "receipt",
  Entertainment: "film",
  Income: "cash",
  Other: "ellipsis-horizontal",
} as const;

export const TransactionList = () => {
  const { userId } = useAuth();
  const {
    data: transactions,
    isLoading,
    error,
    isError,
  } = useTransactions(userId!);
  const { mutate: deleteTransaction } = useDeleteTransaction(userId!);
  if (isLoading) {
    return <ActivityIndicator size="large" color={COLORS.primary} />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={24} color={COLORS.expense} />
        <Text style={styles.errorText}>Error loading transactions</Text>
      </View>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={40} color={COLORS.textLight} />
        <Text style={styles.emptyText}>No transactions yet!</Text>
        <Text style={styles.emptySubtext}>Add your first transaction</Text>
      </View>
    );
  }

  console.log("Error in transaction list: ", error);

  type TTransactionCategory = keyof typeof CATEGORY_ICONS;

  function isKnownCategory(category: string): category is TTransactionCategory {
    return category in CATEGORY_ICONS;
  }

  return (
    <FlatList
      style={styles.transactionsList}
      contentContainerStyle={styles.transactionsListContent}
      data={transactions}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        const isIncome = item.amount > 0;
        const amountColor = isIncome ? COLORS.income : COLORS.expense;

        const iconName = isKnownCategory(item.category)
          ? CATEGORY_ICONS[item.category]
          : "pricetags";

        return (
          <View style={styles.transactionCard} key={item._id}>
            <TouchableOpacity style={styles.transactionContent}>
              <View style={styles.categoryIconContainer}>
                <Ionicons name={iconName} size={22} color={amountColor} />
              </View>
              <View style={styles.transactionLeft}>
                <Text style={styles.transactionTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
              </View>
              <View style={styles.transactionRight}>
                <Text
                  style={[styles.transactionAmount, { color: amountColor }]}
                >
                  {isIncome ? "+" : "-"} ₦{item.amount.toFixed(2)}
                </Text>
                <Text style={styles.transactionDate}>
                  {formatMongoDate(item.date)}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTransaction(item._id)}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};

{
  /* <View
style={{
  padding: 16,
  flexDirection: "row",
  justifyContent: "space-between",
}}
>
<View>
  <Text style={{ fontSize: 16 }}>{item.description}</Text>
  <Text style={{ color: "gray" }}>{item.category}</Text>
</View>
<View style={{ alignItems: "flex-end" }}>
  <Text style={{ fontSize: 16 }}>${item.amount.toFixed(2)}</Text>
  <TouchableOpacity onPress={() => deleteTransaction(item._id)}> 
    <Text style={{ color: "red" }}>Delete</Text>
  </TouchableOpacity>
</View>
</View> */
}
