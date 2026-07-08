import React, { useMemo, useState } from "react";
import { Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BellIcon, CalendarIcon, CheckCircleIcon, ChevronRightIcon, ClockIcon, DollarIcon, HomeIcon, LocationIcon, MailIcon, MenuIcon, MusicIcon, ShieldIcon, StarIcon, UserIcon } from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");
const providerImage = require("@/assets/images/mariachis/mariachi1.png");
const eventImage = require("@/assets/images/mariachis/mariachi1.png");

const serifFont = Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" });

type IconComponent = (props: { size?: number; color?: string; strokeWidth?: number }) => React.ReactElement;
type Tab = { label: string; Icon: IconComponent; active: boolean; onPress: () => void };

const mariachiStats = { alias: "Grupo Verificado #184", newRequests: 2, todayEvents: 1, estimatedEarnings: 4800, rating: 4.9, reviews: 182 };
const nextEvent = { id: "1", title: "Serenata sorpresa", time: "Hoy · 8:00 PM", location: "Zapopan, Jal.", image: eventImage };

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export function MariachiHeader() {
  return (
    <View style={styles.header}>
      <TouchableOpacity activeOpacity={0.75} style={styles.headerSquare}>
        <MenuIcon size={26} color={COLORS.ivory} strokeWidth={2.1} />
      </TouchableOpacity>
      <Image source={logoImage} resizeMode="contain" style={styles.logo} />
      <TouchableOpacity activeOpacity={0.75} style={styles.headerSquare}>
        <BellIcon size={25} color={COLORS.ivory} strokeWidth={2.1} />
        <View style={styles.notificationBadge} />
      </TouchableOpacity>
    </View>
  );
}

export function MariachiTabs({ active }: { active: string }) {
  const tabs: Tab[] = useMemo(
    () => [
      { label: "Inicio", Icon: HomeIcon, active: active === "Inicio", onPress: () => router.replace("/mariachi-dashboard") },
      { label: "Solicitudes", Icon: MailIcon, active: active === "Solicitudes", onPress: () => router.push("/mariachi-requests") },
      { label: "Agenda", Icon: CalendarIcon, active: active === "Agenda", onPress: () => router.push("/mariachi-schedule") },
      { label: "Ganancias", Icon: DollarIcon, active: active === "Ganancias", onPress: () => router.push("/mariachi-earnings") },
      { label: "Perfil", Icon: UserIcon, active: active === "Perfil", onPress: () => router.push("/mariachi-profile") },
    ],
    [active]
  );

  return (
    <BlurView intensity={34} tint="dark" style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.label} activeOpacity={0.8} style={styles.tabItem} onPress={tab.onPress}>
          <tab.Icon size={25} color={tab.active ? COLORS.gold : COLORS.gray} strokeWidth={2.2} />
          <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>{tab.label}</Text>
          {tab.active ? <View style={styles.tabIndicator} /> : null}
        </TouchableOpacity>
      ))}
    </BlurView>
  );
}

