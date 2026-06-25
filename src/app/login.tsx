import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { COLORS } from "@/constants/colors";

const MAX_LOGIN_WIDTH = 460;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
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
  }, [cardOpacity, cardTranslateY, logoOpacity, logoTranslateY]);

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
    <ImageBackground
      source={require("@/assets/images/mariachis/mariachibg.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(18,18,18,0.34)",
          "rgba(18,18,18,0.42)",
          "rgba(0,0,0,0.45)",
        ]}
        locations={[0, 0.58, 1]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboard}
        >
          <View style={[styles.contentWrapper, styles.webShell]}>
            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
              />
              <View style={styles.separator} />
            </Animated.View>

            <Animated.View style={[styles.cardWrapper, cardAnimatedStyle]}>
              <BlurView intensity={35} tint="dark" style={styles.card}>
                <Text style={styles.label}>Correo electrónico</Text>

                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor="#888"
                  style={[styles.input, emailFocused && styles.focusedInput]}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />

                <Text style={styles.label}>Contraseña</Text>

                <View
                  style={[
                    styles.passwordContainer,
                    passwordFocused && styles.focusedInput,
                  ]}
                >
                  <TextInput
                    secureTextEntry={!showPassword}
                    placeholder="********"
                    placeholderTextColor="#888"
                    style={styles.passwordInput}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    hitSlop={10}
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    <PasswordVisibilityIcon hidden={!showPassword} />
                  </TouchableOpacity>
                </View>

                <Animated.View style={[styles.buttonWrapper, buttonAnimatedStyle]}>
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
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                  </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity onPress={() => router.push("/register")}>
                  <Text style={styles.registerText}>
                    ¿No tienes cuenta? Crear cuenta
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

function PasswordVisibilityIcon({ hidden }: { hidden: boolean }) {
  return (
    <View style={styles.eyeIcon}>
      <View style={styles.eyePupil} />
      {hidden ? <View style={styles.eyeSlash} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  keyboard: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: Platform.OS === "web" ? 44 : 32,
  },

  contentWrapper: {
    width: "100%",
    maxWidth: MAX_LOGIN_WIDTH,
    justifyContent: "center",
  },

  webShell: {
    alignSelf: "center",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    width: Platform.OS === "web" ? 190 : 165,
    height: Platform.OS === "web" ? 122 : 106,
    resizeMode: "contain",
    marginBottom: 8,
  },

  separator: {
    width: 88,
    height: 2,
    backgroundColor: COLORS.gold,
    marginTop: 16,
    borderRadius: 10,
  },

  cardWrapper: {
    width: "100%",
  },

  card: {
    width: "100%",
    padding: Platform.OS === "web" ? 30 : 24,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(216,183,106,0.22)",
    overflow: "hidden",
    backgroundColor: "rgba(18,18,18,0.58)",
  },

  label: {
    color: COLORS.white,
    marginBottom: 8,
    marginTop: 10,
    fontWeight: "600",
  },

  input: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
    color: COLORS.white,
  },

  focusedInput: {
    borderColor: COLORS.gold,
    borderWidth: 1.5,
  },

  passwordContainer: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  passwordInput: {
    flex: 1,
    height: 56,
    color: COLORS.white,
  },

  passwordToggle: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },

  eyeIcon: {
    width: 24,
    height: 15,
    borderWidth: 1.8,
    borderColor: COLORS.goldLight,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-8deg" }],
  },

  eyePupil: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.goldLight,
  },

  eyeSlash: {
    position: "absolute",
    width: 29,
    height: 2,
    borderRadius: 2,
    backgroundColor: COLORS.goldLight,
    transform: [{ rotate: "38deg" }],
  },

  buttonWrapper: {
    marginTop: 25,
  },

  button: {
    height: 58,
    backgroundColor: COLORS.gold,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.gold,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 8,
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
