import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

import { COLORS } from "@/constants/colors";

const { width } = Dimensions.get("window");

const OPTIONS = [3, 4, 5, 6, 7, 8, 10, 12];

export default function SelectMusiciansScreen() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <LinearGradient
      colors={["#121212", "#1A1A1A", "#232323"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          ¿Cuántos elementos necesitas?
        </Text>

        <Text style={styles.subtitle}>
          Selecciona la cantidad deseada para encontrar los grupos disponibles.
        </Text>

        <View style={styles.grid}>
          {OPTIONS.map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.9}
              onPress={() => setSelected(item)}
            >
              <BlurView
                intensity={25}
                tint="dark"
                style={[
                  styles.card,
                  selected === item && styles.selectedCard,
                ]}
              >
                <Text
                  style={[
                    styles.number,
                    selected === item && styles.selectedNumber,
                  ]}
                >
                  {item}
                </Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          disabled={!selected}
          style={[
            styles.button,
            !selected && styles.buttonDisabled,
          ]}
          onPress={() =>
            router.push({
              pathname: "/mariachis",
              params: {
                members: selected,
              },
            })
          }
        >
          <Text style={styles.buttonText}>
            Buscar Mariachis Disponibles
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  title: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
    lineHeight: 22,
  },

  grid: {
    width: width * 0.9,

    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "center",

    gap: 15,
  },

  card: {
    width: 90,
    height: 90,

    borderRadius: 24,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: COLORS.glassBorder,

    overflow: "hidden",
  },

  selectedCard: {
    borderColor: COLORS.gold,
    borderWidth: 2,
  },

  number: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "700",
  },

  selectedNumber: {
    color: COLORS.gold,
  },

  button: {
    marginTop: 40,

    width: width * 0.85,

    height: 60,

    backgroundColor: COLORS.gold,

    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: COLORS.black,
    fontWeight: "800",
    fontSize: 16,
  },
});