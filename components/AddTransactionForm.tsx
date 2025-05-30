import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import { useCreateTransaction } from "@/hooks/useTransactions";

export const AddTransactionForm = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const { userId } = useAuth();
  const { mutate: createTransaction, isPending } = useCreateTransaction(
    userId!
  );

  const handleSubmit = () => {
    if (!amount || !description || !category) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber)) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    createTransaction(
      {
        amount: amountNumber,
        description,
        category,
      },
      {
        onSuccess: () => {
          setAmount("");
          setDescription("");
          setCategory("");
        },
        onError: () => {
          Alert.alert("Error", "Failed to create transaction");
        },
      }
    );
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{
          marginBottom: 8,
          padding: 8,
          borderWidth: 1,
          borderColor: "gray",
        }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{
          marginBottom: 8,
          padding: 8,
          borderWidth: 1,
          borderColor: "gray",
        }}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={{
          marginBottom: 8,
          padding: 8,
          borderWidth: 1,
          borderColor: "gray",
        }}
      />
      <Button
        title={isPending ? "Adding..." : "Add Transaction"}
        onPress={handleSubmit}
        disabled={isPending}
      />
    </View>
  );
};
