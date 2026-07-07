import React, { useMemo, useState } from "react";
import { Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { ImageSourcePropType } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BellIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  HeartIcon,
  HomeIcon,
  LocationIcon,
  MenuIcon,
  UserIcon,
  UsersIcon,
} from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");

type EventStatus = "Próximos" | "En curso" | "Finalizados";
type IconComponent = (props: { size?: number; color?: string; strokeWidth?: number }) => React.ReactElement;

type EventItem = {
  id: string;
  status: EventStatus;
  title: string;
  dayName: string;
  day: string;
  month: string;
  time: string;
  location: string;
  musicians: string;
  paymentStatus: string;
  action: string;
  image: ImageSourcePropType;
};

type Filter = { label: EventStatus; Icon: IconComponent };
type Tab = { label: string; Icon: IconComponent; active: boolean; onPress: () => void };

const events: EventItem[] = [
  { id: "1", status: "Próximos", title: "Serenata sorpresa", dayName: "Sáb", day: "12", month: "Jul", time: "8:00 PM", location: "Zapopan, Jal.", musicians: "6 elementos", paymentStatus: "Confirmado", action: "Ver detalles", image: require("@/assets/images/mariachis/mariachi1.png") },
  { id: "2", status: "Próximos", title: "Boda civil", dayName: "Dom", day: "20", month: "Jul", time: "6:30 PM", location: "Guadalajara Centro", musicians: "8 elementos", paymentStatus: "Pendiente", action: "Completar pago", image: require("@/assets/images/mariachis/mariachi2.png") },
  { id: "3", status: "Próximos", title: "Cumpleaños familiar", dayName: "Vie", day: "25", month: "Jul", time: "9:00 PM", location: "Tlaquepaque", musicians: "5 elementos", paymentStatus: "Pagado", action: "Reprogramar", image: require("@/assets/images/mariachis/mariachi3.png") },
  { id: "4", status: "Finalizados", title: "Paquete fiesta", dayName: "Sáb", day: "5", month: "Jul", time: "7:00 PM", location: "Guadalajara Centro", musicians: "7 elementos", paymentStatus: "Completado", action: "Ver resumen", image: require("@/assets/images/mariachis/mariachi4.png") },
  { id: "5", status: "Finalizados", title: "Mariachi para aniversario", dayName: "Vie", day: "27", month: "Jun", time: "8:30 PM", location: "Zapopan, Jal.", musicians: "6 elementos", paymentStatus: "Completado", action: "Ver resumen", image: require("@/assets/images/mariachis/mariachi5.png") },
];

const filters: Filter[] = [
  { label: "Próximos", Icon: CalendarIcon },
  { label: "En curso", Icon: ClockIcon },
  { label: "Finalizados", Icon: CheckCircleIcon },
];

function openEvent(item: EventItem) {
  router.push({ pathname: "/event-detail", params: { eventId: item.id } });
}

function getStatusTone(status: string) {
  if (status === "Pendiente") return { color: COLORS.goldLight, border: "rgba(216,183,106,0.68)", bg: "rgba(216,183,106,0.11)" };
  if (status === "Completado") return { color: COLORS.gray, border: "rgba(247,243,235,0.28)", bg: "rgba(247,243,235,0.06)" };
  return { color: "#5ee079", border: "rgba(94,224,121,0.46)", bg: "rgba(94,224,121,0.1)" };
}

