import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getCurrentAppRole } from "@/lib/account-role";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: string;
  event_type: string;
  event_starts_at: string;
  requested_musicians: number;
  status: string;
};

type ScreenState = "loading" | "ready" | "denied" | "error";

export default function AdminDashboardScreen() {
  const [screenState, setScreenState] =
    useState<ScreenState>("loading");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setScreenState("loading");

      try {
        const role = await getCurrentAppRole();

        if (!active) return;

        if (role !== "admin") {
          setScreenState("denied");
          return;
        }

        const { data, error } = await supabase
          .from("booking_requests")
          .select(
            "id, event_type, event_starts_at, requested_musicians, status"
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (active) {
          setBookings(data ?? []);
          setScreenState("ready");
        }
      } catch {
        if (active) {
          setScreenState("error");
        }
      }
    };

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [reload]);

  const pending = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const accepted = bookings.filter(
    (booking) => booking.status === "accepted"
  ).length;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.brand}>AY! MARIACHI PARA TODOS</Text>

        <Text style={styles.title}>
          Panel administrativo
        </Text>

        <Text style={styles.subtitle}>
          Gestión de contrataciones
        </Text>
      </View>

      {screenState === "loading" && (
        <ActivityIndicator
          size="large"
          color="#C89B3C"
          style={styles.loader}
        />
      )}

      {screenState === "denied" && (
        <Text style={styles.message}>
          Acceso restringido. Esta sección requiere
          una cuenta administradora.
        </Text>
      )}

      {screenState === "error" && (
        <View>
          <Text style={styles.message}>
            No pudimos consultar las solicitudes.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setReload((value) => value + 1)}
          >
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {screenState === "ready" && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{pending}</Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{accepted}</Text>
              <Text style={styles.statLabel}>Aceptadas</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Solicitudes registradas
          </Text>

          {bookings.length === 0 && (
            <Text style={styles.message}>
              Todavía no hay contrataciones registradas.
            </Text>
          )}

          {bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <Text style={styles.bookingTitle}>
                {booking.event_type}
              </Text>

              <Text style={styles.bookingInfo}>
                Fecha: {new Date(
                  booking.event_starts_at
                ).toLocaleString("es-MX")}
              </Text>

              <Text style={styles.bookingInfo}>
                Músicos: {booking.requested_musicians}
              </Text>

              <Text style={styles.status}>
                Estado: {booking.status}
              </Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setReload((value) => value + 1)}
          >
            <Text style={styles.buttonText}>
              Actualizar solicitudes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    padding: 24,
    paddingTop: 30,
  },
  brand: {
    color: "#D8B76A",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
  title: {
    color: "#F7F3EB",
    fontSize: 31,
    fontWeight: "900",
    marginTop: 15,
  },
  subtitle: {
    color: "#D8B76A",
    fontSize: 15,
    marginTop: 6,
  },
  loader: {
    marginTop: 50,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#C89B3C",
    borderRadius: 18,
    padding: 20,
  },
  statValue: {
    color: "#F7F3EB",
    fontSize: 32,
    fontWeight: "900",
  },
  statLabel: {
    color: "#D8B76A",
    fontSize: 14,
  },
  sectionTitle: {
    color: "#F7F3EB",
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 15,
  },
  bookingCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(216,183,106,0.3)",
  },
  bookingTitle: {
    color: "#F7F3EB",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 12,
  },
  bookingInfo: {
    color: "#F7F3EB",
    fontSize: 14,
    marginBottom: 7,
  },
  status: {
    color: "#D8B76A",
    fontWeight: "700",
    marginTop: 8,
  },
  message: {
    color: "#F7F3EB",
    textAlign: "center",
    margin: 24,
    lineHeight: 23,
  },
  button: {
    backgroundColor: "#C89B3C",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#121212",
    fontWeight: "800",
  },
});