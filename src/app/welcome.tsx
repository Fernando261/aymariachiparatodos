import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  Image,
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
          <Image
            source={require("@/assets/images/mariachis/mariachibg.png")}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.26)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.5)"]}
            locations={[0, 0.48, 1]}
            style={styles.backgroundOverlay}
          />
          <View style={styles.content}>
            <Animated.View style={[styles.logoSection, logoAnimatedStyle]}>
              <Image source={require("@/assets/images/logo.png")} style={styles.logoImage} resizeMode="contain" />
            </Animated.View>

            <Animated.View style={[styles.visualSection, visualAnimatedStyle]} />

            <Animated.View style={[styles.copySection, copyAnimatedStyle]}>
              <Text style={styles.headline}>La música que celebra{`\n`}tus mejores momentos</Text>
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
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.7,
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingBottom: Math.max(24, height * 0.032),
    paddingTop: Math.max(42, height * 0.08),
  },
  logoSection: { alignItems: "center", minHeight: 148, justifyContent: "center", width: "100%" },
  logoImage: { width: phoneWidth < 570 ? 370 : 390, height: phoneWidth < 570 ? 304 : 318 },
  visualSection: {
    width: "100%",
    flex: 1,
    minHeight: Math.min(height * 0.2, 190),
  },
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
    borderRadius: 24,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  button: { height: 60, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)" },
  buttonText: { color: COLORS.black, fontSize: 18, fontWeight: "800", letterSpacing: 0.3 },
  dotsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: Platform.OS === "android" ? 2 : 0 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 18, backgroundColor: COLORS.gold },
  dotInactive: { backgroundColor: "rgba(160,160,160,0.6)" },
});
