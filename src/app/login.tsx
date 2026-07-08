import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { CrownIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, MusicIcon, ShieldIcon, UserIcon, UsersIcon } from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");

type AccountType = "user" | "mariachi";
type AuthMode = "login" | "register";
type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  groupName: string;
  representativeName: string;
  phone: string;
  zone: string;
};
type FieldKey = keyof FormValues;
type FieldConfig = {
  key: FieldKey;
  label: string;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  secure?: boolean;
  Icon: typeof UserIcon;
};

const initialValues: FormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  groupName: "",
  representativeName: "",
  phone: "",
  zone: "",
};

const copy = {
  user: {
    login: {
      title: "Bienvenido",
      subtitle: "Accede para encontrar el mariachi ideal",
      button: "Entrar",
      switchText: "¿No tienes cuenta?",
      switchAction: "Crear cuenta",
    },
    register: {
      title: "Crea tu cuenta",
      subtitle: "Reserva música para tus mejores momentos",
      button: "Crear cuenta",
      switchText: "¿Ya tienes cuenta?",
      switchAction: "Iniciar sesión",
    },
  },
  mariachi: {
    login: {
      title: "Acceso mariachi",
      subtitle: "Gestiona solicitudes, agenda y ganancias",
      button: "Entrar como mariachi",
      switchText: "¿Aún no estás registrado?",
      switchAction: "Crear cuenta mariachi",
    },
    register: {
      title: "Registra tu grupo",
      subtitle: "Comienza a recibir solicitudes",
      button: "Crear cuenta mariachi",
      switchText: "¿Ya tienes cuenta mariachi?",
      switchAction: "Iniciar sesión",
    },
  },
} as const;

const fields: Record<AccountType, Record<AuthMode, FieldConfig[]>> = {
  user: {
    login: [
      { key: "email", label: "Correo electrónico", placeholder: "correo@ejemplo.com", keyboardType: "email-address", Icon: MailIcon },
      { key: "password", label: "Contraseña", placeholder: "Contraseña", secure: true, Icon: LockIcon },
    ],
    register: [
      { key: "fullName", label: "Nombre completo", placeholder: "Tu nombre", Icon: UserIcon },
      { key: "email", label: "Correo electrónico", placeholder: "correo@ejemplo.com", keyboardType: "email-address", Icon: MailIcon },
      { key: "password", label: "Contraseña", placeholder: "Contraseña", secure: true, Icon: LockIcon },
      { key: "confirmPassword", label: "Confirmar contraseña", placeholder: "Confirmar contraseña", secure: true, Icon: ShieldIcon },
    ],
  },
  mariachi: {
    login: [
      { key: "email", label: "Correo del grupo", placeholder: "grupo@ejemplo.com", keyboardType: "email-address", Icon: MailIcon },
      { key: "password", label: "Contraseña", placeholder: "Contraseña", secure: true, Icon: LockIcon },
    ],
    register: [
      { key: "groupName", label: "Nombre del grupo", placeholder: "Mariachi Guadalajara", Icon: MusicIcon },
      { key: "representativeName", label: "Nombre del representante", placeholder: "Representante", Icon: UserIcon },
      { key: "email", label: "Correo del grupo", placeholder: "grupo@ejemplo.com", keyboardType: "email-address", Icon: MailIcon },
      { key: "phone", label: "Teléfono", placeholder: "3312345678", keyboardType: "phone-pad", Icon: UsersIcon },
      { key: "zone", label: "Zona principal", placeholder: "Guadalajara, Zapopan, Tlaquepaque", Icon: CrownIcon },
      { key: "password", label: "Contraseña", placeholder: "Contraseña", secure: true, Icon: LockIcon },
      { key: "confirmPassword", label: "Confirmar contraseña", placeholder: "Confirmar contraseña", secure: true, Icon: ShieldIcon },
    ],
  },
};

