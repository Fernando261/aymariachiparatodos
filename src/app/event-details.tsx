import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";

import { router } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { COLORS } from "@/constants/colors";

const { width } = Dimensions.get("window");

const OPTIONS = [3, 4, 5, 6];

export default function EventDetailsScreen() {
  const [selectedMusicians, setSelectedMusicians] = useState<number | null>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const handleContinue = () => {
    if (!selectedMusicians || !date || !time || !location) {
      Alert.alert(
        "Información incompleta",
        "Completa todos los campos para continuar."
      );
      return;
    }

    router.push({
      pathname: "/mariachis",
      params: {
        musicians: selectedMusicians,
        date,
        time,
        location,
      },
    });
  };

  return (
    <LinearGradient
      colors={["#121212", "#1A1A1A", "#232323"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Detalles del Evento
        </Text>

        <Text style={styles.subtitle}>
          Cuéntanos un poco sobre tu evento para encontrar los mejores mariachis.
        </Text>

        <BlurView
          intensity={35}
          tint="dark"
          style={styles.card}
        >
          <Text style={styles.sectionTitle}>
            🎺 Elige la cantidad de elementos para tu mariachi:
          </Text>

          <View style={styles.grid}>
            {OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedMusicians(item)}
                activeOpacity={0.9}
              >
                <View
                  style={[
                    styles.optionCard,
                    selectedMusicians === item &&
                      styles.optionCardSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedMusicians === item &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>
            📅 Fecha del evento
          </Text>

          <TextInput
            placeholder="Ej. 20/07/2026"
            placeholderTextColor="#888"
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />

          <Text style={styles.label}>
            🕒 Hora aproximada
          </Text>

          <TextInput
            placeholder="Ej. 8:00 PM"
            placeholderTextColor="#888"
            value={time}
            onChangeText={setTime}
            style={styles.input}
          />

          <Text style={styles.label}>
            📍 Ubicación
          </Text>

          <TextInput
            placeholder="Ej. Guadalajara, Jalisco"
            placeholderTextColor="#888"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>
              Buscar Mariachis Disponibles
            </Text>
          </TouchableOpacity>
        </BlurView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 25,
    paddingTop: 60,
    paddingBottom: 50,
    alignItems: "center",
  },

  title: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
    lineHeight: 22,
  },

  card: {
    width: width * 0.92,
    padding: 25,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },

  sectionTitle: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 25,
  },

  optionCard: {
    width: 70,
    height: 70,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },

  optionCardSelected: {
    borderColor: COLORS.gold,
    borderWidth: 2,
  },

  optionText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "700",
  },

  optionTextSelected: {
    color: COLORS.gold,
  },

  label: {
    color: COLORS.white,
    marginBottom: 8,
    marginTop: 15,
    fontWeight: "600",
  },

  input: {
    height: 55,
    borderRadius: 16,
    backgroundColor: COLORS.glass,
    color: COLORS.white,
    paddingHorizontal: 16,
  },

  button: {
    marginTop: 30,
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "800",
  },
});