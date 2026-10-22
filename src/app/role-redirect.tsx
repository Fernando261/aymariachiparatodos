import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Redirect } from "expo-router";

import { useAccountAccess } from "@/lib/account-access";
import { roleDestinations } from "@/lib/account-routes";

export default function RoleRedirectScreen() {
  const access = useAccountAccess();

  if (access.status === "signed-out") return <Redirect href="/welcome" />;
  if (access.status === "ready") return <Redirect href={roleDestinations[access.role]} />;

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>
        AY! MARIACHI PARA TODOS
      </Text>

      {access.status === "error" ? (
        <>
          <Text style={styles.message}>
            {access.message}
          </Text>

          <TouchableOpacity
            style={styles.button}
            accessibilityRole="button"
            onPress={access.retry}
          >
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color="#C89B3C" />
          <Text style={styles.message}>
            Preparando tu experiencia...
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  brand: {
    color: "#D8B76A",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 30,
    textAlign: "center",
  },
  message: {
    color: "#F7F3EB",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#C89B3C",
    borderRadius: 15,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 24,
  },
  buttonText: {
    color: "#121212",
    fontWeight: "800",
  },
});
