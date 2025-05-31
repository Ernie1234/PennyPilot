import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useCreateTransaction } from "@/hooks/useTransactions";
import { CATEGORY_ICONS } from "@/libs/utils";
import { COLORS } from "@/constants/colors";
import { AppInput } from "@/components/AppInput";
import { AppToggle } from "@/components/AppToggle";
import { AppSelect } from "@/components/AppSelect";
import { AppBtn } from "@/components/AppBtn";

// Define validation schema with Zod
const transactionSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title too long"),
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  isExpense: z.boolean(),
  description: z.string().max(200, "Description too long").optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

// Extract category keys for the select component
const categories = Object.keys(CATEGORY_ICONS) as Array<
  keyof typeof CATEGORY_ICONS
>;

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useUser();
  const createTransaction = useCreateTransaction(user?.id!);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      category: "",
      isExpense: true,
      description: "",
    },
    mode: "onChange",
  });

  const isExpense = watch("isExpense");
  const onSubmit = async (data: TransactionFormData) => {
    try {
      const formattedAmount = data.isExpense
        ? -Math.abs(data.amount)
        : Math.abs(data.amount);

      await createTransaction.mutateAsync({
        title: data.title,
        amount: formattedAmount,
        category: data.category,
        description: data.description || "",
      });

      Alert.alert("Success", "Transaction created successfully");
      reset();
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create transaction");
      console.error("Transaction creation error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Title"
                placeholder="Enter transaction title"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.title?.message}
                autoCapitalize="words"
              />
            )}
          />

          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Amount"
                placeholder="Enter amount"
                value={value ? value.toString() : ""}
                onChangeText={(text) =>
                  onChange(Number(text.replace(/[^0-9.]/g, "")))
                }
                onBlur={onBlur}
                error={errors.amount?.message}
                keyboardType="numeric"
                leftIcon={<Text style={styles.currencySymbol}>₦</Text>}
              />
            )}
          />

          <Controller
            control={control}
            name="isExpense"
            render={({ field: { onChange, value } }) => (
              <AppToggle
                label="Transaction Type"
                value={value ? "expense" : "income"}
                options={[
                  { label: "Expense", value: "expense" },
                  { label: "Income", value: "income" },
                ]}
                onValueChange={(val) => onChange(val === "expense")}
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <AppSelect
                label="Category"
                placeholder="Select category"
                value={value}
                onValueChange={onChange}
                error={errors.category?.message}
                items={categories.map((cat) => ({
                  label: cat,
                  value: cat,
                  icon: CATEGORY_ICONS[cat],
                }))}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Description (Optional)"
                placeholder="Enter description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.description?.message}
                multiline
                numberOfLines={3}
              />
            )}
          />

          <View style={styles.buttonContainer}>
            <AppBtn
              title="Create Transaction"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || createTransaction.isPending}
              loading={createTransaction.isPending}
            />
            <AppBtn
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  form: {
    gap: 16,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    marginTop: 8,
  },
  currencySymbol: {
    fontSize: 16,
    color: COLORS.text,
    marginRight: 8,
  },
});
