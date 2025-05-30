import { View, Text, StyleSheet } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/SignOutButton";
// import { useTransactions } from "@/hooks/useTransactions";

export default function ProfileScreen() {
  const { user } = useUser();
  // const { data: transactions } = useTransactions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Email: {user?.emailAddresses[0].emailAddress}</Text>
      {/* <Text>Total Transactions: {transactions?.length || 0}</Text> */}
      <SignOutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