export function MariachiScreenShell({ title, subtitle, activeTab, children }: { title: string; subtitle?: string; activeTab?: string; children?: React.ReactNode }) {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <Image source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.dimLayer} />
          <LinearGradient colors={["rgba(0,0,0,0.22)", "rgba(0,0,0,0.48)", "rgba(0,0,0,0.88)"]} locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.goldLineTop} />
          <View style={styles.goldLineBottom} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <MariachiHeader />
            <View style={styles.heroCopy}>
              <Text style={styles.title}>{title}</Text>
              <View style={styles.titleOrnament}><View style={styles.ornamentLine} /><View style={styles.ornamentDiamond} /></View>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {children}
          </ScrollView>
          {activeTab ? <MariachiTabs active={activeTab} /> : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function MariachiDashboardScreen() {
  const [available, setAvailable] = useState(true);

  return (
    <MariachiScreenShell title="Panel del mariachi" subtitle="Gestiona tu agenda, solicitudes y ganancias" activeTab="Inicio">
      <BlurView intensity={30} tint="dark" style={styles.providerCard}>
        <View style={styles.providerAvatar}>
          <Image source={providerImage} resizeMode="cover" style={styles.providerAvatarImage} />
          <LinearGradient colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.5)"]} style={StyleSheet.absoluteFill} />
          <View style={styles.providerAvatarRing} />
          <View style={styles.providerBadge}><ShieldIcon size={18} color={COLORS.black} strokeWidth={2.5} /></View>
        </View>

        <View style={styles.providerInfo}>
          <View style={styles.providerTitleRow}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.providerName}>{mariachiStats.alias}</Text>
            <CheckCircleIcon size={22} color={COLORS.goldLight} strokeWidth={2.5} />
          </View>

          <TouchableOpacity activeOpacity={0.86} onPress={() => setAvailable((value) => !value)} style={[styles.availabilityPill, !available && styles.availabilityPillOff]}>
            <View style={styles.statusDotWrapper}><View style={[styles.statusDot, !available && styles.statusDotOff]} /></View>
            <View style={styles.statusTextContainer}>
              <Text numberOfLines={1} style={[styles.statusTitle, !available && styles.statusTitleOff]}>{available ? "Disponible" : "No disponible"}</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.statusSubtitle}>{available ? "Recibiendo solicitudes" : "No recibirás solicitudes"}</Text>
            </View>
            <View style={[styles.switchTrack, !available && styles.switchTrackOff]}><View style={[styles.switchThumb, !available && styles.switchThumbOff]} /></View>
          </TouchableOpacity>
        </View>
      </BlurView>

      <View style={styles.statsRow}>
        <MetricCard Icon={MailIcon} value={`${mariachiStats.newRequests}`} label="solicitudes nuevas" badge="2" />
        <MetricCard Icon={CalendarIcon} value={`${mariachiStats.todayEvents}`} label="evento hoy" />
        <MetricCard Icon={DollarIcon} value={`$${formatMoney(mariachiStats.estimatedEarnings)}`} label="estimados" isMoney />
      </View>

      <TouchableOpacity activeOpacity={0.88} style={styles.nextEventCard} onPress={() => router.push({ pathname: "/mariachi-event-detail", params: { eventId: nextEvent.id } })}>
        <Text style={styles.sectionLabel}>PRÓXIMO EVENTO</Text>
        <View style={styles.nextEventContent}>
          <ImageBackground source={nextEvent.image} resizeMode="cover" style={styles.nextEventImage} imageStyle={styles.nextEventImageStyle}>
            <LinearGradient colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.52)"]} style={StyleSheet.absoluteFill} />
          </ImageBackground>
          <View style={styles.nextEventInfo}>
            <Text numberOfLines={2} style={styles.nextEventTitle}>{nextEvent.title}</Text>
            <InfoRow Icon={ClockIcon} text={nextEvent.time} />
            <InfoRow Icon={LocationIcon} text={nextEvent.location} />
            <View style={styles.detailsButton}><Text style={styles.detailsText}>Ver detalles</Text><ChevronRightIcon size={22} color={COLORS.goldLight} strokeWidth={2.4} /></View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.88} style={styles.ratingCard} onPress={() => router.push("/mariachi-reviews")}>
        <View style={styles.medal}><MusicIcon size={20} color={COLORS.goldLight} strokeWidth={2} /><StarIcon size={38} color={COLORS.goldLight} strokeWidth={1.6} /></View>
        <View style={styles.ratingCopy}>
          <Text style={styles.sectionLabel}>CALIFICACIÓN ACTUAL</Text>
          <View style={styles.ratingRowBig}><Text style={styles.ratingNumber}>{mariachiStats.rating.toFixed(1)}</Text><View style={styles.ratingMeta}><Text style={styles.stars}>★★★★★</Text><Text style={styles.reviews}>{mariachiStats.reviews} reseñas</Text></View></View>
        </View>
        <ChevronRightIcon size={25} color={COLORS.goldLight} strokeWidth={2.2} />
      </TouchableOpacity>
    </MariachiScreenShell>
  );
}

