import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { getCurrentAppRole } from "@/lib/account-role";

const roleDestinations = {
  customer: "/event-details",
  admin: "/admin-dashboard",
  mariachi_team: "/mariachi-dashboard",
} as const;

export default function RoleRedirectScreen() {
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    const resolveRole = async () => {
      setError(false);

      try {
        const role = await getCurrentAppRole();

        if (!active) return;

        if (!role) {
          router.replace("/welcome");
          return;
        }

        router.replace(roleDestinations[role]);
      } catch {
        if (active) {
          setError(true);
        }
      }
    };

    void resolveRole();

    return () => {
      active = false;
    };
  }, [retry]);

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>
        AY! MARIACHI PARA TODOS
      </Text>

      {error ? (
        <>
          <Text style={styles.message}>
            No pudimos verificar tu tipo de cuenta.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setRetry((value) => value + 1)}
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