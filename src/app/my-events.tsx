import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Image, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BellIcon, CalendarIcon, CheckCircleIcon, ChevronRightIcon, ClockIcon, HeartIcon, HomeIcon, LocationIcon, MenuIcon, UserIcon, UsersIcon } from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";
import { bookingStatusLabels, formatBookingDate, getMyBookings, type BookingRequest } from "@/lib/bookings";
import { supabase } from "@/lib/supabase";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");
type IconComponent = (props: { size?: number; color?: string; strokeWidth?: number }) => React.ReactElement;
type Tab = { label: string; Icon: IconComponent; active: boolean; onPress: () => void };

function statusTone(status: BookingRequest["status"]) {
  if (status === "pending") return { color: COLORS.goldLight, border: "rgba(216,183,106,0.68)", bg: "rgba(216,183,106,0.11)" };
  if (status === "accepted" || status === "completed") return { color: "#8BE05E", border: "rgba(94,224,121,0.46)", bg: "rgba(94,224,121,0.1)" };
  return { color: "#F19A8E", border: "rgba(241,154,142,0.48)", bg: "rgba(241,154,142,0.1)" };
}

export default function MyEventsScreen() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBookings = useCallback(async (refresh = false) => {
    refresh ? setIsRefreshing(true) : setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setBookings([]);
        setErrorMessage("Inicia sesión para consultar tus solicitudes.");
        return;
      }
      const { data, error } = await getMyBookings(userData.user.id);
      if (error) {
        setErrorMessage("No pudimos cargar tus solicitudes. Inténtalo de nuevo.");
        return;
      }
      setBookings((data ?? []) as BookingRequest[]);
    } catch {
      setErrorMessage("No pudimos cargar tus solicitudes. Revisa tu conexión.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void loadBookings(); }, [loadBookings]));

  const tabs: Tab[] = useMemo(() => [
    { label: "Inicio", Icon: HomeIcon, active: false, onPress: () => router.replace("/event-details") },
    { label: "Favoritos", Icon: HeartIcon, active: false, onPress: () => router.push("/favorites") },
    { label: "Mis eventos", Icon: CalendarIcon, active: true, onPress: () => router.replace("/my-events") },
    { label: "Perfil", Icon: UserIcon, active: false, onPress: () => router.push("/profile") },
  ], []);

  return <View style={styles.screen}><SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}><View style={styles.appFrame}>
    <Image source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" /><View style={styles.dimLayer} /><LinearGradient colors={["rgba(0,0,0,0.22)", "rgba(0,0,0,0.48)", "rgba(0,0,0,0.88)"]} locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />
    <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void loadBookings(true)} tintColor={COLORS.goldLight} />} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}><TouchableOpacity activeOpacity={0.75} style={styles.headerSquare}><MenuIcon size={26} color={COLORS.ivory} strokeWidth={2.1} /></TouchableOpacity><Image source={logoImage} resizeMode="contain" style={styles.logo} /><TouchableOpacity activeOpacity={0.75} style={styles.headerSquare}><BellIcon size={25} color={COLORS.ivory} strokeWidth={2.1} /></TouchableOpacity></View>
      <View style={styles.heroCopy}><Text style={styles.title}>Mis eventos</Text><Text style={styles.subtitle}>Tus solicitudes y próximas presentaciones</Text></View>
      {isLoading ? <StateCard icon={<ActivityIndicator color={COLORS.goldLight} size="large" />} title="Cargando solicitudes" text="Estamos consultando tus contrataciones." /> : null}
      {!isLoading && errorMessage ? <StateCard icon={<CalendarIcon size={36} color="#F19A8E" />} title="No pudimos cargar" text={errorMessage} action="Reintentar" onPress={() => void loadBookings()} /> : null}
      {!isLoading && !errorMessage && bookings.length === 0 ? <StateCard icon={<CalendarIcon size={38} color={COLORS.gold} />} title="Aún no tienes solicitudes" text="Cuando envíes una contratación, aparecerá aquí." /> : null}
      {!isLoading && !errorMessage ? <View style={styles.eventsList}>{bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}</View> : null}
    </ScrollView>
    <BlurView intensity={34} tint="dark" style={styles.tabBar}>{tabs.map((tab) => <TouchableOpacity key={tab.label} activeOpacity={0.8} style={styles.tabItem} onPress={tab.onPress}><tab.Icon size={25} color={tab.active ? COLORS.gold : COLORS.gray} strokeWidth={2.2} /><Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>{tab.label}</Text>{tab.active ? <View style={styles.tabIndicator} /> : null}</TouchableOpacity>)}</BlurView>
  </View></SafeAreaView></View>;
}

