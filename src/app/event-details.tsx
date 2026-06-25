import React from "react";
import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";

type SymbolName = React.ComponentProps<typeof SymbolView>["name"];

type Category = {
  label: string;
  icon: SymbolName;
};

type Service = {
  title: string;
  subtitle: string;
  image?: number;
  icon?: SymbolName;
};

const MOBILE_WIDTH = 430;

const CATEGORIES: Category[] = [
  { label: "Cumpleaños", icon: "birthday.cake" },
  { label: "Serenatas", icon: "music.mic" },
  { label: "Bodas", icon: "heart.circle" },
  { label: "XV Años", icon: "crown" },
  { label: "Empresas", icon: "building.2" },
  { label: "Más", icon: "ellipsis" },
];

const SERVICES: Service[] = [
  {
    title: "Mariachis",
    subtitle: "Elige el grupo perfecto",
    image: require("@/assets/images/mariachis/mariachi1.png"),
  },
  {
    title: "Serenatas",
    subtitle: "Sorprende a esa persona especial",
    image: require("@/assets/images/mariachis/mariachi2.png"),
  },
  {
    title: "Paquetes",
    subtitle: "Ahorra con nuestros paquetes especiales",
    image: require("@/assets/images/mariachis/mariachibg.png"),
    icon: "gift",
  },
];

const TABS = [
  { label: "Inicio", icon: "house.fill", active: true },
  { label: "Favoritos", icon: "heart", active: false },
  { label: "Mis eventos", icon: "calendar", active: false },
  { label: "Perfil", icon: "person", active: false },
] satisfies Array<{ label: string; icon: SymbolName; active: boolean }>;

function AppIcon({
  name,
  size = 24,
  color = COLORS.gold,
}: {
  name: SymbolName;
  size?: number;
  color?: string;
}) {
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      weight="regular"
      resizeMode="scaleAspectFit"
    />
  );
}

