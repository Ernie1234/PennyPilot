import { View, Text } from "react-native";
import { styles } from "@/styles/home.styles";
import { COLORS } from "@/constants/colors";

interface ISummary {
  summary: { income: number; balance: number; expenses: number };
}

export const BalanceCard = ({ summary }: ISummary) => {
  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Total Balance</Text>
      <Text style={styles.balanceAmount}>₦ {summary.balance.toFixed(2)}</Text>
      <View style={styles.balanceStats}>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Income</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
            + ₦{summary.income.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.balanceStatItem, styles.statDivider]} />
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Expenses</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
            - ₦{summary.expenses.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};