function MetricCard({ Icon, value, label, badge, isMoney }: { Icon: IconComponent; value: string; label: string; badge?: string; isMoney?: boolean }) {
  return (
    <BlurView intensity={24} tint="dark" style={styles.statCard}>
      <View style={styles.statIconWrap}><Icon size={23} color={COLORS.goldLight} strokeWidth={2.1} />{badge ? <View style={styles.statBadge}><Text style={styles.statBadgeText}>{badge}</Text></View> : null}</View>
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} style={[styles.statValue, isMoney && styles.earningsValue]}>{value}</Text>
      <Text numberOfLines={2} style={styles.statLabel}>{label}</Text>
    </BlurView>
  );
}

function InfoRow({ Icon, text }: { Icon: IconComponent; text: string }) {
  return <View style={styles.infoRow}><Icon size={18} color={COLORS.goldLight} strokeWidth={2.1} /><Text numberOfLines={1} ellipsizeMode="tail" style={styles.infoText}>{text}</Text></View>;
}

export const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000000" },
  safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000000" },
  appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black, ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.42, shadowRadius: 40 }, default: {} }) },
  dimLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.36)" },
  goldLineTop: { position: "absolute", top: 92, left: 18, right: 18, height: 1, backgroundColor: "rgba(216,183,106,0.2)" },
  goldLineBottom: { position: "absolute", bottom: 87, left: 28, right: 28, height: 1, backgroundColor: "rgba(216,183,106,0.18)" },
  scrollContent: { paddingHorizontal: 19, paddingTop: 12, paddingBottom: 150 },
  header: { height: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerSquare: { width: 54, height: 54, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(18,18,18,0.58)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  logo: { position: "absolute", left: 116, right: 116, top: 1, height: 70 },
  notificationBadge: { position: "absolute", top: 7, right: 8, width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.goldLight, borderWidth: 1, borderColor: COLORS.black },
  heroCopy: { marginTop: 8, marginBottom: 16, alignItems: "center" },
  title: { color: COLORS.ivory, fontSize: 44, lineHeight: 48, fontWeight: "900", textAlign: "center", letterSpacing: -1.1, fontFamily: serifFont },
  titleOrnament: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 12 },
  ornamentLine: { width: 32, height: 2, borderRadius: 2, backgroundColor: COLORS.goldLight },
  ornamentDiamond: { width: 9, height: 9, borderWidth: 2, borderColor: COLORS.goldLight, transform: [{ rotate: "45deg" }] },
  subtitle: { marginTop: 12, color: "rgba(247,243,235,0.72)", fontSize: 16, lineHeight: 22, fontWeight: "700", textAlign: "center" },
  providerCard: { minHeight: 126, borderRadius: 24, overflow: "hidden", padding: 14, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14, backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.3, shadowRadius: 24 }, default: { elevation: 7 } }) },
  providerAvatar: { width: 88, height: 88, borderRadius: 44, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.62)", borderWidth: 1.5, borderColor: "rgba(216,183,106,0.62)" },
  providerAvatarImage: { width: 88, height: 88, borderRadius: 44 },
  providerAvatarRing: { position: "absolute", top: 5, right: 5, bottom: 5, left: 5, borderRadius: 39, borderWidth: 1, borderColor: "rgba(216,183,106,0.48)" },
  providerBadge: { position: "absolute", right: 0, bottom: 3, width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.goldLight, borderWidth: 2, borderColor: COLORS.black },
  providerInfo: { flex: 1, minWidth: 0, justifyContent: "center" },
  providerTitleRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 11 },
  providerName: { flex: 1, minWidth: 0, color: COLORS.ivory, fontSize: 24, lineHeight: 28, fontWeight: "900", letterSpacing: -0.5, fontFamily: serifFont },
  availabilityPill: { minHeight: 64, borderRadius: 32, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(25,78,32,0.26)", borderWidth: 1, borderColor: "rgba(94,224,121,0.45)" },
  availabilityPillOff: { backgroundColor: "rgba(80,80,80,0.18)", borderColor: "rgba(180,180,180,0.28)" },
  statusDotWrapper: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#5ee079" },
  statusDotOff: { backgroundColor: COLORS.gray },
  statusTextContainer: { flex: 1, minWidth: 0 },
  statusTitle: { color: "#8BE05E", fontSize: 20, lineHeight: 23, fontWeight: "800" },
  statusTitleOff: { color: COLORS.gray },
  statusSubtitle: { marginTop: 2, color: "rgba(247,243,235,0.72)", fontSize: 13, lineHeight: 16, fontWeight: "700" },
  switchTrack: { width: 54, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "flex-end", padding: 3, backgroundColor: "rgba(216,183,106,0.9)" },
  switchTrackOff: { alignItems: "flex-start", backgroundColor: "rgba(150,150,150,0.28)" },
  switchThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.ivory },
  switchThumbOff: { backgroundColor: COLORS.gray },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statCard: { flex: 1, minHeight: 105, borderRadius: 20, overflow: "hidden", padding: 12, alignItems: "flex-start", justifyContent: "space-between", backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" },
  statIconWrap: { width: 36, height: 36, borderRadius: 13, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(216,183,106,0.52)", backgroundColor: "rgba(216,183,106,0.08)" },
  statBadge: { position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.goldLight, borderWidth: 1, borderColor: COLORS.black },
  statBadgeText: { color: COLORS.black, fontSize: 12, fontWeight: "900" },
  statValue: { color: COLORS.ivory, fontSize: 26, lineHeight: 30, fontWeight: "900", fontFamily: serifFont },
  earningsValue: { fontSize: 24 },
  statLabel: { color: "rgba(247,243,235,0.72)", fontSize: 12, lineHeight: 16, fontWeight: "800" },
  nextEventCard: { borderRadius: 24, padding: 14, marginBottom: 14, backgroundColor: "rgba(18,18,18,0.78)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" },
  sectionLabel: { color: COLORS.gold, fontSize: 13, lineHeight: 17, letterSpacing: 1.8, fontWeight: "900" },
  nextEventContent: { marginTop: 12, flexDirection: "row", gap: 12, alignItems: "center" },
  nextEventImage: { width: 135, height: 115, borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "rgba(216,183,106,0.5)" },
  nextEventImageStyle: { borderRadius: 18 },
  nextEventInfo: { flex: 1, minWidth: 0, justifyContent: "center" },
  nextEventTitle: { color: COLORS.ivory, fontSize: 24, lineHeight: 28, fontWeight: "900", marginBottom: 6, fontFamily: serifFont },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 5 },
  infoText: { flex: 1, minWidth: 0, color: "rgba(247,243,235,0.72)", fontSize: 14, lineHeight: 18, fontWeight: "700" },
  detailsButton: { marginTop: 11, minHeight: 42, borderRadius: 13, paddingHorizontal: 12, borderWidth: 1.4, borderColor: COLORS.goldLight, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "rgba(216,183,106,0.08)" },
  detailsText: { color: COLORS.goldLight, fontSize: 15, fontWeight: "900" },
  ratingCard: { minHeight: 106, borderRadius: 23, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(18,18,18,0.78)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" },
  medal: { width: 74, height: 74, borderRadius: 37, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(216,183,106,0.55)", backgroundColor: "rgba(0,0,0,0.36)" },
  ratingCopy: { flex: 1, minWidth: 0 },
  ratingRowBig: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 },
  ratingNumber: { color: COLORS.ivory, fontSize: 50, lineHeight: 55, fontWeight: "900", fontFamily: serifFont },
  ratingMeta: { flex: 1, minWidth: 0 },
  stars: { color: COLORS.goldLight, fontSize: 19, lineHeight: 23, letterSpacing: 0.6 },
  reviews: { color: "rgba(247,243,235,0.68)", fontSize: 14, lineHeight: 18, fontWeight: "700", marginTop: 2 },
  tabBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 84, overflow: "hidden", paddingTop: 12, paddingHorizontal: 7, flexDirection: "row", justifyContent: "space-between", backgroundColor: "rgba(18,18,18,0.9)", borderTopWidth: 1, borderTopColor: "rgba(216,183,106,0.26)" },
  tabItem: { flex: 1, alignItems: "center", gap: 5 },
  tabLabel: { color: COLORS.gray, fontSize: 11.5, fontWeight: "800" },
  tabLabelActive: { color: COLORS.gold },
  tabIndicator: { position: "absolute", top: -12, width: 66, height: 3, borderRadius: 2, backgroundColor: COLORS.gold },
});
