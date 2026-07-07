import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { CalendarIcon, ChevronRightIcon } from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <Image source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.dimLayer} />
          <LinearGradient colors={["rgba(0,0,0,0.24)", "rgba(0,0,0,0.58)", "rgba(0,0,0,0.88)"]} style={StyleSheet.absoluteFill} />
          <Image source={logoImage} resizeMode="contain" style={styles.logo} />

          <View style={styles.content}>
            <BlurView intensity={30} tint="dark" style={styles.card}>
              <View style={styles.iconCard}><CalendarIcon size={42} color={COLORS.gold} strokeWidth={1.8} /></View>
              <Text style={styles.kicker}>¡Ay! Mariachi Para Todos</Text>
              <Text style={styles.title}>Detalle del evento</Text>
              <Text style={styles.subtitle}>Evento #{eventId ?? ""}</Text>
              <TouchableOpacity activeOpacity={0.86} onPress={() => router.back()} style={styles.backButton}>
                <View style={styles.backIcon}><ChevronRightIcon size={18} color={COLORS.gold} strokeWidth={2.2} /></View>
                <Text style={styles.backButtonText}>Volver</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000000" },
  safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000000" },
  appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black },
  dimLayer: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.44)" },
  logo: { position: "absolute", alignSelf: "center", top: 18, width: 190, height: 82 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  card: { width: "100%", borderRadius: 28, overflow: "hidden", alignItems: "center", padding: 28, backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(216,183,106,0.28)" },
  iconCard: { width: 78, height: 78, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(216,183,106,0.32)", marginBottom: 22 },
  kicker: { color: COLORS.gold, fontSize: 12, fontWeight: "900", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, textAlign: "center" },
  title: { color: COLORS.ivory, fontSize: 40, lineHeight: 46, fontWeight: "900", textAlign: "center", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  subtitle: { marginTop: 16, color: "rgba(247,243,235,0.76)", fontSize: 18, lineHeight: 25, fontWeight: "800", textAlign: "center" },
  backButton: { marginTop: 34, height: 56, minWidth: 170, borderRadius: 18, flexDirection: "row", gap: 9, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(216,183,106,0.08)", borderWidth: 1, borderColor: "rgba(216,183,106,0.45)" },
  backIcon: { transform: [{ rotate: "180deg" }] },
  backButtonText: { color: COLORS.gold, fontSize: 16, fontWeight: "900" },
});
