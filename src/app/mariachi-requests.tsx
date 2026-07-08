import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { MariachiScreenShell } from "./mariachi-dashboard";
import { COLORS } from "@/constants/colors";

export default function Screen() {
  return <MariachiScreenShell title="Solicitudes" subtitle="Flujo del mariachi" activeTab="Solicitudes"><View style={styles.tempCard}><Text style={styles.tempTitle}>Pantalla temporal premium</Text><Text style={styles.tempText}>Aquí construiremos el módulo de solicitudes para proveedores mariachi.</Text></View></MariachiScreenShell>;
}
const styles = StyleSheet.create({ tempCard: { minHeight: 210, borderRadius: 24, padding: 22, backgroundColor: "rgba(18,18,18,0.78)", borderWidth: 1, borderColor: "rgba(216,183,106,0.48)", alignItems: "center", justifyContent: "center" }, tempTitle: { color: COLORS.ivory, fontSize: 24, fontWeight: "900", textAlign: "center" }, tempText: { marginTop: 12, color: "rgba(247,243,235,0.72)", fontSize: 16, lineHeight: 23, fontWeight: "700", textAlign: "center" } });
