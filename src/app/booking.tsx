import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { CalendarIcon, CheckCircleIcon, ChevronRightIcon, LocationIcon, MenuIcon, TicketIcon, UsersIcon } from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";
import { supabase } from "@/lib/supabase";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");

type FormErrors = Partial<Record<"eventType" | "date" | "time" | "location" | "musicians", string>>;

function initialDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseEventStart(dateValue: string, timeValue: string) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(timeValue);
  if (!dateMatch || !timeMatch) return null;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return null;

  const localDate = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (
    localDate.getFullYear() !== year ||
    localDate.getMonth() !== month - 1 ||
    localDate.getDate() !== day ||
    localDate.getHours() !== hour ||
    localDate.getMinutes() !== minute ||
    localDate <= new Date()
  ) return null;

  return localDate.toISOString();
}

export default function BookingScreen() {
  const { mariachiId, musicians, category } = useLocalSearchParams<{ mariachiId?: string; musicians?: string; category?: string }>();
  const [eventType, setEventType] = useState(category ?? "");
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState("19:00");
  const [location, setLocation] = useState("");
  const [requestedMusicians, setRequestedMusicians] = useState(musicians ?? "");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!eventType.trim()) nextErrors.eventType = "Indica el tipo de evento.";
    if (!parseEventStart(date.trim(), time.trim())) {
      nextErrors.date = "Usa una fecha futura válida (AAAA-MM-DD).";
      nextErrors.time = "Usa una hora válida de 24 h (HH:MM).";
    }
    if (!location.trim()) nextErrors.location = "Ingresa la ubicación o dirección.";
    const quantity = Number(requestedMusicians);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 30) nextErrors.musicians = "La cantidad debe estar entre 1 y 30.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitBooking = async () => {
    if (isSaving || !validate()) return;
    const eventStartsAt = parseEventStart(date.trim(), time.trim());
    if (!eventStartsAt) return;

    setIsSaving(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        Alert.alert("Sesión requerida", "Inicia sesión nuevamente para enviar tu solicitud.");
        return;
      }

      const { data, error } = await supabase
        .from("booking_requests")
        .insert({
          customer_id: userData.user.id,
          mariachi_group_id: null,
          event_starts_at: eventStartsAt,
          location: location.trim(),
          event_type: eventType.trim(),
          requested_musicians: Number(requestedMusicians),
          additional_details: details.trim() || null,
        })
        .select("id")
        .single();

            if (error || !data) {
        if (__DEV__) {
          if (error) {
            console.error("[BOOKING] Error de Supabase:", {
              code: error.code,
              message: error.message,
            });
          } else {
            console.error(
              "[BOOKING] Supabase no devolvió un ID y no reportó un error."
            );
          }
        }

        Alert.alert(
          "No pudimos enviar la solicitud",
          "Revisa tu conexión e inténtalo de nuevo."
        );
        return;
      }

      Alert.alert("Solicitud enviada", "Tu contratación quedó registrada como pendiente.", [
        { text: "Ver solicitud", onPress: () => router.replace({ pathname: "/event-detail", params: { eventId: data.id } }) },
      ]);
        } catch (error: unknown) {
      if (__DEV__) {
        console.error("[BOOKING] Excepción inesperada:", {
          name: error instanceof Error ? error.name : "UnknownError",
          message: error instanceof Error ? error.message : "Error no identificado",
        });
      }

      Alert.alert(
        "Error de conexión",
        "No pudimos guardar la solicitud. Inténtalo de nuevo."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <Image source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.dimLayer} />
          <LinearGradient colors={["rgba(0,0,0,0.24)", "rgba(0,0,0,0.56)", "rgba(0,0,0,0.9)"]} locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.75} style={styles.headerSquare} onPress={() => router.back()}><MenuIcon size={26} color={COLORS.ivory} strokeWidth={2.1} /></TouchableOpacity>
            <Image source={logoImage} resizeMode="contain" style={styles.logo} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <Text style={styles.title}>Solicitar contratación</Text>
            <Text style={styles.subtitle}>Comparte los datos de tu evento para registrar la solicitud.</Text>
            {mariachiId ? <BlurView intensity={24} tint="dark" style={styles.selectedCard}><CheckCircleIcon size={19} color={COLORS.goldLight} /><Text style={styles.selectedText}>Selección de catálogo: Grupo #{mariachiId}. La asignación se confirmará después.</Text></BlurView> : null}
            <BlurView intensity={34} tint="dark" style={styles.formCard}>
              <Field label="Tipo de evento" value={eventType} onChangeText={setEventType} placeholder="Ej. Cumpleaños" error={errors.eventType} />
              <View style={styles.row}><View style={styles.half}><Field label="Fecha" value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" error={errors.date} keyboardType="numbers-and-punctuation" /></View><View style={styles.half}><Field label="Hora" value={time} onChangeText={setTime} placeholder="HH:MM" error={errors.time} keyboardType="numbers-and-punctuation" /></View></View>
              <Field label="Ubicación o dirección" value={location} onChangeText={setLocation} placeholder="Calle, colonia y ciudad" error={errors.location} />
              <Field label="Cantidad de mariachis" value={requestedMusicians} onChangeText={setRequestedMusicians} placeholder="De 1 a 30" error={errors.musicians} keyboardType="number-pad" />
              <Field label="Detalles adicionales (opcional)" value={details} onChangeText={setDetails} placeholder="Horario de llegada, repertorio o referencias" multiline />
              <View style={styles.infoRow}><CalendarIcon size={18} color={COLORS.goldLight} /><Text style={styles.infoText}>La fecha y hora se registrarán con la zona horaria de este dispositivo.</Text></View>
              <View style={styles.infoRow}><LocationIcon size={18} color={COLORS.goldLight} /><Text style={styles.infoText}>Tu solicitud se creará con estado pendiente.</Text></View>
            </BlurView>
            <TouchableOpacity activeOpacity={0.86} disabled={isSaving} style={[styles.primaryButton, isSaving && styles.disabledButton]} onPress={submitBooking}>
              {isSaving ? <ActivityIndicator color={COLORS.black} /> : <><TicketIcon size={20} color={COLORS.black} strokeWidth={2.4} /><Text style={styles.primaryButtonText}>Enviar solicitud</Text><ChevronRightIcon size={19} color={COLORS.black} strokeWidth={2.4} /></>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Field({ label, error, multiline, ...inputProps }: { label: string; error?: string; multiline?: boolean; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: "default" | "number-pad" | "numbers-and-punctuation" }) {
  return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput {...inputProps} multiline={multiline} placeholderTextColor="rgba(247,243,235,0.42)" style={[styles.input, multiline && styles.textArea, error && styles.inputError]} /><Text style={styles.errorText}>{error ?? " "}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000" }, safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000" }, appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black }, dimLayer: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.36)" }, header: { height: 76, marginHorizontal: 19, marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerSquare: { width: 54, height: 54, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(18,18,18,0.58)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" }, logo: { position: "absolute", left: 116, right: 116, top: 1, height: 70 }, content: { paddingHorizontal: 19, paddingTop: 18, paddingBottom: 42 }, title: { color: COLORS.ivory, fontSize: 39, lineHeight: 46, fontWeight: "900", letterSpacing: -1, fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) }, subtitle: { marginTop: 10, color: "rgba(247,243,235,0.74)", fontSize: 16, lineHeight: 23, fontWeight: "700" }, selectedCard: { marginTop: 18, padding: 13, borderRadius: 16, flexDirection: "row", gap: 9, alignItems: "center", backgroundColor: "rgba(18,18,18,0.66)", borderWidth: 1, borderColor: "rgba(216,183,106,0.28)" }, selectedText: { flex: 1, color: "rgba(247,243,235,0.78)", fontSize: 13, lineHeight: 18, fontWeight: "700" }, formCard: { marginTop: 18, borderRadius: 25, overflow: "hidden", padding: 17, backgroundColor: "rgba(18,18,18,0.76)", borderWidth: 1, borderColor: "rgba(216,183,106,0.3)" }, field: { marginBottom: 2 }, fieldLabel: { color: COLORS.goldLight, fontSize: 13, fontWeight: "900", marginBottom: 7 }, input: { minHeight: 48, borderRadius: 14, paddingHorizontal: 13, color: COLORS.ivory, fontSize: 16, fontWeight: "700", backgroundColor: "rgba(0,0,0,0.27)", borderWidth: 1, borderColor: "rgba(255,255,255,0.17)" }, inputError: { borderColor: "#D86B62" }, textArea: { height: 94, paddingTop: 12, textAlignVertical: "top" }, errorText: { minHeight: 17, marginTop: 3, color: "#F19A8E", fontSize: 11, fontWeight: "700" }, row: { flexDirection: "row", gap: 10 }, half: { flex: 1 }, infoRow: { flexDirection: "row", gap: 9, alignItems: "flex-start", marginTop: 9 }, infoText: { flex: 1, color: "rgba(247,243,235,0.66)", fontSize: 12.5, lineHeight: 18, fontWeight: "700" }, primaryButton: { minHeight: 58, borderRadius: 21, marginTop: 18, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9, backgroundColor: COLORS.goldLight }, disabledButton: { opacity: 0.7 }, primaryButtonText: { color: COLORS.black, fontSize: 16, fontWeight: "900" },
});
