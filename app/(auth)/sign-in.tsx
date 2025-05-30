import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TextInput as RNTextInput,
} from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const emailRef = React.useRef<RNTextInput>(null);
  const passwordRef = React.useRef<RNTextInput>(null);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Password is incorrect. Please try again!");
        // console.error(JSON.stringify(err, null, 2));
      } else {
        setError("An error occured. Please try again!");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.container,
            { justifyContent: "flex-start", paddingTop: 80, gap: 30 },
          ]}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Text style={[styles.title, { marginVertical: 0 }]}>Sign in</Text>
            <Text style={styles.subTitle}>Welcome back to Piggy Pilot</Text>
            <Image
              source={require("../../assets/images/pp3.png")}
              style={styles.illustration}
              contentFit="contain"
            />
          </View>
          <View>
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={COLORS.expense}
                />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError("")}>
                  <Ionicons name="close" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            ) : null}

            <TextInput
              ref={emailRef}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              autoCapitalize="none"
              style={[styles.input, error && styles.errorInput]}
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor="#9a8478"
              onChangeText={(email) => setEmailAddress(email)}
            />
            <TextInput
              value={password}
              ref={passwordRef}
              style={[styles.input, error && styles.errorInput]}
              placeholder="Enter password"
              placeholderTextColor="#9a8478"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity style={styles.button} onPress={onSignInPress}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don&apos;t have an account?</Text>
              <Link href="/sign-up">
                <Text style={styles.linkText}>Sign Up</Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// password  -  Joe@2791
