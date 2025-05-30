import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";

import { QueryProvider } from "@/providers/queryProvider";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk publishable key");
  }
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <QueryProvider>
        <Slot />
      </QueryProvider>
    </ClerkProvider>
  );
}
