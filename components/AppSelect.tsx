import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

// Define the exact Ionicons names you'll be using
type IoniconsName =
  | "fast-food"
  | "cart"
  | "car"
  | "receipt"
  | "film"
  | "cash"
  | "ellipsis-horizontal"
  | "chevron-down";

interface SelectItem {
  label: string;
  value: string;
  icon?: IoniconsName;
}

interface SelectProps {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  items: SelectItem[];
}

export const AppSelect = ({
  label,
  placeholder,
  value,
  onValueChange,
  error,
  items,
}: SelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = items.find((item) => item.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.select, error && styles.errorSelect]}
        onPress={() => setModalVisible(true)}
      >
        {selectedItem ? (
          <View style={styles.selectedItem}>
            {selectedItem.icon && (
              <Ionicons
                name={selectedItem.icon}
                size={20}
                color={COLORS.primary}
                style={styles.icon}
              />
            )}
            <Text style={styles.selectedText}>{selectedItem.label}</Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.option}
                onPress={() => {
                  onValueChange(item.value);
                  setModalVisible(false);
                }}
              >
                {item.icon && (
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={COLORS.primary}
                    style={styles.optionIcon}
                  />
                )}
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 6,
  },
  select: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    height: 48,
  },
  errorSelect: {
    borderColor: COLORS.expense,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.text,
  },
  placeholder: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.expense,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
});