function BookingCard({ booking }: { booking: BookingRequest }) {
  const tone = statusTone(booking.status);
  return <TouchableOpacity activeOpacity={0.88} style={styles.card} onPress={() => router.push({ pathname: "/event-detail", params: { eventId: booking.id } })}>
    <View style={styles.cardTop}><View style={styles.iconWrap}><CalendarIcon size={23} color={COLORS.goldLight} /></View><View style={styles.cardBody}><Text style={styles.cardTitle}>{booking.event_type}</Text><View style={styles.detailRow}><ClockIcon size={16} color={COLORS.gray} /><Text style={styles.detailText}>{formatBookingDate(booking.event_starts_at)}</Text></View><View style={styles.detailRow}><LocationIcon size={16} color={COLORS.gray} /><Text numberOfLines={1} style={styles.detailText}>{booking.location}</Text></View><View style={styles.detailRow}><UsersIcon size={16} color={COLORS.gray} /><Text style={styles.detailText}>{booking.requested_musicians} elementos</Text></View></View></View>
    <View style={styles.cardFooter}><View style={[styles.statusBadge, { borderColor: tone.border, backgroundColor: tone.bg }]}><CheckCircleIcon size={14} color={tone.color} /><Text style={[styles.statusText, { color: tone.color }]}>{bookingStatusLabels[booking.status]}</Text></View><ChevronRightIcon size={21} color={COLORS.goldLight} strokeWidth={2.2} /></View>
  </TouchableOpacity>;
}

function StateCard({ icon, title, text, action, onPress }: { icon: React.ReactNode; title: string; text: string; action?: string; onPress?: () => void }) { return <BlurView intensity={28} tint="dark" style={styles.stateCard}><View style={styles.stateIcon}>{icon}</View><Text style={styles.stateTitle}>{title}</Text><Text style={styles.stateText}>{text}</Text>{action && onPress ? <TouchableOpacity onPress={onPress} style={styles.retryButton}><Text style={styles.retryText}>{action}</Text></TouchableOpacity> : null}</BlurView>; }

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000" }, safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000" }, appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black }, dimLayer: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.36)" }, scrollContent: { paddingHorizontal: 19, paddingTop: 12, paddingBottom: 120 }, header: { height: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerSquare: { width: 54, height: 54, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(18,18,18,0.58)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" }, logo: { position: "absolute", left: 116, right: 116, top: 1, height: 70 }, heroCopy: { marginTop: 8, marginBottom: 20, alignItems: "center" }, title: { color: COLORS.ivory, fontSize: 42, lineHeight: 48, fontWeight: "900", textAlign: "center", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) }, subtitle: { marginTop: 10, color: "rgba(247,243,235,0.72)", fontSize: 15, fontWeight: "700", textAlign: "center" }, eventsList: { gap: 13 }, card: { borderRadius: 22, padding: 14, backgroundColor: "rgba(18,18,18,0.78)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" }, cardTop: { flexDirection: "row", gap: 12 }, iconWrap: { width: 50, height: 50, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(216,183,106,0.1)", borderWidth: 1, borderColor: "rgba(216,183,106,0.35)" }, cardBody: { flex: 1, minWidth: 0 }, cardTitle: { color: COLORS.ivory, fontSize: 21, lineHeight: 25, fontWeight: "900", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) }, detailRow: { flexDirection: "row", gap: 7, marginTop: 5, alignItems: "center" }, detailText: { flex: 1, color: "rgba(247,243,235,0.7)", fontSize: 13, fontWeight: "700" }, cardFooter: { marginTop: 13, paddingTop: 11, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, statusBadge: { flexDirection: "row", gap: 6, alignItems: "center", borderRadius: 12, paddingHorizontal: 9, paddingVertical: 6, borderWidth: 1 }, statusText: { fontSize: 12, fontWeight: "900" }, stateCard: { borderRadius: 24, padding: 25, alignItems: "center", backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(216,183,106,0.3)" }, stateIcon: { marginBottom: 14 }, stateTitle: { color: COLORS.ivory, fontSize: 22, fontWeight: "900", textAlign: "center" }, stateText: { marginTop: 8, color: "rgba(247,243,235,0.7)", fontSize: 14, lineHeight: 20, fontWeight: "700", textAlign: "center" }, retryButton: { marginTop: 17, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "rgba(216,183,106,0.14)", borderWidth: 1, borderColor: COLORS.goldLight }, retryText: { color: COLORS.goldLight, fontWeight: "900" }, tabBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 84, paddingTop: 12, paddingHorizontal: 7, flexDirection: "row", justifyContent: "space-between", backgroundColor: "rgba(18,18,18,0.9)", borderTopWidth: 1, borderTopColor: "rgba(216,183,106,0.26)" }, tabItem: { flex: 1, alignItems: "center", gap: 5 }, tabLabel: { color: COLORS.gray, fontSize: 11.5, fontWeight: "800" }, tabLabelActive: { color: COLORS.gold }, tabIndicator: { position: "absolute", top: -12, width: 66, height: 3, borderRadius: 2, backgroundColor: COLORS.gold },
});