export default function EventDetailsScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <LinearGradient
            colors={["#050505", COLORS.black, "#080808"]}
            locations={[0, 0.48, 1]}
            style={styles.container}
          >
            <View style={styles.goldGlowTop} />
            <View style={styles.goldGlowBottom} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.header}>
                <TouchableOpacity activeOpacity={0.75} style={styles.headerButton}>
                  <AppIcon name="line.3.horizontal" size={30} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.75} style={styles.notificationButton}>
                  <AppIcon name="bell.fill" size={30} />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>1</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.heroCopy}>
                <Text style={styles.titleWhite}>¿A dónde vas a llevar</Text>
                <Text style={styles.titleGold}>la música hoy?</Text>
              </View>

              <BlurView intensity={25} tint="dark" style={styles.searchBox}>
                <AppIcon name="person.3" size={25} color={COLORS.ivory} />
                <Text style={styles.searchText}>¿Cuántos elementos para tu mariachi?</Text>
              </BlurView>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categories}
              >
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.label}
                    activeOpacity={0.82}
                    style={styles.categoryItem}
                  >
                    <View style={styles.categoryCircle}>
                      <AppIcon name={category.icon} size={28} />
                    </View>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Servicios populares</Text>
                <TouchableOpacity activeOpacity={0.75}>
                  <Text style={styles.seeAll}>Ver todos</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.servicesList}>
                {SERVICES.map((service) => (
                  <TouchableOpacity
                    key={service.title}
                    activeOpacity={0.88}
                    style={styles.serviceCard}
                  >
                    <ImageBackground
                      source={service.image}
                      resizeMode="cover"
                      style={styles.serviceImage}
                      imageStyle={styles.serviceImageStyle}
                    >
                      <LinearGradient
                        colors={[
                          "rgba(0,0,0,0.84)",
                          "rgba(0,0,0,0.38)",
                          "rgba(0,0,0,0.82)",
                        ]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.serviceOverlay}
                      >
                        <View style={styles.serviceTextBlock}>
                          <Text style={styles.serviceTitle}>{service.title}</Text>
                          <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                        </View>

                        {service.icon ? (
                          <View style={styles.packageIconWrap}>
                            <AppIcon name={service.icon} size={58} />
                          </View>
                        ) : null}

                        <View style={styles.chevronWrap}>
                          <AppIcon name="chevron.right" size={28} color={COLORS.ivory} />
                        </View>
                      </LinearGradient>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <BlurView intensity={28} tint="dark" style={styles.tabBar}>
              {TABS.map((tab) => (
                <TouchableOpacity key={tab.label} activeOpacity={0.8} style={styles.tabItem}>
                  <AppIcon
                    name={tab.icon}
                    size={30}
                    color={tab.active ? COLORS.gold : "#787878"}
                  />
                  <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </BlurView>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  appFrame: {
    flex: 1,
    width: "100%",
    maxWidth: MOBILE_WIDTH,
    overflow: "hidden",
    backgroundColor: COLORS.black,
    ...Platform.select({
      web: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 24 },
        shadowOpacity: 0.42,
        shadowRadius: 40,
      },
      default: {},
    }),
  },
  container: {
    flex: 1,
  },
  goldGlowTop: {
    position: "absolute",
    top: -130,
    right: -120,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(200,155,60,0.14)",
  },
  goldGlowBottom: {
    position: "absolute",
    bottom: 70,
    left: -150,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(200,155,60,0.07)",
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 122,
  },
  header: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    width: 44,
    height: 40,
    justifyContent: "center",
  },
  notificationButton: {
    width: 44,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 3,
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.goldLight,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.35)",
  },
  notificationBadgeText: {
    color: COLORS.black,
    fontSize: 9,
    fontWeight: "900",
  },
  heroCopy: {
    marginTop: 14,
    marginBottom: 28,
  },
  titleWhite: {
    color: COLORS.ivory,
    fontSize: 27,
    lineHeight: 36,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  titleGold: {
    marginTop: 1,
    color: COLORS.gold,
    fontSize: 42,
    lineHeight: 50,
    fontWeight: "800",
    letterSpacing: -0.8,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }),
  },
  searchBox: {
    height: 64,
    borderRadius: 15,
    overflow: "hidden",
    paddingHorizontal: 21,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
  },
  searchText: {
    flex: 1,
    color: "rgba(247,243,235,0.58)",
    fontSize: 16,
    fontWeight: "600",
  },
  categories: {
    gap: 16,
    paddingTop: 42,
    paddingBottom: 31,
  },
  categoryItem: {
    width: 58,
    alignItems: "center",
  },
  categoryCircle: {
    width: 58,
    height: 58,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.035)",
  },
  categoryLabel: {
    marginTop: 10,
    color: COLORS.ivory,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  sectionHeader: {
    marginBottom: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: COLORS.ivory,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  seeAll: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: "800",
  },
  servicesList: {
    gap: 15,
  },
  serviceCard: {
    height: 132,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: COLORS.blackSecondary,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.045)",
  },
  serviceImage: {
    flex: 1,
  },
  serviceImageStyle: {
    borderRadius: 15,
  },
  serviceOverlay: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 19,
    flexDirection: "row",
    alignItems: "center",
  },
  serviceTextBlock: {
    flex: 1,
    maxWidth: 210,
  },
  serviceTitle: {
    color: COLORS.ivory,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  serviceSubtitle: {
    marginTop: 5,
    color: "rgba(247,243,235,0.82)",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
  },
  packageIconWrap: {
    position: "absolute",
    right: 54,
    top: 36,
    opacity: 0.95,
  },
  chevronWrap: {
    width: 28,
    alignItems: "flex-end",
  },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    overflow: "hidden",
    paddingTop: 10,
    paddingHorizontal: 19,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(18,18,18,0.86)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  tabItem: {
    minWidth: 70,
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    color: "#747474",
    fontSize: 12,
    fontWeight: "700",
  },
  tabLabelActive: {
    color: COLORS.gold,
  },
});
