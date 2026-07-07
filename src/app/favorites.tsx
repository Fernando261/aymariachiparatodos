import React, { useMemo, useState } from "react";
import { Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import type { ImageSourcePropType } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  BellIcon,
  CalendarIcon,
  ChevronRightIcon,
  GiftIcon,
  HeartIcon,
  HomeIcon,
  LocationIcon,
  MenuIcon,
  MusicIcon,
  SearchIcon,
  SlidersIcon,
  StarIcon,
  UserIcon,
} from "@/components/AppIcons";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");

type FavoriteType = "Mariachis" | "Serenatas" | "Paquetes";
type IconComponent = (props: { size?: number; color?: string; strokeWidth?: number }) => React.ReactElement;

type FavoriteItem = {
  id: string;
  type: FavoriteType;
  title: string;
  rating: number;
  badge: string;
  location: string;
  price: number;
  image: ImageSourcePropType;
  imageBadge: string;
};

type Filter = {
  label: FavoriteType;
  Icon: IconComponent;
};

type Tab = {
  label: string;
  Icon: IconComponent;
  active: boolean;
  onPress: () => void;
};

const filters: Filter[] = [
  { label: "Mariachis", Icon: MusicIcon },
  { label: "Serenatas", Icon: HeartIcon },
  { label: "Paquetes", Icon: GiftIcon },
];

const favoriteItems: FavoriteItem[] = [
  {
    id: "1",
    type: "Mariachis",
    title: "Grupo Verificado #184",
    rating: 4.9,
    badge: "Top",
    location: "Guadalajara y Zapopan",
    price: 2500,
    image: require("@/assets/images/mariachis/mariachi1.png"),
    imageBadge: "Verificado",
  },
  {
    id: "2",
    type: "Serenatas",
    title: "Serenata Romántica",
    rating: 4.8,
    badge: "Verificado",
    location: "Tlaquepaque",
    price: 1800,
    image: require("@/assets/images/mariachis/mariachi2.png"),
    imageBadge: "Guardado",
  },
  {
    id: "3",
    type: "Paquetes",
    title: "Paquete Fiesta",
    rating: 4.9,
    badge: "Verificado",
    location: "Zona Metropolitana",
    price: 3200,
    image: require("@/assets/images/mariachis/mariachi3.png"),
    imageBadge: "Top",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price);
}

function handleFavoritePress(item: FavoriteItem) {
  if (item.type === "Mariachis") {
    router.push({ pathname: "/mariachis", params: { favoriteId: item.id, category: item.type } });
    return;
  }

  if (item.type === "Serenatas") {
    router.push("/serenades");
    return;
  }

  router.push("/packages");
}

export default function FavoritesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FavoriteType>("Mariachis");
  const visibleFavorites = favoriteItems.filter((item) => item.type === selectedFilter);

  const tabs: Tab[] = useMemo(
    () => [
      { label: "Inicio", Icon: HomeIcon, active: false, onPress: () => router.replace("/event-details") },
      { label: "Favoritos", Icon: HeartIcon, active: true, onPress: () => router.replace("/favorites") },
      { label: "Mis eventos", Icon: CalendarIcon, active: false, onPress: () => router.push("/my-events") },
      { label: "Perfil", Icon: UserIcon, active: false, onPress: () => router.push("/profile") },
    ],
    []
  );

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <Image source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.dimLayer} />
          <LinearGradient colors={["rgba(0,0,0,0.22)", "rgba(0,0,0,0.48)", "rgba(0,0,0,0.88)"]} locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.goldLineTop} />
          <View style={styles.goldLineBottom} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.75} style={styles.headerSquare}>
                <MenuIcon size={26} color={COLORS.ivory} strokeWidth={2.1} />
              </TouchableOpacity>
              <Image source={logoImage} resizeMode="contain" style={styles.logo} />
              <TouchableOpacity activeOpacity={0.75} style={styles.headerSquare}>
                <BellIcon size={25} color={COLORS.ivory} strokeWidth={2.1} />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.title}>Favoritos</Text>
              <View style={styles.titleOrnament}>
                <View style={styles.ornamentLine} />
                <View style={styles.ornamentDiamond} />
              </View>
              <Text style={styles.subtitle}>Tus grupos y servicios guardados</Text>
            </View>

            <BlurView intensity={28} tint="dark" style={styles.searchBox}>
              <SearchIcon size={25} color={COLORS.gold} strokeWidth={2.1} />
              <TextInput placeholder="Buscar en tus favoritos..." placeholderTextColor="rgba(247,243,235,0.42)" style={styles.searchInput} />
              <SlidersIcon size={24} color={COLORS.gold} strokeWidth={2} />
            </BlurView>

            <View style={styles.filtersRow}>
              {filters.map((filter) => {
                const isActive = filter.label === selectedFilter;
                return (
                  <TouchableOpacity key={filter.label} activeOpacity={0.82} style={[styles.filterPill, isActive && styles.filterPillActive]} onPress={() => setSelectedFilter(filter.label)}>
                    <filter.Icon size={21} color={isActive ? COLORS.goldLight : COLORS.gray} strokeWidth={2} />
                    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.favoritesList}>
              {visibleFavorites.length ? (
                visibleFavorites.map((item) => <FavoriteCard key={item.id} item={item} />)
              ) : (
                <BlurView intensity={26} tint="dark" style={styles.emptyCard}>
                  <HeartIcon size={34} color={COLORS.gold} strokeWidth={1.8} />
                  <Text style={styles.emptyTitle}>Aún no tienes favoritos aquí</Text>
                  <Text style={styles.emptySubtitle}>Guarda mariachis, serenatas o paquetes para verlos después.</Text>
                </BlurView>
              )}
            </View>
          </ScrollView>

          <BlurView intensity={34} tint="dark" style={styles.tabBar}>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab.label} activeOpacity={0.8} style={styles.tabItem} onPress={tab.onPress}>
                <tab.Icon size={25} color={tab.active ? COLORS.gold : COLORS.gray} strokeWidth={2.2} />
                <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>{tab.label}</Text>
                {tab.active ? <View style={styles.tabIndicator} /> : null}
              </TouchableOpacity>
            ))}
          </BlurView>
        </View>
      </SafeAreaView>
    </View>
  );
}