export default function MyEventsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<EventStatus>("Próximos");
  const visibleEvents = events.filter((item) => item.status === selectedFilter);
  const recentEvents = events.filter((item) => item.status === "Finalizados").slice(0, 2);

  const tabs: Tab[] = useMemo(
    () => [
      { label: "Inicio", Icon: HomeIcon, active: false, onPress: () => router.replace("/event-details") },
      { label: "Favoritos", Icon: HeartIcon, active: false, onPress: () => router.push("/favorites") },
      { label: "Mis eventos", Icon: CalendarIcon, active: true, onPress: () => router.replace("/my-events") },
      { label: "Perfil", Icon: UserIcon, active: false, onPress: () => router.push("/profile") },
    ],
    []
  );

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
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.75} style={styles.headerSquare}><MenuIcon size={26} color={COLORS.ivory} strokeWidth={2.1} /></TouchableOpacity>
              <Image source={logoImage} resizeMode="contain" style={styles.logo} />
              <TouchableOpacity activeOpacity={0.75} style={styles.headerSquare}><BellIcon size={25} color={COLORS.ivory} strokeWidth={2.1} /><View style={styles.notificationBadge} /></TouchableOpacity>
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.title}>Mis eventos</Text>
              <View style={styles.titleOrnament}><View style={styles.ornamentLine} /><View style={styles.ornamentDiamond} /></View>
              <Text style={styles.subtitle}>Gestiona tus reservas y próximas presentaciones</Text>
            </View>

            <BlurView intensity={28} tint="dark" style={styles.segmentedControl}>
              {filters.map((filter, index) => {
                const isActive = filter.label === selectedFilter;
                return (
                  <TouchableOpacity key={filter.label} activeOpacity={0.82} style={[styles.segment, isActive && styles.segmentActive]} onPress={() => setSelectedFilter(filter.label)}>
                    <filter.Icon size={21} color={isActive ? COLORS.goldLight : COLORS.gray} strokeWidth={2} />
                    <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>{filter.label}</Text>
                    {index < filters.length - 1 && !isActive ? <View style={styles.segmentDivider} /> : null}
                  </TouchableOpacity>
                );
              })}
            </BlurView>

            <View style={styles.eventsList}>{visibleEvents.length ? visibleEvents.map((item) => <EventCard key={item.id} item={item} />) : <EmptyEvents />}</View>

            <View style={styles.historyHeader}><Text style={styles.historyTitle}>Historial reciente</Text><TouchableOpacity><Text style={styles.seeAll}>Ver todo</Text></TouchableOpacity></View>
            <BlurView intensity={26} tint="dark" style={styles.historyCard}>{recentEvents.map((item, index) => <HistoryItem key={item.id} item={item} showDivider={index < recentEvents.length - 1} />)}</BlurView>
          </ScrollView>

          <BlurView intensity={34} tint="dark" style={styles.tabBar}>{tabs.map((tab) => <TouchableOpacity key={tab.label} activeOpacity={0.8} style={styles.tabItem} onPress={tab.onPress}><tab.Icon size={25} color={tab.active ? COLORS.gold : COLORS.gray} strokeWidth={2.2} /><Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>{tab.label}</Text>{tab.active ? <View style={styles.tabIndicator} /> : null}</TouchableOpacity>)}</BlurView>
        </View>
      </SafeAreaView>
    </View>
  );
}

