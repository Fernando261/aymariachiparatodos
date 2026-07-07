import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChevronRightIcon, EditIcon } from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");

export default function EditProfileScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <Image source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.dimLayer} />
          <LinearGradient colors={["rgba(0,0,0,0.22)", "rgba(0,0,0,0.52)", "rgba(0,0,0,0.88)"]} locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.content}>
            <Image source={logoImage} resizeMode="contain" style={styles.logo} />
            <BlurView intensity={30} tint="dark" style={styles.card}>
              <View style={styles.iconCard}><EditIcon size={40} color={COLORS.goldLight} strokeWidth={1.9} /></View>
              <Text style={styles.title}>Editar perfil</Text>
              <Text style={styles.subtitle}>Muy pronto podrás actualizar tus datos personales desde esta pantalla.</Text>
              <TouchableOpacity activeOpacity={0.86} onPress={() => router.back()} style={styles.backButton}>
                <View style={styles.backIcon}><ChevronRightIcon size={18} color={COLORS.black} strokeWidth={2.4} /></View>
                <Text style={styles.backButtonText}>Volver al perfil</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000" },
  safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000" },
  appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black },
  dimLayer: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.42)" },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 22 },
  logo: { position: "absolute", top: 18, alignSelf: "center", width: 180, height: 82 },
  card: { borderRadius: 26, overflow: "hidden", alignItems: "center", padding: 28, backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" },
  iconCard: { width: 78, height: 78, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(216,183,106,0.1)", borderWidth: 1, borderColor: "rgba(216,183,106,0.34)", marginBottom: 20 },
  title: { color: COLORS.ivory, fontSize: 38, lineHeight: 44, fontWeight: "900", textAlign: "center", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  subtitle: { marginTop: 14, color: "rgba(247,243,235,0.74)", fontSize: 16, lineHeight: 23, fontWeight: "700", textAlign: "center" },
  backButton: { marginTop: 28, height: 54, borderRadius: 18, paddingHorizontal: 22, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.gold },
  backIcon: { transform: [{ rotate: "180deg" }] },
  backButtonText: { color: COLORS.black, fontSize: 16, fontWeight: "900" },
});