function FavoriteCard({ item }: { item: FavoriteItem }) {
  return (
    <TouchableOpacity activeOpacity={0.88} style={styles.card} onPress={() => handleFavoritePress(item)}>
      <ImageBackground source={item.image} resizeMode="cover" style={styles.cardImage} imageStyle={styles.cardImageStyle}>
        <LinearGradient colors={["rgba(0,0,0,0.06)", "rgba(0,0,0,0.62)"]} style={styles.imageOverlay}>
          <View style={styles.imageBadge}>
            {item.imageBadge === "Top" ? <StarIcon size={14} color={COLORS.goldLight} strokeWidth={2} /> : <HeartIcon size={14} color={COLORS.goldLight} strokeWidth={2} />}
            <Text style={styles.imageBadgeText}>{item.imageBadge}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
          <HeartIcon size={27} color={COLORS.goldLight} strokeWidth={2.1} />
        </View>
        <View style={styles.ratingRow}>
          <StarIcon size={17} color={COLORS.goldLight} strokeWidth={2} />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.dot}>•</Text>
          <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>{item.badge}</Text></View>
        </View>
        <View style={styles.locationRow}>
          <LocationIcon size={17} color={COLORS.gray} strokeWidth={2} />
          <Text numberOfLines={1} style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={styles.cardDivider} />
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.pricePrefix}>Desde</Text>
            <Text style={styles.price}>${formatPrice(item.price)}</Text>
          </View>
          <View style={styles.chevronButton}><ChevronRightIcon size={24} color={COLORS.ivory} strokeWidth={2.2} /></View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000000" },
  safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000000" },
  appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black, ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.42, shadowRadius: 40 }, default: {} }) },
  dimLayer: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.36)" },
  goldLineTop: { position: "absolute", top: 92, left: 18, right: 18, height: 1, backgroundColor: "rgba(216,183,106,0.2)" },
  goldLineBottom: { position: "absolute", bottom: 87, left: 28, right: 28, height: 1, backgroundColor: "rgba(216,183,106,0.18)" },
  scrollContent: { paddingHorizontal: 19, paddingTop: 12, paddingBottom: 112 },
  header: { height: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerSquare: { width: 54, height: 54, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(18,18,18,0.58)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  logo: { position: "absolute", left: 116, right: 116, top: 1, height: 70 },
  notificationBadge: { position: "absolute", top: 7, right: 8, width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.goldLight, borderWidth: 1, borderColor: COLORS.black },
  heroCopy: { marginTop: 12, marginBottom: 22 },
  title: { color: COLORS.ivory, fontSize: 48, lineHeight: 56, fontWeight: "900", letterSpacing: -1.1, fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  titleOrnament: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 12 },
  ornamentLine: { width: 32, height: 2, borderRadius: 2, backgroundColor: COLORS.goldLight },
  ornamentDiamond: { width: 9, height: 9, borderWidth: 2, borderColor: COLORS.goldLight, transform: [{ rotate: "45deg" }] },
  subtitle: { marginTop: 15, color: "rgba(247,243,235,0.72)", fontSize: 17, lineHeight: 23, fontWeight: "700" },
  searchBox: { height: 60, borderRadius: 20, overflow: "hidden", paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(18,18,18,0.6)", borderWidth: 1, borderColor: "rgba(255,255,255,0.13)" },
  searchInput: { flex: 1, color: COLORS.ivory, fontSize: 16, fontWeight: "700", paddingVertical: 0 },
  filtersRow: { flexDirection: "row", gap: 8, paddingTop: 22, paddingBottom: 22 },
  filterPill: { flex: 1, minHeight: 50, borderRadius: 25, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "rgba(18,18,18,0.58)", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)" },
  filterPillActive: { backgroundColor: "rgba(216,183,106,0.14)", borderColor: COLORS.gold },
  filterText: { color: COLORS.gray, fontSize: 15, fontWeight: "800" },
  filterTextActive: { color: COLORS.goldLight },
  favoritesList: { gap: 12 },
  card: { minHeight: 142, borderRadius: 21, padding: 8, flexDirection: "row", gap: 13, backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.26, shadowRadius: 20 }, default: { elevation: 6 } }) },
  cardImage: { width: 135, minHeight: 126, borderRadius: 18, overflow: "hidden" },
  cardImageStyle: { borderRadius: 18 },
  imageOverlay: { flex: 1, justifyContent: "flex-end", padding: 10 },
  imageBadge: { alignSelf: "flex-start", minHeight: 33, borderRadius: 17, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "rgba(18,18,18,0.76)", borderWidth: 1, borderColor: "rgba(216,183,106,0.38)" },
  imageBadgeText: { color: COLORS.goldLight, fontSize: 14, fontWeight: "900" },
  cardBody: { flex: 1, paddingVertical: 7, paddingRight: 5 },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  cardTitle: { flex: 1, color: COLORS.ivory, fontSize: 20, lineHeight: 25, fontWeight: "900", letterSpacing: -0.4, fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  ratingRow: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 7 },
  ratingText: { color: "rgba(247,243,235,0.76)", fontSize: 14.5, fontWeight: "800" },
  dot: { color: "rgba(247,243,235,0.45)", fontSize: 14, fontWeight: "900" },
  smallBadge: { borderRadius: 12, paddingHorizontal: 11, paddingVertical: 3, borderWidth: 1, borderColor: "rgba(216,183,106,0.55)", backgroundColor: "rgba(216,183,106,0.08)" },
  smallBadgeText: { color: COLORS.goldLight, fontSize: 13, fontWeight: "900" },
  locationRow: { marginTop: 9, flexDirection: "row", alignItems: "center", gap: 6 },
  locationText: { flex: 1, color: COLORS.gray, fontSize: 13.5, fontWeight: "700" },
  cardDivider: { marginTop: 11, borderTopWidth: 1, borderStyle: "dashed", borderTopColor: "rgba(255,255,255,0.15)" },
  priceRow: { marginTop: 7, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pricePrefix: { color: "rgba(247,243,235,0.62)", fontSize: 12.5, fontWeight: "800" },
  price: { color: COLORS.goldLight, fontSize: 22, lineHeight: 26, fontWeight: "900", letterSpacing: -0.4, fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  chevronButton: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.08)" },
  emptyCard: { minHeight: 190, borderRadius: 24, overflow: "hidden", alignItems: "center", justifyContent: "center", paddingHorizontal: 24, backgroundColor: "rgba(18,18,18,0.68)", borderWidth: 1, borderColor: "rgba(216,183,106,0.26)" },
  emptyTitle: { marginTop: 14, color: COLORS.ivory, fontSize: 20, fontWeight: "900", textAlign: "center" },
  emptySubtitle: { marginTop: 8, color: "rgba(247,243,235,0.68)", fontSize: 14, lineHeight: 20, fontWeight: "700", textAlign: "center" },
  tabBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 80, overflow: "hidden", paddingTop: 11, paddingHorizontal: 12, flexDirection: "row", justifyContent: "space-between", backgroundColor: "rgba(18,18,18,0.86)", borderTopWidth: 1, borderTopColor: "rgba(216,183,106,0.2)" },
  tabItem: { minWidth: 74, alignItems: "center", gap: 5 },
  tabLabel: { color: COLORS.gray, fontSize: 11.5, fontWeight: "800" },
  tabLabelActive: { color: COLORS.gold },
  tabIndicator: { width: 24, height: 2, borderRadius: 2, backgroundColor: COLORS.gold, marginTop: 1 },
});