export default function LoginScreen() {
  const params = useLocalSearchParams<{ mode?: string; type?: string }>();
  const [accountType, setAccountType] = useState<AccountType>(params.type === "mariachi" ? "mariachi" : "user");
  const [authMode, setAuthMode] = useState<AuthMode>(params.mode === "register" ? "register" : "login");
  const [values, setValues] = useState<FormValues>(initialValues);
  const [focusedField, setFocusedField] = useState<FieldKey | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const introOpacity = useSharedValue(0);
  const introTranslate = useSharedValue(-18);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    introOpacity.value = withTiming(1, { duration: 700 });
    introTranslate.value = withTiming(0, { duration: 700 });
  }, [introOpacity, introTranslate]);

  const currentCopy = copy[accountType][authMode];
  const currentFields = useMemo(() => fields[accountType][authMode], [accountType, authMode]);
  const formKey = `${accountType}-${authMode}`;

  const introAnimatedStyle = useAnimatedStyle(() => ({
    opacity: introOpacity.value,
    transform: [{ translateY: introTranslate.value }],
  }));
  const buttonAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: buttonScale.value }] }));

  const updateValue = (key: FieldKey, value: string) => setValues((current) => ({ ...current, [key]: value }));

  const changeAccountType = (type: AccountType) => {
    if (type !== accountType) {
      setAccountType(type);
      setFocusedField(null);
    }
  };

  const changeAuthMode = () => {
    setAuthMode((mode) => (mode === "login" ? "register" : "login"));
    setFocusedField(null);
  };

  const handleSubmit = () => {
    if (!values.email.trim()) {
      Alert.alert("Correo requerido", accountType === "mariachi" ? "Ingresa el correo del grupo." : "Ingresa tu correo electrónico.");
      return;
    }
    if (!values.password.trim()) {
      Alert.alert("Contraseña requerida", "Ingresa tu contraseña.");
      return;
    }
    if (authMode === "register") {
      if (accountType === "mariachi" && !values.groupName.trim()) {
        Alert.alert("Nombre del grupo requerido", "Ingresa el nombre de tu grupo mariachi.");
        return;
      }
      if (values.password !== values.confirmPassword) {
        Alert.alert("Contraseñas distintas", "Las contraseñas no coinciden.");
        return;
      }
    }

    router.replace(accountType === "mariachi" ? "/mariachi-dashboard" : "/event-details");
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <Image source={backgroundImage} resizeMode="cover" style={StyleSheet.absoluteFill} />
          <View style={styles.dimLayer} />
          <LinearGradient colors={["rgba(0,0,0,0.32)", "rgba(0,0,0,0.58)", "rgba(0,0,0,0.9)"]} locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.goldLineTop} />
          <View style={styles.goldLineBottom} />

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <Animated.View style={[styles.header, introAnimatedStyle]}>
                <Image source={logoImage} resizeMode="contain" style={styles.logo} />
                <Animated.View key={`copy-${formKey}`} entering={FadeInDown.duration(360).springify()} exiting={FadeOutUp.duration(180)} style={styles.heroCopy}>
                  <Text style={styles.title}>{currentCopy.title}</Text>
                  <View style={styles.titleOrnament}><View style={styles.ornamentLine} /><View style={styles.ornamentDiamond} /></View>
                  <Text style={styles.subtitle}>{currentCopy.subtitle}</Text>
                </Animated.View>
              </Animated.View>

              <BlurView intensity={28} tint="dark" style={styles.segmentedControl}>
                <SegmentButton active={accountType === "user"} label="Soy usuario" Icon={UserIcon} onPress={() => changeAccountType("user")} />
                <SegmentButton active={accountType === "mariachi"} label="Soy mariachi" Icon={MusicIcon} onPress={() => changeAccountType("mariachi")} />
              </BlurView>

              <Animated.View key={formKey} entering={FadeInDown.duration(420).springify().damping(18)} exiting={FadeOutUp.duration(170)} layout={Layout.springify().damping(18)} style={styles.cardWrapper}>
                <BlurView intensity={34} tint="dark" style={styles.card}>
                  {currentFields.map((field) => {
                    const showPassword = visiblePasswords[field.key];
                    const isFocused = focusedField === field.key;
                    return (
                      <View key={field.key} style={styles.fieldGroup}>
                        <Text style={styles.label}>{field.label}</Text>
                        <View style={[styles.inputShell, isFocused && styles.inputShellFocused]}>
                          <field.Icon size={20} color={isFocused ? COLORS.goldLight : "rgba(247,243,235,0.52)"} strokeWidth={2} />
                          <TextInput
                            autoCapitalize="none"
                            keyboardType={field.keyboardType ?? "default"}
                            onBlur={() => setFocusedField(null)}
                            onChangeText={(text) => updateValue(field.key, text)}
                            onFocus={() => setFocusedField(field.key)}
                            placeholder={field.placeholder}
                            placeholderTextColor="rgba(247,243,235,0.4)"
                            secureTextEntry={field.secure && !showPassword}
                            style={styles.input}
                            value={values[field.key]}
                          />
                          {field.secure ? (
                            <TouchableOpacity accessibilityRole="button" accessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} hitSlop={10} onPress={() => setVisiblePasswords((current) => ({ ...current, [field.key]: !current[field.key] }))} style={styles.passwordToggle}>
                              {showPassword ? <EyeOffIcon size={21} color={COLORS.goldLight} strokeWidth={2} /> : <EyeIcon size={21} color={COLORS.goldLight} strokeWidth={2} />}
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </View>
                    );
                  })}

                  <Animated.View style={[styles.buttonWrapper, buttonAnimatedStyle]}>
                    <Pressable
                      onPress={handleSubmit}
                      onPressIn={() => { buttonScale.value = withSpring(0.97); }}
                      onPressOut={() => { buttonScale.value = withSpring(1); }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>{currentCopy.button}</Text>
                    </Pressable>
                  </Animated.View>

                  <TouchableOpacity activeOpacity={0.75} onPress={changeAuthMode} style={styles.modeSwitch}>
                    <Text style={styles.modeSwitchText}>{currentCopy.switchText} <Text style={styles.modeSwitchAction}>{currentCopy.switchAction}</Text></Text>
                  </TouchableOpacity>
                </BlurView>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SegmentButton({ active, label, Icon, onPress }: { active: boolean; label: string; Icon: typeof UserIcon; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress} style={[styles.segmentButton, active && styles.segmentButtonActive]}>
      <Icon size={19} color={active ? COLORS.black : "rgba(247,243,235,0.62)"} strokeWidth={2.3} />
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.black },
  safeArea: { flex: 1, backgroundColor: COLORS.black },
  appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", alignSelf: "center", overflow: "hidden", backgroundColor: COLORS.black },
  dimLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },
  goldLineTop: { position: "absolute", top: 0, left: 24, right: 24, height: 1, backgroundColor: "rgba(216,183,106,0.36)" },
  goldLineBottom: { position: "absolute", bottom: 0, left: 24, right: 24, height: 1, backgroundColor: "rgba(216,183,106,0.3)" },
  keyboard: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 22, paddingTop: 24, paddingBottom: 30 },
  header: { alignItems: "center", marginBottom: 18 },
  logo: { width: Platform.OS === "web" ? 210 : 188, height: Platform.OS === "web" ? 112 : 98, marginBottom: 4 },
  heroCopy: { alignItems: "center" },
  title: { color: COLORS.ivory, fontSize: 31, lineHeight: 37, fontWeight: "900", textAlign: "center", letterSpacing: -0.6 },
  subtitle: { color: "rgba(247,243,235,0.76)", fontSize: 15, lineHeight: 21, marginTop: 9, textAlign: "center", paddingHorizontal: 10 },
  titleOrnament: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 9 },
  ornamentLine: { width: 76, height: 1, backgroundColor: "rgba(216,183,106,0.75)" },
  ornamentDiamond: { width: 7, height: 7, marginLeft: -41, backgroundColor: COLORS.gold, transform: [{ rotate: "45deg" }] },
  segmentedControl: { flexDirection: "row", gap: 8, padding: 7, borderRadius: 23, borderWidth: 1, borderColor: "rgba(216,183,106,0.22)", overflow: "hidden", backgroundColor: "rgba(10,10,10,0.54)", marginBottom: 15 },
  segmentButton: { flex: 1, minHeight: 48, borderRadius: 17, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  segmentButtonActive: { backgroundColor: COLORS.gold, shadowColor: COLORS.gold, shadowOpacity: 0.32, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  segmentText: { color: "rgba(247,243,235,0.66)", fontSize: 14, fontWeight: "800" },
  segmentTextActive: { color: COLORS.black },
  cardWrapper: { width: "100%" },
  card: { width: "100%", padding: 20, borderRadius: 30, borderWidth: 1, borderColor: "rgba(216,183,106,0.24)", overflow: "hidden", backgroundColor: "rgba(15,15,15,0.64)", shadowColor: COLORS.black, shadowOpacity: 0.42, shadowRadius: 24, shadowOffset: { width: 0, height: 14 }, elevation: 10 },
  fieldGroup: { marginBottom: 13 },
  label: { color: COLORS.ivory, marginBottom: 8, fontSize: 13, fontWeight: "800", letterSpacing: 0.2 },
  inputShell: { minHeight: 54, borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", paddingHorizontal: 14, backgroundColor: "rgba(255,255,255,0.08)", flexDirection: "row", alignItems: "center", gap: 10 },
  inputShellFocused: { borderColor: COLORS.gold, backgroundColor: "rgba(255,255,255,0.11)" },
  input: { flex: 1, minHeight: 54, color: COLORS.white, fontSize: 15, fontWeight: "600" },
  passwordToggle: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  buttonWrapper: { marginTop: 9 },
  button: { height: 58, borderRadius: 20, backgroundColor: COLORS.gold, justifyContent: "center", alignItems: "center", shadowColor: COLORS.gold, shadowOpacity: 0.34, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  buttonText: { color: COLORS.black, fontWeight: "900", fontSize: 16, letterSpacing: 0.2 },
  modeSwitch: { alignItems: "center", paddingTop: 18, paddingBottom: 2 },
  modeSwitchText: { color: "rgba(247,243,235,0.78)", fontWeight: "700", textAlign: "center", lineHeight: 21 },
  modeSwitchAction: { color: COLORS.goldLight, fontWeight: "900" },
});
