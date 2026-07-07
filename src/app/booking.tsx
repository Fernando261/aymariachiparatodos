import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BellIcon, CalendarIcon, CheckCircleIcon, ChevronRightIcon, MenuIcon, ShieldIcon, TicketIcon, UsersIcon } from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");

export default function BookingScreen() {
  const { mariachiId, musicians, category } = useLocalSearchParams<{ mariachiId?: string; musicians?: string; category?: string }>();
  const contextLine = [musicians ? `${musicians} elementos` : null, category || null].filter(Boolean).join(" • ");

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <Image source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.dimLayer} />
          <LinearGradient colors={["rgba(0,0,0,0.24)", "rgba(0,0,0,0.56)", "rgba(0,0,0,0.9)"]} locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.goldLineTop} />

          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.75} style={styles.headerSquare} onPress={() => router.back()}><MenuIcon size={26} color={COLORS.ivory} strokeWidth={2.1} /></TouchableOpacity>
            <Image source={logoImage} resizeMode="contain" style={styles.logo} />
            <TouchableOpacity activeOpacity={0.75} style={styles.headerSquare}><BellIcon size={25} color={COLORS.ivory} strokeWidth={2.1} /><View style={styles.notificationBadge} /></TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Solicitar contratación</Text>
            <View style={styles.titleOrnament}><View style={styles.ornamentLine} /><View style={styles.ornamentDiamond} /></View>
            <Text style={styles.subtitle}>Revisaremos disponibilidad y te guiaremos al siguiente paso.</Text>

            <BlurView intensity={34} tint="dark" style={styles.summaryCard}>
              <View style={styles.iconCircle}><ShieldIcon size={32} color={COLORS.goldLight} strokeWidth={1.9} /></View>
              <Text style={styles.cardLabel}>Mariachi seleccionado</Text>
              <Text style={styles.mariachiId}>Grupo #{mariachiId || "—"}</Text>
              {contextLine ? <Text style={styles.contextLine}>{contextLine}</Text> : null}

              <View style={styles.divider} />
              <InfoRow Icon={CheckCircleIcon} text="Identidad protegida hasta confirmar la solicitud." />
              <InfoRow Icon={UsersIcon} text="Equipo verificado para eventos en la zona metropolitana." />
              <InfoRow Icon={CalendarIcon} text="Elige fecha, horario y detalles en el flujo final." />
            </BlurView>

            <TouchableOpacity activeOpacity={0.86} style={styles.primaryButton} onPress={() => router.push("/my-events")}>
              <TicketIcon size={20} color={COLORS.black} strokeWidth={2.4} />
              <Text style={styles.primaryButtonText}>Continuar solicitud</Text>
              <ChevronRightIcon size={19} color={COLORS.black} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function InfoRow({ Icon, text }: { Icon: (props: { size?: number; color?: string; strokeWidth?: number }) => React.ReactElement; text: string }) {
  return <View style={styles.infoRow}><Icon size={18} color={COLORS.goldLight} strokeWidth={2} /><Text style={styles.infoText}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000" },
  safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000" },
  appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black, ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.42, shadowRadius: 40 }, default: {} }) },
  dimLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.36)" },
  goldLineTop: { position: "absolute", top: 92, left: 18, right: 18, height: 1, backgroundColor: "rgba(216,183,106,0.2)" },
  header: { height: 76, marginHorizontal: 19, marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerSquare: { width: 54, height: 54, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(18,18,18,0.58)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  logo: { position: "absolute", left: 116, right: 116, top: 1, height: 70 },
  notificationBadge: { position: "absolute", top: 7, right: 8, width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.goldLight, borderWidth: 1, borderColor: COLORS.black },
  content: { flex: 1, paddingHorizontal: 19, paddingTop: 28 },
  title: { color: COLORS.ivory, fontSize: 42, lineHeight: 49, fontWeight: "900", letterSpacing: -1.1, fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  titleOrnament: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 12 },
  ornamentLine: { width: 32, height: 2, borderRadius: 2, backgroundColor: COLORS.goldLight },
  ornamentDiamond: { width: 9, height: 9, borderWidth: 2, borderColor: COLORS.goldLight, transform: [{ rotate: "45deg" }] },
  subtitle: { marginTop: 15, color: "rgba(247,243,235,0.74)", fontSize: 17, lineHeight: 24, fontWeight: "700" },
  summaryCard: { marginTop: 26, borderRadius: 28, overflow: "hidden", padding: 20, backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(216,183,106,0.3)" },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(216,183,106,0.12)", borderWidth: 1, borderColor: "rgba(216,183,106,0.34)" },
  cardLabel: { marginTop: 18, color: "rgba(247,243,235,0.62)", fontSize: 13, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1 },
  mariachiId: { marginTop: 5, color: COLORS.ivory, fontSize: 30, fontWeight: "900", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  contextLine: { marginTop: 8, color: COLORS.goldLight, fontSize: 15, fontWeight: "900" },
  divider: { marginVertical: 18, height: 1, backgroundColor: "rgba(255,255,255,0.13)" },
  infoRow: { flexDirection: "row", gap: 10, alignItems: "flex-start", marginBottom: 13 },
  infoText: { flex: 1, color: "rgba(247,243,235,0.73)", fontSize: 14.5, lineHeight: 21, fontWeight: "700" },
  primaryButton: { minHeight: 58, borderRadius: 21, marginTop: 18, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9, backgroundColor: COLORS.goldLight },
  primaryButtonText: { color: COLORS.black, fontSize: 16, fontWeight: "900" },
});
