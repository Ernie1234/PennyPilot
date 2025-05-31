import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

interface ToggleOption {
  label: string;
  value: string;
}

interface ToggleProps {
  label: string;
  value: string;
  options: ToggleOption[];
  onValueChange: (value: string) => void;
}

export const AppToggle = ({
  label,
  value,
  options,
  onValueChange,
}: ToggleProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.toggleContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.toggleOption,
              value === option.value && styles.activeOption,
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Text
              style={[
                styles.toggleText,
                value === option.value && styles.activeText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  activeOption: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 16,
    color: COLORS.text,
  },
  activeText: {
    color: COLORS.white,
  },
});
