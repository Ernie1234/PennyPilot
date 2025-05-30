export function formatMongoDate(createdAt: string | Date): string {
  try {
    const date = new Date(createdAt);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

export const CATEGORY_ICONS = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Bills: "receipt",
  Entertainment: "film",
  Income: "cash",
  Other: "ellipsis-horizontal",
} as const;

type TTransactionCategory = keyof typeof CATEGORY_ICONS;

export function isKnownCategory(
  category: string
): category is TTransactionCategory {
  return category in CATEGORY_ICONS;
}
