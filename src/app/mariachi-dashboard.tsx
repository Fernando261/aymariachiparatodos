import React, { useMemo, useState } from "react";
import { Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BellIcon, CalendarIcon, CheckCircleIcon, ChevronRightIcon, ClockIcon, DollarIcon, HomeIcon, LocationIcon, MailIcon, MenuIcon, StarIcon, UserIcon } from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");
const eventImage = require("@/assets/images/mariachis/mariachi1.png");

type IconComponent = (props: { size?: number; color?: string; strokeWidth?: number }) => React.ReactElement;
type Tab = { label: string; Icon: IconComponent; active: boolean; onPress: () => void };

const mariachiStats = { alias: "Grupo Verificado #184", newRequests: 2, todayEvents: 1, estimatedEarnings: 4800, rating: 4.9, reviews: 182 };
const nextEvent = { id: "1", title: "Serenata sorpresa", time: "Hoy · 8:00 PM", location: "Zapopan, Jal.", image: eventImage };

function formatMoney(value: number) { return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value); }

export function MariachiHeader() {
  return <View style={styles.header}>
    <TouchableOpacity activeOpacity={0.75} style={styles.headerSquare}><MenuIcon size={27} color={COLORS.goldLight} strokeWidth={2.1} /></TouchableOpacity>
    <Image source={logoImage} resizeMode="contain" style={styles.logo} />
    <TouchableOpacity activeOpacity={0.75} style={styles.headerSquare}><BellIcon size={25} color={COLORS.goldLight} strokeWidth={2.1} /><View style={styles.notificationBadge} /></TouchableOpacity>
  </View>;
}

export function MariachiTabs({ active }: { active: string }) {
  const tabs: Tab[] = useMemo(() => [
    { label: "Inicio", Icon: HomeIcon, active: active === "Inicio", onPress: () => router.replace("/mariachi-dashboard") },
    { label: "Solicitudes", Icon: MailIcon, active: active === "Solicitudes", onPress: () => router.push("/mariachi-requests") },
    { label: "Agenda", Icon: CalendarIcon, active: active === "Agenda", onPress: () => router.push("/mariachi-schedule") },
    { label: "Ganancias", Icon: DollarIcon, active: active === "Ganancias", onPress: () => router.push("/mariachi-earnings") },
    { label: "Perfil", Icon: UserIcon, active: active === "Perfil", onPress: () => router.push("/mariachi-profile") },
  ], [active]);
  return <BlurView intensity={34} tint="dark" style={styles.tabBar}>{tabs.map((tab) => <TouchableOpacity key={tab.label} activeOpacity={0.8} style={styles.tabItem} onPress={tab.onPress}><tab.Icon size={25} color={tab.active ? COLORS.gold : COLORS.gray} strokeWidth={2.1} /><Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>{tab.label}</Text>{tab.active ? <View style={styles.tabIndicator} /> : null}</TouchableOpacity>)}</BlurView>;
}

export function MariachiScreenShell({ title, subtitle, activeTab, children }: { title: string; subtitle?: string; activeTab?: string; children?: React.ReactNode }) {
  return <View style={styles.screen}><SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}><View style={styles.appFrame}>
    <Image source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" /><View style={styles.dimLayer} />
    <LinearGradient colors={["rgba(0,0,0,0.28)", "rgba(0,0,0,0.58)", "rgba(0,0,0,0.92)"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}><MariachiHeader />
      <View style={styles.heroCopy}><Text style={styles.title}>{title}</Text><View style={styles.titleOrnament}><View style={styles.ornamentLine} /><View style={styles.ornamentDiamond} /><View style={styles.ornamentLine} /></View>{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}</View>
      {children}
    </ScrollView>{activeTab ? <MariachiTabs active={activeTab} /> : null}
  </View></SafeAreaView></View>;
}

