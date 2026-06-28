import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");

const CONTENT = {"title": "Perfil", "subtitle": "Gestiona tu información, preferencias y datos de contratación.", "icon": "account-outline"};

export default function TemporaryPremiumScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <Image source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.dimLayer} />
          <LinearGradient colors={["rgba(0,0,0,0.24)", "rgba(0,0,0,0.58)", "rgba(0,0,0,0.86)"]} style={StyleSheet.absoluteFill} />
          <View style={styles.goldLineTop} />
          <View style={styles.goldLineBottom} />

          <View style={styles.content}>
            <View style={styles.iconCard}>
              <MaterialCommunityIcons name={CONTENT.icon} size={42} color={COLORS.gold} />
            </View>
            <Text style={styles.kicker}>¡Ay! Mariachi Para Todos</Text>
            <Text style={styles.title}>{CONTENT.title}</Text>
            <Text style={styles.subtitle}>{CONTENT.subtitle}</Text>

            <TouchableOpacity activeOpacity={0.86} onPress={() => router.back()}>
              <BlurView intensity={28} tint="dark" style={styles.backButton}>
                <Ionicons name="arrow-back" size={18} color={COLORS.gold} />
                <Text style={styles.backButtonText}>Volver</Text>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000000" },
  safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000000" },
  appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black, ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.42, shadowRadius: 40 }, default: {} }) },
  dimLayer: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.42)" },
  goldLineTop: { position: "absolute", top: 94, left: 24, right: 24, height: 1, backgroundColor: "rgba(216,183,106,0.22)" },
  goldLineBottom: { position: "absolute", bottom: 94, left: 34, right: 34, height: 1, backgroundColor: "rgba(216,183,106,0.18)" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 },
  iconCard: { width: 78, height: 78, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(216,183,106,0.32)", marginBottom: 22 },
  kicker: { color: COLORS.gold, fontSize: 12, fontWeight: "900", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, textAlign: "center" },
  title: { color: COLORS.ivory, fontSize: 42, lineHeight: 48, fontWeight: "900", textAlign: "center", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  subtitle: { marginTop: 16, color: "rgba(247,243,235,0.76)", fontSize: 17, lineHeight: 25, fontWeight: "600", textAlign: "center" },
  backButton: { marginTop: 34, height: 56, minWidth: 170, borderRadius: 18, flexDirection: "row", gap: 9, alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(216,183,106,0.34)" },
  backButtonText: { color: COLORS.gold, fontSize: 16, fontWeight: "900" },
});
