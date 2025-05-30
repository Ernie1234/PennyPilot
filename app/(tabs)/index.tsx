import { useUser } from "@clerk/clerk-expo";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import SafeScreen from "@/components/SafeScreen";
import Loader from "@/components/Loader";
import { styles } from "@/styles/home.styles";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionList } from "@/components/TransactionList";

export default function Page() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return <Loader />; // or loading indicator
  }

  const getUserDisplayName = () => {
    if (user?.firstName) return user.firstName;
    if (user && user?.emailAddresses?.length > 0) {
      return user?.emailAddresses[0].emailAddress.split("@")[0];
    }
    return "User";
  };

  return (
    <SafeScreen>
      {/* <View style={{ flex: 1 }}>
        <AddTransactionForm />
        </View> */}

      <View style={styles.container}>
        <View style={styles.content}>
          {/* HEADER */}
          <View style={styles.header}>
            {/* LEFT */}
            <View style={styles.headerLeft}>
              <View
                style={{
                  height: 50,
                  width: 50,
                  overflow: "hidden",
                  borderRadius: "50%",
                  borderWidth: StyleSheet.hairlineWidth,
                  marginRight: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {user?.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    style={{ width: 50, height: 50 }}
                    contentFit="cover"
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/pp3.png")}
                    style={styles.headerLogo}
                    contentFit="contain"
                  />
                )}
              </View>
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Welcome, </Text>
                <Text style={styles.usernameText}>{getUserDisplayName()}</Text>
              </View>
            </View>

            {/* RIGHT */}
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: COLORS.primary }]}
                onPress={() => router.push("/profile")}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* BALANCE CARD UI */}
          <BalanceCard summary={{ income: 400, balance: 500, expenses: 800 }} />

          <View style={styles.transactionsContainer}>
            <Text style={styles.sectionTitle}>Recent Transaction</Text>
          </View>
        </View>

        <TransactionList />
      </View>
    </SafeScreen>
  );
}