function EventCard({ item }: { item: EventItem }) {
  const tone = getStatusTone(item.paymentStatus);
  return (
    <TouchableOpacity activeOpacity={0.88} style={styles.card} onPress={() => openEvent(item)}>
      <View style={styles.cardMainRow}>
        <ImageBackground source={item.image} resizeMode="cover" style={styles.cardImage} imageStyle={styles.cardImageStyle}>
          <LinearGradient colors={["rgba(0,0,0,0.04)", "rgba(0,0,0,0.58)"]} style={styles.imageOverlay} />
        </ImageBackground>

        <View style={styles.dateBox}>
          <Text style={styles.dateName}>{item.dayName}</Text>
          <Text style={styles.dateDay}>{item.day}</Text>
          <Text style={styles.dateMonth}>{item.month}</Text>
        </View>

        <View style={styles.cardBody}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.detailRow}>
            <ClockIcon size={17} color={COLORS.gray} strokeWidth={2} />
            <Text numberOfLines={1} style={styles.detailText}>{item.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <LocationIcon size={17} color={COLORS.gray} strokeWidth={2} />
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <UsersIcon size={17} color={COLORS.gray} strokeWidth={2} />
            <Text numberOfLines={1} style={styles.detailText}>{item.musicians}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <View style={[styles.statusBadge, { borderColor: tone.border, backgroundColor: tone.bg }]}>
          <CheckCircleIcon size={15} color={tone.color} strokeWidth={2} />
          <Text numberOfLines={1} style={[styles.statusText, { color: tone.color }]}>{item.paymentStatus}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.84} style={styles.actionButton} onPress={() => openEvent(item)}>
          <Text numberOfLines={2} style={styles.actionText}>{item.action}</Text>
          <ChevronRightIcon size={18} color={COLORS.goldLight} strokeWidth={2.3} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function HistoryItem({ item, showDivider }: { item: EventItem; showDivider: boolean }) {
  const tone = getStatusTone(item.paymentStatus);
  return <TouchableOpacity activeOpacity={0.84} style={[styles.historyItem, showDivider && styles.historyDivider]} onPress={() => openEvent(item)}><Image source={item.image} style={styles.historyImage} resizeMode="cover" /><View style={styles.historyBody}><Text numberOfLines={1} style={styles.historyItemTitle}>{item.title}</Text><View style={styles.historyMeta}><CalendarIcon size={14} color={COLORS.gray} strokeWidth={2} /><Text numberOfLines={1} style={styles.historyMetaText}>{item.dayName} {item.day} {item.month}, 2025</Text><Text style={styles.historyDot}>•</Text><LocationIcon size={14} color={COLORS.gray} strokeWidth={2} /><Text numberOfLines={1} style={styles.historyMetaText}>{item.location}</Text></View></View><View style={[styles.historyBadge, { borderColor: tone.border, backgroundColor: tone.bg }]}><CheckCircleIcon size={13} color={tone.color} strokeWidth={2} /><Text style={[styles.historyBadgeText, { color: tone.color }]}>{item.paymentStatus}</Text></View><ChevronRightIcon size={21} color={COLORS.ivory} strokeWidth={2.1} /></TouchableOpacity>;
}

function EmptyEvents() {
  return <BlurView intensity={26} tint="dark" style={styles.emptyCard}><CalendarIcon size={38} color={COLORS.gold} strokeWidth={1.8} /><Text style={styles.emptyTitle}>No hay eventos en esta sección</Text><Text style={styles.emptySubtitle}>Cuando tengas reservas, aparecerán aquí.</Text></BlurView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000000" },
  safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000000" },
  appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black, ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.42, shadowRadius: 40 }, default: {} }) },
  dimLayer: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.36)" },
  goldLineTop: { position: "absolute", top: 92, left: 18, right: 18, height: 1, backgroundColor: "rgba(216,183,106,0.2)" },
  goldLineBottom: { position: "absolute", bottom: 87, left: 28, right: 28, height: 1, backgroundColor: "rgba(216,183,106,0.18)" },
  scrollContent: { paddingHorizontal: 19, paddingTop: 12, paddingBottom: Platform.OS === "web" ? 120 : 140 },
  header: { height: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerSquare: { width: 54, height: 54, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(18,18,18,0.58)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  logo: { position: "absolute", left: 116, right: 116, top: 1, height: 70 },
  notificationBadge: { position: "absolute", top: 7, right: 8, width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.goldLight, borderWidth: 1, borderColor: COLORS.black },
  heroCopy: { marginTop: 12, marginBottom: 22 },
  title: { color: COLORS.ivory, fontSize: 48, lineHeight: 56, fontWeight: "900", letterSpacing: -1.1, fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  titleOrnament: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 12 },
  ornamentLine: { width: 32, height: 2, borderRadius: 2, backgroundColor: COLORS.goldLight },
  ornamentDiamond: { width: 9, height: 9, borderWidth: 2, borderColor: COLORS.goldLight, transform: [{ rotate: "45deg" }] },
  subtitle: { marginTop: 15, color: "rgba(247,243,235,0.72)", fontSize: 17, lineHeight: 23, fontWeight: "700" },
  segmentedControl: { height: 58, borderRadius: 29, overflow: "hidden", flexDirection: "row", backgroundColor: "rgba(18,18,18,0.62)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", marginBottom: 22 },
  segment: { flex: 1, height: 52, margin: 2, borderRadius: 26, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  segmentActive: { backgroundColor: "rgba(216,183,106,0.14)", borderWidth: 1, borderColor: COLORS.gold },
  segmentText: { color: COLORS.gray, fontSize: 14, fontWeight: "800" },
  segmentTextActive: { color: COLORS.goldLight },
  segmentDivider: { position: "absolute", right: 0, width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.11)" },
  eventsList: { gap: 14 },
  card: { minHeight: 150, borderRadius: 21, padding: 12, gap: 12, backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.26, shadowRadius: 20 }, default: { elevation: 6 } }) },
  cardMainRow: { minHeight: 118, flexDirection: "row", alignItems: "center", gap: 10 },
  cardImage: { width: 118, height: 118, borderRadius: 18, overflow: "hidden" },
  cardImageStyle: { borderRadius: 18 },
  imageOverlay: { flex: 1 },
  dateBox: { width: 56, height: 92, alignSelf: "center", borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)" },
  dateName: { color: COLORS.goldLight, fontSize: 13.5, fontWeight: "900" },
  dateDay: { color: COLORS.goldLight, fontSize: 30, lineHeight: 34, fontWeight: "900", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  dateMonth: { color: COLORS.goldLight, fontSize: 13.5, fontWeight: "900" },
  cardBody: { flex: 1, minWidth: 0, alignSelf: "stretch", justifyContent: "center", paddingVertical: 2 },
  cardTitle: { color: COLORS.ivory, fontSize: 20, lineHeight: 26, fontWeight: "900", letterSpacing: -0.35, marginBottom: 8, fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 6 },
  detailText: { flex: 1, color: COLORS.gray, fontSize: 14, lineHeight: 18, fontWeight: "700" },
  actionRow: { minHeight: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  statusBadge: { height: 32, borderRadius: 16, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1 },
  statusText: { fontSize: 13, fontWeight: "900" },
  actionButton: { minWidth: 105, height: 42, borderRadius: 22, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, borderWidth: 1, borderColor: COLORS.gold, backgroundColor: "rgba(216,183,106,0.06)" },
  actionText: { color: COLORS.goldLight, fontSize: 14, lineHeight: 16, fontWeight: "900", textAlign: "center" },
  historyHeader: { marginTop: 22, marginBottom: 9, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  historyTitle: { color: COLORS.ivory, fontSize: 24, fontWeight: "900", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  seeAll: { color: COLORS.goldLight, fontSize: 15, fontWeight: "900" },
  historyCard: { borderRadius: 21, overflow: "hidden", backgroundColor: "rgba(18,18,18,0.7)", borderWidth: 1, borderColor: "rgba(255,255,255,0.13)" },
  historyItem: { minHeight: 74, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 10, paddingVertical: 10 },
  historyDivider: { borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.09)" },
  historyImage: { width: 64, height: 52, borderRadius: 11 },
  historyBody: { flex: 1, minWidth: 0 },
  historyItemTitle: { color: COLORS.ivory, fontSize: 16, fontWeight: "900", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  historyMeta: { marginTop: 7, flexDirection: "row", alignItems: "center", gap: 5 },
  historyMetaText: { color: COLORS.gray, fontSize: 11.5, fontWeight: "700", maxWidth: 104 },
  historyDot: { color: COLORS.gray, fontSize: 11, fontWeight: "900" },
  historyBadge: { height: 28, borderRadius: 14, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1 },
  historyBadgeText: { fontSize: 11.5, fontWeight: "900" },
  emptyCard: { minHeight: 190, borderRadius: 24, overflow: "hidden", alignItems: "center", justifyContent: "center", paddingHorizontal: 24, backgroundColor: "rgba(18,18,18,0.68)", borderWidth: 1, borderColor: "rgba(216,183,106,0.26)" },
  emptyTitle: { marginTop: 14, color: COLORS.ivory, fontSize: 20, fontWeight: "900", textAlign: "center" },
  emptySubtitle: { marginTop: 8, color: "rgba(247,243,235,0.68)", fontSize: 14, lineHeight: 20, fontWeight: "700", textAlign: "center" },
  tabBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 80, overflow: "hidden", paddingTop: 11, paddingHorizontal: 12, flexDirection: "row", justifyContent: "space-between", backgroundColor: "rgba(18,18,18,0.86)", borderTopWidth: 1, borderTopColor: "rgba(216,183,106,0.2)" },
  tabItem: { minWidth: 74, alignItems: "center", gap: 5 },
  tabLabel: { color: COLORS.gray, fontSize: 11.5, fontWeight: "800" },
  tabLabelActive: { color: COLORS.gold },
  tabIndicator: { width: 24, height: 2, borderRadius: 2, backgroundColor: COLORS.gold, marginTop: 1 },
});
