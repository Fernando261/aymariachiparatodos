import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image } from "react-native";

export default function HomeScreen() {

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
  source={require("@/assets/images/logo.png")}
  style={styles.logo}
/>


      <ActivityIndicator
        size="large"
        color="#C89B3C"
        style={{ marginTop: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  logo: {
  width: 400,
  height: 400,
  marginBottom: 10,
},
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },

  trumpet: {
    fontSize: 80,
    marginBottom: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#C89B3C",
    fontSize: 24,
    marginTop: 10,
    letterSpacing: 2,
  },
});