export default function MariachiDashboardScreen() {
  const [available, setAvailable] = useState(true);
  return <MariachiScreenShell title="Panel del mariachi" subtitle="Gestiona tu agenda, solicitudes y ganancias" activeTab="Inicio">
    <BlurView intensity={30} tint="dark" style={styles.groupCard}>
      <View style={styles.avatar}><View style={styles.sombrero}><View style={styles.sombreroCrown} /><View style={styles.sombreroBrim} /></View><Text style={styles.avatarLetter}>V</Text><View style={styles.avatarRing} /></View>
      <View style={styles.groupInfo}><View style={styles.aliasRow}><Text numberOfLines={1} style={styles.alias}>{mariachiStats.alias}</Text><CheckCircleIcon size={25} color={COLORS.goldLight} strokeWidth={2.4} /></View>
        <TouchableOpacity activeOpacity={0.85} onPress={() => setAvailable((v) => !v)} style={[styles.statusPill, !available && styles.statusPillOff]}><View style={[styles.statusDot, !available && styles.statusDotOff]} /><View style={styles.statusCopy}><Text style={[styles.statusTitle, !available && styles.statusTitleOff]}>{available ? "Disponible" : "No disponible"}</Text><Text style={styles.statusText}>{available ? "Recibiendo solicitudes" : "No recibirás solicitudes"}</Text></View><View style={[styles.switchTrack, !available && styles.switchTrackOff]}><View style={[styles.switchThumb, !available && styles.switchThumbOff]} /></View></TouchableOpacity>
      </View>
    </BlurView>

    <View style={styles.metricsRow}><MetricCard Icon={MailIcon} value={`${mariachiStats.newRequests}`} label="solicitudes\nnuevas" badge="2" /><MetricCard Icon={CalendarIcon} value={`${mariachiStats.todayEvents}`} label="evento\nhoy" /><MetricCard Icon={DollarIcon} value={`$${formatMoney(mariachiStats.estimatedEarnings)}`} label="estimados" /></View>

    <TouchableOpacity activeOpacity={0.88} style={styles.nextCard} onPress={() => router.push({ pathname: "/mariachi-event-detail", params: { eventId: nextEvent.id } })}><Text style={styles.sectionLabel}>PRÓXIMO EVENTO</Text><View style={styles.eventContent}><ImageBackground source={nextEvent.image} resizeMode="cover" style={styles.eventImage} imageStyle={styles.eventImageStyle}><LinearGradient colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.45)"]} style={StyleSheet.absoluteFill} /></ImageBackground><View style={styles.eventInfo}><Text style={styles.eventTitle}>{nextEvent.title}</Text><InfoRow Icon={ClockIcon} text={nextEvent.time} /><InfoRow Icon={LocationIcon} text={nextEvent.location} /><View style={styles.detailsButton}><Text style={styles.detailsText}>Ver detalles</Text><ChevronRightIcon size={23} color={COLORS.goldLight} strokeWidth={2.4} /></View></View></View></TouchableOpacity>

    <TouchableOpacity activeOpacity={0.88} style={styles.ratingCard} onPress={() => router.push("/mariachi-reviews")}><View style={styles.medal}><StarIcon size={45} color={COLORS.goldLight} strokeWidth={1.6} /></View><View style={styles.ratingCopy}><Text style={styles.sectionLabel}>CALIFICACIÓN ACTUAL</Text><View style={styles.ratingRowBig}><Text style={styles.ratingNumber}>{mariachiStats.rating.toFixed(1)}</Text><View><Text style={styles.stars}>★★★★☆</Text><Text style={styles.reviews}>{mariachiStats.reviews} reseñas</Text></View></View></View><ChevronRightIcon size={27} color={COLORS.goldLight} strokeWidth={2.2} /></TouchableOpacity>
  </MariachiScreenShell>;
}

function MetricCard({ Icon, value, label, badge }: { Icon: IconComponent; value: string; label: string; badge?: string }) { return <BlurView intensity={24} tint="dark" style={styles.metricCard}><View style={styles.metricIconWrap}><Icon size={24} color={COLORS.goldLight} strokeWidth={2.1} />{badge ? <View style={styles.metricBadge}><Text style={styles.metricBadgeText}>{badge}</Text></View> : null}</View><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></BlurView>; }
function InfoRow({ Icon, text }: { Icon: IconComponent; text: string }) { return <View style={styles.infoRow}><Icon size={20} color={COLORS.goldLight} strokeWidth={2.1} /><Text style={styles.infoText}>{text}</Text></View>; }

