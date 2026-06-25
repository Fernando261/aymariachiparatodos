import React, { useEffect, useState } from "react";
import { Image } from "react-native";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { router } from "expo-router";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";

import { COLORS } from "@/constants/colors";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
const [passwordFocused, setPasswordFocused] = useState(false);

  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(-40);

  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(60);

  const buttonScale = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 1200 });
    logoTranslateY.value = withTiming(0, { duration: 1200 });

    cardOpacity.value = withTiming(1, { duration: 1400 });
    cardTranslateY.value = withTiming(0, { duration: 1400 });
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <LinearGradient
      colors={["#121212", "#1A1A1A", "#232323"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <Animated.View
          style={[styles.logoContainer, logoAnimatedStyle]}
        >
          <View style={styles.glow} />

          <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                />
          <View style={styles.separator} />
        </Animated.View>

        <Animated.View
          style={[cardAnimatedStyle]}
        >
          <BlurView
            intensity={35}
            tint="dark"
            style={styles.card}
          >
            <Text style={styles.label}>
              Correo electrónico
            </Text>

            <TextInput
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#888"
              style={styles.input}
            />

            <Text style={styles.label}>
              Contraseña
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                secureTextEntry={!showPassword}
                placeholder="********"
                placeholderTextColor="#888"
                style={styles.passwordInput}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                />
              <TouchableOpacity
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              >
                <Text style={styles.eye}>
                  {showPassword ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>

            <Animated.View
              style={[
                styles.buttonWrapper,
                buttonAnimatedStyle,
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.button}
                onPressIn={() => {
                  buttonScale.value = withSpring(0.96);
                }}
                onPressOut={() => {
                  buttonScale.value = withSpring(1);
                }}

                onPress={() => router.replace("/event-details")}
              >
                <Text style={styles.buttonText}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              onPress={() => router.push("/register")}
            >
              <Text style={styles.registerText}>
                ¿No tienes cuenta? Crear cuenta
              </Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({

passwordFocused: {
  borderWidth: 2,
  borderColor: COLORS.gold,
},

  container: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  glow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },

 logo: {
  width: 180,
  height: 180,
  marginBottom: 10,
},
  title: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: "800",
  },

  subtitle: {
    color: COLORS.gold,
    fontSize: 20,
    marginTop: 5,
    letterSpacing: 2,
  },

  separator: {
    width: 120,
    height: 2,
    backgroundColor: COLORS.gold,
    marginTop: 18,
    borderRadius: 10,
  },

  card: {
    width: width * 0.9,

    padding: 25,

    borderRadius: 30,

    borderWidth: 1,
    borderColor: COLORS.glassBorder,

    overflow: "hidden",

    backgroundColor: COLORS.glass,
  },

  label: {
    color: COLORS.white,
    marginBottom: 8,
    marginTop: 10,
    fontWeight: "600",
  },

  input: {
    height: 56,

    borderRadius: 16,

    paddingHorizontal: 16,

    backgroundColor: "rgba(255,255,255,0.08)",

    color: COLORS.white,
  },

  passwordContainer: {
  flexDirection: "row",
  alignItems: "center",

  backgroundColor: "rgba(255,255,255,0.08)",

  borderRadius: 16,

  paddingHorizontal: 16,

  borderWidth: 1,
  borderColor: "transparent",
},

  passwordInput: {
    flex: 1,
    height: 56,
    color: COLORS.white,
  },

  eye: {
    fontSize: 22,
  },

  buttonWrapper: {
    marginTop: 25,
  },

  button: {
    height: 58,

    backgroundColor: COLORS.gold,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: COLORS.gold,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 6,
  },

  buttonText: {
    color: COLORS.black,
    fontWeight: "800",
    fontSize: 16,
  },

  registerText: {
    textAlign: "center",

    color: COLORS.goldLight,

    marginTop: 20,

    fontWeight: "600",
  },
});