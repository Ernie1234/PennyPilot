import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { COLORS } from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "outline";
  style?: object;
}

export const AppBtn = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "default",
  style,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "outline" ? styles.outlineButton : styles.defaultButton,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === "outline" ? styles.outlineText : styles.defaultText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  defaultButton: {
    backgroundColor: COLORS.primary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  defaultText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
});
