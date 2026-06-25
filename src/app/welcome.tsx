import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";

const { height, width } = Dimensions.get("window");
const phoneWidth = Math.min(width, 430);
const visualSize = Math.min(phoneWidth * 0.86, 360);

export default function WelcomeScreen() {
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(-20);
  const visualOpacity = useSharedValue(0);
  const visualScale = useSharedValue(0.94);
  const copyOpacity = useSharedValue(0);
  const copyTranslateY = useSharedValue(18);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 850 });
    logoTranslateY.value = withTiming(0, { duration: 850 });
    visualOpacity.value = withDelay(220, withTiming(1, { duration: 900 }));
    visualScale.value = withDelay(220, withSpring(1, { damping: 18, stiffness: 90 }));
    copyOpacity.value = withDelay(520, withTiming(1, { duration: 780 }));
    copyTranslateY.value = withDelay(520, withTiming(0, { duration: 780 }));
    buttonOpacity.value = withDelay(780, withTiming(1, { duration: 650 }));
  }, [buttonOpacity, copyOpacity, copyTranslateY, logoOpacity, logoTranslateY, visualOpacity, visualScale]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const visualAnimatedStyle = useAnimatedStyle(() => ({
    opacity: visualOpacity.value,
    transform: [{ scale: visualScale.value }],
  }));

  const copyAnimatedStyle = useAnimatedStyle(() => ({
    opacity: copyOpacity.value,
    transform: [{ translateY: copyTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const handleStart = () => {
    router.push("/login");
  };

  return (
    <LinearGradient colors={["#121212", "#1A1A1A", "#0F0F0F"]} style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.phoneFrame}>
          <View style={styles.goldHalo} />
          <View style={styles.terracottaHalo} />
          <View style={styles.vignetteTop} />
          <View style={styles.content}>
            <Animated.View style={[styles.logoSection, logoAnimatedStyle]}>
              <Image source={require("@/assets/images/logo.png")} style={styles.logoImage} resizeMode="contain" />
            </Animated.View>

            <Animated.View style={[styles.visualSection, visualAnimatedStyle]}>
            <View style={styles.visualGlow} />
            {/* Reemplazar por fondo sutil de mariachis: assets/images/welcome/mariachi-bg.png */}
            <ImageBackground
              source={require("@/assets/images/mariachis/mariachibg.png")}
              style={styles.mariachiAtmosphere}
              imageStyle={styles.mariachiImage}
            >
              <LinearGradient
                colors={["rgba(18,18,18,0.2)", "rgba(18,18,18,0.58)", "rgba(18,18,18,0.96)"]}
                style={styles.mariachiOverlay}
              />
            </ImageBackground>

            {/* Reemplazar por ilustración de Guadalajara: assets/images/welcome/guadalajara-line.png */}


            
          </Animated.View>

          <Animated.View style={[styles.copySection, copyAnimatedStyle]}>
            <Text style={styles.headline}>La música que celebra{`\n`}tus mejores momentos</Text>
            {/* Reemplazar por ornamentación dorada: assets/images/welcome/ornament.png */}
            <View style={styles.ornamentRow}>
              <View style={styles.ornamentLine} />
              <Text style={styles.ornamentMark}>◆</Text>
              <View style={styles.ornamentLine} />
            </View>
          </Animated.View>

          <Animated.View style={[styles.bottomSection, buttonAnimatedStyle]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Comenzar"
              onPress={handleStart}
              onPressIn={() => {
                buttonScale.value = withSpring(0.97, { damping: 15, stiffness: 220 });
              }}
              onPressOut={() => {
                buttonScale.value = withSpring(1, { damping: 15, stiffness: 220 });
              }}
              style={styles.buttonShadow}
            >
              <LinearGradient colors={[COLORS.gold, COLORS.goldLight, COLORS.gold]} style={styles.button}>
                <Text style={styles.buttonText}>Comenzar</Text>
              </LinearGradient>
            </Pressable>
            <View style={styles.dotsRow}>
              {[0, 1, 2, 3].map((dot) => (
                <View key={dot} style={[styles.dot, dot === 0 ? styles.dotActive : styles.dotInactive]} />
              ))}
            </View>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const GOLD_LINE = "rgba(200,155,60,0.72)";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.black },
  safeArea: { flex: 1, alignItems: "center", backgroundColor: COLORS.black, overflow: "hidden" },
  phoneFrame: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingBottom: Math.max(24, height * 0.032),
    paddingTop: Math.max(36, height * 0.075),
  },
  goldHalo: {
    position: "absolute",
    top: -72,
    right: -104,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(200,155,60,0.08)",
  },
  terracottaHalo: {
    position: "absolute",
    bottom: 78,
    left: -152,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(182,90,58,0.08)",
  },
  vignetteTop: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: height * 0.42,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  logoSection: { alignItems: "center", minHeight: 132, justifyContent: "center", width: "100%" },
  logoImage: { width: Math.min(phoneWidth * 0.78, 330), height: 112 },
  visualSection: {
    width: visualSize,
    height: Math.min(height * 0.32, 280),
    alignItems: "center",
    justifyContent: "flex-end",
  },
  visualGlow: {
    position: "absolute",
    bottom: 34,
    width: visualSize * 0.92,
    height: 120,
    borderRadius: 80,
    backgroundColor: "rgba(200,155,60,0.08)",
  },
  mariachiAtmosphere: { position: "absolute", width: "100%", height: "100%", justifyContent: "flex-end" },
  mariachiImage: { opacity: 0.24, resizeMode: "cover", transform: [{ scale: 1.18 }] },
  mariachiOverlay: { flex: 1 },
  cityLineArt: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center", width: "100%", gap: 3, paddingBottom: 16, transform: [{ scale: phoneWidth < 380 ? 0.82 : 0.94 }] },
  cathedralTower: { alignItems: "center" },
  towerSpire: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 78,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: GOLD_LINE,
    opacity: 0.86,
  },
  towerBody: { width: 44, height: 72, borderWidth: 1.5, borderColor: GOLD_LINE, alignItems: "center", justifyContent: "center", gap: 10 },
  towerWindow: { width: 14, height: 24, borderRadius: 8, borderWidth: 1, borderColor: GOLD_LINE },
  towerWindowSmall: { width: 18, height: 8, borderRadius: 6, borderWidth: 1, borderColor: GOLD_LINE },
  cathedralCenter: { alignItems: "center", marginHorizontal: -3 },
  centerCross: { width: 2, height: 16, backgroundColor: GOLD_LINE },
  centerDome: { width: 72, height: 36, borderTopLeftRadius: 42, borderTopRightRadius: 42, borderWidth: 1.5, borderBottomWidth: 0, borderColor: GOLD_LINE },
  centerBody: { width: 92, height: 62, borderWidth: 1.5, borderColor: GOLD_LINE, alignItems: "center", justifyContent: "flex-end" },
  centerDoor: { width: 24, height: 36, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderWidth: 1, borderColor: GOLD_LINE, borderBottomWidth: 0 },
  kiosk: { alignItems: "center", marginLeft: 8 },
  kioskTop: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: GOLD_LINE, marginBottom: 2 },
  kioskRoof: { width: 92, height: 32, borderTopLeftRadius: 44, borderTopRightRadius: 44, borderWidth: 1.5, borderColor: GOLD_LINE },
  kioskColumns: { width: 78, height: 56, flexDirection: "row", justifyContent: "space-around", borderLeftWidth: 1.2, borderRightWidth: 1.2, borderColor: GOLD_LINE, paddingTop: 4 },
  kioskColumn: { width: 2, height: 50, backgroundColor: GOLD_LINE },
  kioskBase: { width: 98, height: 12, borderWidth: 1.3, borderColor: GOLD_LINE },
  copySection: { alignItems: "center", marginTop: 2 },
  headline: {
    color: COLORS.ivory,
    fontSize: phoneWidth < 370 ? 22 : 24,
    lineHeight: phoneWidth < 370 ? 30 : 33,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.2,
    textShadowColor: "rgba(255,255,255,0.18)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  ornamentRow: { flexDirection: "row", alignItems: "center", marginTop: 22, gap: 9 },
  ornamentLine: { width: 42, height: StyleSheet.hairlineWidth, backgroundColor: "rgba(200,155,60,0.55)" },
  ornamentMark: { color: COLORS.gold, fontSize: 12, opacity: 0.86 },
  bottomSection: { width: "100%", alignItems: "center", gap: 20 },
  buttonShadow: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 18,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  button: { height: 58, borderRadius: 18, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)" },
  buttonText: { color: COLORS.black, fontSize: 18, fontWeight: "800", letterSpacing: 0.3 },
  dotsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: Platform.OS === "android" ? 2 : 0 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 18, backgroundColor: COLORS.gold },
  dotInactive: { backgroundColor: "rgba(160,160,160,0.6)" },
});
