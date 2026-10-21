import React, { useCallback, useState } from "react";
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { CalendarIcon, CheckCircleIcon, ChevronRightIcon, ClockIcon, LocationIcon, UsersIcon } from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";
import { bookingStatusLabels, formatBookingDate, getBookingById, type BookingRequest } from "@/lib/bookings";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBooking = useCallback(async () => {
    if (!eventId) { setErrorMessage("No encontramos la solicitud."); setIsLoading(false); return; }
    setIsLoading(true); setErrorMessage(null);
    try {
      const { data, error } = await getBookingById(eventId);
      if (error || !data) { setErrorMessage("No pudimos cargar esta solicitud. Puede que ya no tengas acceso."); return; }
      setBooking(data as BookingRequest);
    } catch { setErrorMessage("No pudimos cargar esta solicitud. Revisa tu conexión."); } finally { setIsLoading(false); }
  }, [eventId]);

  useFocusEffect(useCallback(() => { void loadBooking(); }, [loadBooking]));

  return <View style={styles.screen}><SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}><View style={styles.appFrame}>
    <Image source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" /><View style={styles.dimLayer} /><LinearGradient colors={["rgba(0,0,0,0.24)", "rgba(0,0,0,0.58)", "rgba(0,0,0,0.88)"]} style={StyleSheet.absoluteFill} /><Image source={logoImage} resizeMode="contain" style={styles.logo} />
    <ScrollView contentContainerStyle={styles.content}>{isLoading ? <State icon={<ActivityIndicator color={COLORS.goldLight} size="large" />} title="Cargando solicitud" text="Estamos consultando los detalles." /> : null}{!isLoading && errorMessage ? <State icon={<CalendarIcon size={42} color="#F19A8E" />} title="No disponible" text={errorMessage} action="Reintentar" onPress={() => void loadBooking()} /> : null}{!isLoading && booking ? <BookingDetail booking={booking} /> : null}</ScrollView>
  </View></SafeAreaView></View>;
}

function BookingDetail({ booking }: { booking: BookingRequest }) { return <BlurView intensity={30} tint="dark" style={styles.card}>
  <View style={styles.iconCard}><CalendarIcon size={42} color={COLORS.gold} strokeWidth={1.8} /></View><Text style={styles.kicker}>Solicitud de contratación</Text><Text style={styles.title}>{booking.event_type}</Text><View style={styles.status}><CheckCircleIcon size={16} color={COLORS.goldLight} /><Text style={styles.statusText}>{bookingStatusLabels[booking.status]}</Text></View>
  <DetailRow Icon={ClockIcon} label="Fecha y hora" value={formatBookingDate(booking.event_starts_at)} /><DetailRow Icon={LocationIcon} label="Ubicación" value={booking.location} /><DetailRow Icon={UsersIcon} label="Mariachis solicitados" value={`${booking.requested_musicians} elementos`} />
  {booking.additional_details ? <View style={styles.detailsBox}><Text style={styles.detailLabel}>Detalles adicionales</Text><Text style={styles.detailsText}>{booking.additional_details}</Text></View> : null}
  <Text style={styles.reference}>Referencia: {booking.id}</Text><TouchableOpacity activeOpacity={0.86} onPress={() => router.back()} style={styles.backButton}><View style={styles.backIcon}><ChevronRightIcon size={18} color={COLORS.gold} strokeWidth={2.2} /></View><Text style={styles.backButtonText}>Volver a mis eventos</Text></TouchableOpacity>
</BlurView>; }
function DetailRow({ Icon, label, value }: { Icon: typeof CalendarIcon; label: string; value: string }) { return <View style={styles.detailRow}><View style={styles.detailIcon}><Icon size={20} color={COLORS.goldLight} /></View><View style={styles.detailCopy}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View></View>; }
function State({ icon, title, text, action, onPress }: { icon: React.ReactNode; title: string; text: string; action?: string; onPress?: () => void }) { return <BlurView intensity={30} tint="dark" style={styles.card}><View style={styles.iconCard}>{icon}</View><Text style={styles.title}>{title}</Text><Text style={styles.message}>{text}</Text>{action && onPress ? <TouchableOpacity onPress={onPress} style={styles.retry}><Text style={styles.backButtonText}>{action}</Text></TouchableOpacity> : null}<TouchableOpacity onPress={() => router.back()} style={styles.backButton}><Text style={styles.backButtonText}>Volver</Text></TouchableOpacity></BlurView>; }
const styles = StyleSheet.create({ screen: { flex: 1, alignItems: "center", backgroundColor: "#000" }, safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000" }, appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black }, dimLayer: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.44)" }, logo: { position: "absolute", alignSelf: "center", top: 18, width: 190, height: 82 }, content: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 120 }, card: { width: "100%", borderRadius: 28, overflow: "hidden", alignItems: "center", padding: 25, backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(216,183,106,0.28)" }, iconCard: { width: 76, height: 76, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(216,183,106,0.32)", marginBottom: 18 }, kicker: { color: COLORS.gold, fontSize: 12, fontWeight: "900", letterSpacing: 1.7, textTransform: "uppercase", marginBottom: 10, textAlign: "center" }, title: { color: COLORS.ivory, fontSize: 34, lineHeight: 40, fontWeight: "900", textAlign: "center", fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) }, status: { marginTop: 14, flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 14, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: "rgba(216,183,106,0.11)", borderWidth: 1, borderColor: "rgba(216,183,106,0.52)" }, statusText: { color: COLORS.goldLight, fontSize: 13, fontWeight: "900" }, detailRow: { width: "100%", flexDirection: "row", gap: 11, marginTop: 21, alignItems: "center" }, detailIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(216,183,106,0.1)" }, detailCopy: { flex: 1 }, detailLabel: { color: "rgba(247,243,235,0.58)", fontSize: 12, fontWeight: "800" }, detailValue: { marginTop: 3, color: COLORS.ivory, fontSize: 15, lineHeight: 21, fontWeight: "800" }, detailsBox: { width: "100%", marginTop: 21, borderRadius: 15, padding: 13, backgroundColor: "rgba(0,0,0,0.22)" }, detailsText: { color: "rgba(247,243,235,0.78)", marginTop: 5, fontSize: 14, lineHeight: 20, fontWeight: "700" }, reference: { marginTop: 20, color: "rgba(247,243,235,0.45)", fontSize: 11, textAlign: "center" }, message: { marginTop: 15, color: "rgba(247,243,235,0.76)", fontSize: 16, lineHeight: 23, fontWeight: "700", textAlign: "center" }, backButton: { marginTop: 26, minHeight: 54, minWidth: 180, borderRadius: 18, flexDirection: "row", gap: 9, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(216,183,106,0.08)", borderWidth: 1, borderColor: "rgba(216,183,106,0.45)", paddingHorizontal: 16 }, retry: { marginTop: 21, minHeight: 45, paddingHorizontal: 16, borderRadius: 14, justifyContent: "center", borderWidth: 1, borderColor: COLORS.goldLight }, backIcon: { transform: [{ rotate: "180deg" }] }, backButtonText: { color: COLORS.gold, fontSize: 15, fontWeight: "900" } });
