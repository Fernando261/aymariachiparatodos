import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;

export default function TemporaryPremiumScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.appFrame}>
          <LinearGradient colors={["#050505", COLORS.black, "#080808"]} style={styles.container}>
            <View style={styles.goldGlowTop} />
            <View style={styles.goldGlowBottom} />

            <View style={styles.content}>
              <Text style={styles.kicker}>AY Mariachi</Text>
              <Text style={styles.title}>Mis eventos</Text>
              <Text style={styles.subtitle}>Administra tus próximas celebraciones y contrataciones.</Text>

              <TouchableOpacity activeOpacity={0.86} onPress={() => router.back()}>
                <BlurView intensity={26} tint="dark" style={styles.backButton}>
                  <Text style={styles.backButtonText}>Volver</Text>
                </BlurView>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000000" },
  safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000000" },
  appFrame: {
    flex: 1,
    width: "100%",
    maxWidth: MOBILE_WIDTH,
    overflow: "hidden",
    backgroundColor: COLORS.black,
    ...Platform.select({
      web: { shadowColor: "#000", shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.42, shadowRadius: 40 },
      default: {},
    }),
  },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 28 },
  goldGlowTop: { position: "absolute", top: -120, right: -100, width: 260, height: 260, borderRadius: 130, backgroundColor: "rgba(200,155,60,0.14)" },
  goldGlowBottom: { position: "absolute", bottom: -90, left: -130, width: 260, height: 260, borderRadius: 130, backgroundColor: "rgba(200,155,60,0.1)" },
  content: { alignItems: "center" },
  kicker: { color: COLORS.gold, fontSize: 14, fontWeight: "900", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 },
  title: { color: COLORS.ivory, fontSize: 42, lineHeight: 48, fontWeight: "900", textAlign: "center", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  subtitle: { marginTop: 16, color: "rgba(247,243,235,0.72)", fontSize: 17, lineHeight: 25, fontWeight: "600", textAlign: "center" },
  backButton: { marginTop: 34, height: 56, minWidth: 170, borderRadius: 18, alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.065)", borderWidth: 1, borderColor: "rgba(216,183,106,0.34)" },
  backButtonText: { color: COLORS.gold, fontSize: 16, fontWeight: "900" },
});
