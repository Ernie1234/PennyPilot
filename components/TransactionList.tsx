import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import { useDeleteTransaction, useTransactions } from "@/hooks/useTransactions";
import { styles } from "@/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { formatMongoDate } from "@/libs/utils";
import { useRouter } from "expo-router";

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
    refetch,
  } = useTransactions(userId!);
  const { mutate: deleteTransaction } = useDeleteTransaction(userId!);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.log("Error refreshing transactions: ", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading && !refreshing) {
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
        <TouchableOpacity
          style={[styles.addButton, { marginTop: 16 }]}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add expenses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log("Error in transaction list: ", error);

  type TTransactionCategory = keyof typeof CATEGORY_ICONS;
  type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];
  const isKnownCategory = (
    category: string
  ): category is TTransactionCategory => {
    return Object.keys(CATEGORY_ICONS).includes(category);
  };

  const getCategoryIcon = (category: string): IoniconsName => {
    return isKnownCategory(category) ? CATEGORY_ICONS[category] : "pricetags";
  };
  return (
    <FlatList
      style={styles.transactionsList}
      contentContainerStyle={styles.transactionsListContent}
      data={transactions}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
      renderItem={({ item }) => {
        const isIncome = item.amount > 0;
        const amountColor = isIncome ? COLORS.income : COLORS.expense;

        const dateToFormat = item.updatedAt || new Date();

        const iconName = getCategoryIcon(item.category);

        return (
          <View style={styles.transactionCard}>
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
                  {formatMongoDate(dateToFormat)}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTransaction(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};