export const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000" }, safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000" }, appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black }, dimLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.34)" }, scrollContent: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 130 },
  header: { height: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerSquare: { width: 54, height: 54, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(18,18,18,0.62)", borderWidth: 1, borderColor: "rgba(216,183,106,0.42)" }, logo: { position: "absolute", left: 116, right: 116, top: 0, height: 72 }, notificationBadge: { position: "absolute", top: 8, right: 8, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.goldLight },
  heroCopy: { marginTop: 12, marginBottom: 24, alignItems: "center" }, title: { color: COLORS.ivory, fontSize: 43, lineHeight: 51, fontWeight: "900", textAlign: "center", letterSpacing: -1.1, fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) }, titleOrnament: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 11 }, ornamentLine: { width: 74, height: 1, backgroundColor: "rgba(216,183,106,0.72)" }, ornamentDiamond: { width: 10, height: 10, borderWidth: 2, borderColor: COLORS.goldLight, transform: [{ rotate: "45deg" }] }, subtitle: { marginTop: 14, color: "rgba(247,243,235,0.72)", fontSize: 16, lineHeight: 22, fontWeight: "700", textAlign: "center" },
  groupCard: { minHeight: 132, borderRadius: 25, overflow: "hidden", padding: 16, flexDirection: "row", gap: 16, backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(216,183,106,0.48)" }, avatar: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.62)", borderWidth: 1, borderColor: COLORS.gold }, avatarRing: { position: "absolute", top: 6, right: 6, bottom: 6, left: 6, borderRadius: 42, borderWidth: 1, borderColor: "rgba(216,183,106,0.42)" }, sombrero: { position: "absolute", top: 13, width: 44, height: 18, alignItems: "center" }, sombreroCrown: { width: 15, height: 11, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1.4, borderColor: COLORS.goldLight, borderBottomWidth: 0 }, sombreroBrim: { position: "absolute", bottom: 2, width: 42, height: 8, borderRadius: 16, borderWidth: 1.4, borderColor: COLORS.goldLight }, avatarLetter: { color: COLORS.goldLight, fontSize: 54, lineHeight: 61, fontWeight: "900", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) }, groupInfo: { flex: 1, justifyContent: "center" }, aliasRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }, alias: { flex: 1, color: COLORS.ivory, fontSize: 22, fontWeight: "900", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) }, statusPill: { minHeight: 62, borderRadius: 31, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(29,76,20,0.28)", borderWidth: 1, borderColor: "rgba(126,211,89,0.72)" }, statusPillOff: { backgroundColor: "rgba(80,80,80,0.18)", borderColor: "rgba(180,180,180,0.28)" }, statusDot: { width: 19, height: 19, borderRadius: 10, backgroundColor: "#81D85A", shadowColor: "#81D85A", shadowOpacity: 0.7, shadowRadius: 8 }, statusDotOff: { backgroundColor: COLORS.gray }, statusCopy: { flex: 1 }, statusTitle: { color: "#8BE05E", fontSize: 18, fontWeight: "900" }, statusTitleOff: { color: COLORS.gray }, statusText: { color: "rgba(247,243,235,0.72)", fontSize: 13.5, fontWeight: "700" }, switchTrack: { width: 62, height: 34, borderRadius: 17, justifyContent: "center", alignItems: "flex-end", padding: 3, backgroundColor: "rgba(216,183,106,0.82)" }, switchTrackOff: { alignItems: "flex-start", backgroundColor: "rgba(150,150,150,0.28)" }, switchThumb: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.ivory }, switchThumbOff: { backgroundColor: COLORS.gray },
  metricsRow: { marginTop: 14, flexDirection: "row", gap: 8 }, metricCard: { flex: 1, minHeight: 88, borderRadius: 20, overflow: "hidden", padding: 12, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(18,18,18,0.66)", borderWidth: 1, borderColor: "rgba(216,183,106,0.38)" }, metricIconWrap: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(216,183,106,0.52)" }, metricBadge: { position: "absolute", top: -11, right: -9, width: 25, height: 25, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.goldLight }, metricBadgeText: { color: COLORS.black, fontWeight: "900" }, metricValue: { color: COLORS.ivory, fontSize: 25, fontWeight: "900", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) }, metricLabel: { flex: 1, color: COLORS.goldLight, fontSize: 13.5, lineHeight: 18, fontWeight: "800" },
  nextCard: { marginTop: 14, borderRadius: 24, padding: 15, backgroundColor: "rgba(18,18,18,0.78)", borderWidth: 1, borderColor: "rgba(216,183,106,0.5)" }, sectionLabel: { color: COLORS.gold, fontSize: 15, letterSpacing: 2.2, fontWeight: "900" }, eventContent: { marginTop: 13, flexDirection: "row", gap: 14 }, eventImage: { width: 148, height: 126, borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "rgba(216,183,106,0.5)" }, eventImageStyle: { borderRadius: 18 }, eventInfo: { flex: 1, justifyContent: "center" }, eventTitle: { color: COLORS.ivory, fontSize: 24, lineHeight: 29, fontWeight: "900", marginBottom: 10, fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) }, infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }, infoText: { color: "rgba(247,243,235,0.72)", fontSize: 16, fontWeight: "700" }, detailsButton: { marginTop: 14, height: 47, borderRadius: 12, borderWidth: 1.4, borderColor: COLORS.goldLight, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 }, detailsText: { color: COLORS.goldLight, fontSize: 16, fontWeight: "900" },
  ratingCard: { marginTop: 14, minHeight: 106, borderRadius: 23, padding: 14, flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: "rgba(18,18,18,0.78)", borderWidth: 1, borderColor: "rgba(216,183,106,0.5)" }, medal: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(216,183,106,0.55)", backgroundColor: "rgba(0,0,0,0.36)" }, ratingCopy: { flex: 1 }, ratingRowBig: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 4 }, ratingNumber: { color: COLORS.ivory, fontSize: 55, lineHeight: 61, fontWeight: "900", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) }, stars: { color: COLORS.goldLight, fontSize: 25, letterSpacing: 1.5 }, reviews: { color: "rgba(247,243,235,0.68)", fontSize: 15, fontWeight: "700", marginTop: 4 },
  tabBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 84, overflow: "hidden", paddingTop: 12, paddingHorizontal: 7, flexDirection: "row", justifyContent: "space-between", backgroundColor: "rgba(18,18,18,0.9)", borderTopWidth: 1, borderTopColor: "rgba(216,183,106,0.26)" }, tabItem: { flex: 1, alignItems: "center", gap: 5 }, tabLabel: { color: COLORS.gray, fontSize: 11.5, fontWeight: "800" }, tabLabelActive: { color: COLORS.gold }, tabIndicator: { position: "absolute", top: -12, width: 66, height: 3, borderRadius: 2, backgroundColor: COLORS.gold },
});
