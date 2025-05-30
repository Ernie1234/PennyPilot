import { ActivityIndicator, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants/colors";
import { styles } from "@/styles/home.styles";

const Loader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default Loader;
