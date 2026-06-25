import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";

import { router } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

import { COLORS } from "@/constants/colors";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const logoOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withTiming(1, {
      duration: 1200,
    });

    cardOpacity.value = withTiming(1, {
      duration: 1500,
    });
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleRegister = () => {
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        "Campos incompletos",
        "Completa todos los campos."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Error",
        "Las contraseñas no coinciden."
      );
      return;
    }

    router.replace("/event-details");
  };

  return (
    <LinearGradient
      colors={["#121212", "#1A1A1A", "#232323"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
        style={styles.keyboard}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            logoAnimatedStyle,
          ]}
        >
          <Text style={styles.title}>
            Crear Cuenta
          </Text>

          <Text style={styles.subtitle}>
            Únete a ¡Ay! Mariachi Para Todos
          </Text>

          <View style={styles.separator} />
        </Animated.View>

        <Animated.View style={cardAnimatedStyle}>
          <BlurView
            intensity={35}
            tint="dark"
            style={styles.card}
          >
            <Text style={styles.label}>
              Nombre completo
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>
              Correo electrónico
            </Text>

            <TextInput
              style={styles.input}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>
              Teléfono
            </Text>

            <TextInput
              style={styles.input}
              placeholder="3312345678"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <Text style={styles.label}>
              Contraseña
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                placeholder="********"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              >
                <Text style={styles.eye}>
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>
              Confirmar contraseña
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                secureTextEntry={
                  !showConfirmPassword
                }
                placeholder="********"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={
                  setConfirmPassword
                }
              />

              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                <Text style={styles.eye}>
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
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
                onPress={handleRegister}
                onPressIn={() =>
                  (buttonScale.value =
                    withSpring(0.96))
                }
                onPressOut={() =>
                  (buttonScale.value =
                    withSpring(1))
                }
              >
                <Text style={styles.buttonText}>
                  Crear Cuenta
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              onPress={() =>
                router.back()
              }
            >
              <Text
                style={styles.loginText}
              >
                ¿Ya tienes cuenta?
                Inicia sesión
              </Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: "800",
  },

  subtitle: {
    color: COLORS.gold,
    marginTop: 8,
    fontSize: 16,
  },

  separator: {
    width: 120,
    height: 2,
    marginTop: 15,
    backgroundColor: COLORS.gold,
  },

  card: {
    width: width * 0.9,
    padding: 25,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },

  label: {
    color: COLORS.white,
    marginBottom: 8,
    marginTop: 10,
    fontWeight: "600",
  },

  input: {
    height: 55,
    borderRadius: 16,
    backgroundColor: COLORS.glass,
    paddingHorizontal: 16,
    color: COLORS.white,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.glass,
    borderRadius: 16,
    paddingHorizontal: 16,
  },

  passwordInput: {
    flex: 1,
    height: 55,
    color: COLORS.white,
  },

  eye: {
    fontSize: 20,
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
  },

  buttonText: {
    color: COLORS.black,
    fontWeight: "800",
    fontSize: 16,
  },

  loginText: {
    textAlign: "center",
    color: COLORS.goldLight,
    marginTop: 20,
    fontWeight: "600",
  },
});