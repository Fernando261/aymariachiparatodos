import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  BellIcon,
  BuildingIcon,
  CakeIcon,
  CalendarIcon,
  ChevronRightIcon,
  CrownIcon,
  GiftIcon,
  HeartIcon,
  HomeIcon,
  MenuIcon,
  MoreIcon,
  MusicIcon,
  SparklesIcon,
  UserIcon,
  UsersIcon,
} from "@/components/AppIcons";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";

type CategoryLabel = "Cumpleaños" | "Serenatas" | "Bodas" | "XV Años" | "Empresas" | "Más";
type IconComponent = (props: { size?: number; color?: string; strokeWidth?: number }) => React.ReactElement;

type Category = {
  label: CategoryLabel;
  Icon: IconComponent;
};

type Service = {
  title: string;
  subtitle: string;
  image?: number;
  Icon?: IconComponent;
  type: "mariachis" | "serenades" | "packages";
};

type Tab = {
  label: string;
  Icon: IconComponent;
  active: boolean;
  onPress: () => void;
};

const MOBILE_WIDTH = 430;
const quantityOptions = [4, 5, 6, 7, 8, 9, 10, 12, 15];
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");

const categories: Category[] = [
  { label: "Cumpleaños", Icon: CakeIcon },
  { label: "Serenatas", Icon: MusicIcon },
  { label: "Bodas", Icon: HeartIcon },
  { label: "XV Años", Icon: CrownIcon },
  { label: "Empresas", Icon: BuildingIcon },
  { label: "Más", Icon: MoreIcon },
];

const serviceImages = {
  mariachis: require("@/assets/images/mariachis/mariachi1.png"),
  serenades: require("@/assets/images/mariachis/mariachi2.png"),
  packages: require("@/assets/images/mariachis/mariachi3.png"),
};

const servicesByCategory: Record<CategoryLabel, Service[]> = {
  Cumpleaños: [
    { title: "Mariachis", subtitle: "Elige el grupo perfecto", image: serviceImages.mariachis, type: "mariachis" },
    { title: "Serenatas", subtitle: "Sorprende a esa persona especial", image: serviceImages.serenades, type: "serenades" },
    { title: "Paquetes", subtitle: "Ahorra con nuestros paquetes especiales", image: serviceImages.packages, Icon: GiftIcon, type: "packages" },
  ],
  Serenatas: [
    { title: "Mariachis", subtitle: "Elige el grupo perfecto", image: serviceImages.mariachis, type: "mariachis" },
    { title: "Serenatas", subtitle: "Sorprende a esa persona especial", image: serviceImages.serenades, type: "serenades" },
    { title: "Paquetes", subtitle: "Ahorra con nuestros paquetes especiales", image: serviceImages.packages, Icon: GiftIcon, type: "packages" },
  ],
  Bodas: [
    { title: "Mariachis", subtitle: "Elige el grupo perfecto", image: serviceImages.mariachis, type: "mariachis" },
    { title: "Serenatas", subtitle: "Sorprende a esa persona especial", image: serviceImages.serenades, type: "serenades" },
    { title: "Paquetes", subtitle: "Ahorra con nuestros paquetes especiales", image: serviceImages.packages, Icon: GiftIcon, type: "packages" },
  ],
  "XV Años": [
    { title: "Mariachis", subtitle: "Elige el grupo perfecto", image: serviceImages.mariachis, type: "mariachis" },
    { title: "Serenatas", subtitle: "Sorprende a esa persona especial", image: serviceImages.serenades, type: "serenades" },
    { title: "Paquetes", subtitle: "Ahorra con nuestros paquetes especiales", image: serviceImages.packages, Icon: GiftIcon, type: "packages" },
  ],
  Empresas: [
    { title: "Mariachis", subtitle: "Elige el grupo perfecto", image: serviceImages.mariachis, type: "mariachis" },
    { title: "Serenatas", subtitle: "Sorprende a esa persona especial", image: serviceImages.serenades, type: "serenades" },
    { title: "Paquetes", subtitle: "Ahorra con nuestros paquetes especiales", image: serviceImages.packages, Icon: GiftIcon, type: "packages" },
  ],
  Más: [
    { title: "Mariachis", subtitle: "Elige el grupo perfecto", image: serviceImages.mariachis, type: "mariachis" },
    { title: "Serenatas", subtitle: "Sorprende a esa persona especial", image: serviceImages.serenades, type: "serenades" },
    { title: "Paquetes", subtitle: "Ahorra con nuestros paquetes especiales", image: serviceImages.packages, Icon: GiftIcon, type: "packages" },
  ],
};

function CategoryIcon({ category, active }: { category: Category; active: boolean }) {
  const color = COLORS.gold;
  const Icon = category.Icon;
  return <Icon size={24} color={color} strokeWidth={2.2} />;
}

export default function EventDetailsScreen() {
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryLabel>("Cumpleaños");
  const services = servicesByCategory[selectedCategory];

  const tabs: Tab[] = useMemo(
    () => [
      { label: "Inicio", Icon: HomeIcon, active: true, onPress: () => router.replace("/event-details") },
      { label: "Favoritos", Icon: HeartIcon, active: false, onPress: () => router.push("/favorites") },
      { label: "Mis eventos", Icon: CalendarIcon, active: false, onPress: () => router.push("/my-events") },
      { label: "Perfil", Icon: UserIcon, active: false, onPress: () => router.push("/profile") },
    ],
    []
  );

  const requireQuantity = () => {
    if (selectedQuantity) return true;
    Alert.alert("Cantidad requerida", "Selecciona cuántos elementos quieres para tu mariachi.");
    return false;
  };

  const navigateToMariachis = () => {
    if (!requireQuantity()) return;
    router.push({ pathname: "/mariachis", params: { musicians: selectedQuantity, category: selectedCategory } });
  };

  const handleServicePress = (service: Service) => {
    if (service.type === "mariachis") return navigateToMariachis();
    if (service.type === "serenades") return router.push("/serenades");
    return router.push("/packages");
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <Image source={backgroundImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.dimLayer} />
          <LinearGradient colors={["rgba(0,0,0,0.22)", "rgba(0,0,0,0.46)", "rgba(0,0,0,0.82)"]} locations={[0, 0.48, 1]} style={StyleSheet.absoluteFill} />
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
              <Text style={styles.titleWhite}>¿A dónde vas a llevar</Text>
              <Text style={styles.titleGold}>la música hoy?</Text>
              <Text style={styles.heroSubtitle}>Contrata experiencias con alma tapatía para tu próxima celebración.</Text>
            </View>

            <TouchableOpacity activeOpacity={0.86} onPress={() => setQuantityModalVisible(true)}>
              <BlurView intensity={28} tint="dark" style={styles.searchBox}>
                <UsersIcon size={22} color={COLORS.white} strokeWidth={2.2} />
                <Text style={[styles.searchText, selectedQuantity !== null && styles.searchTextSelected]}>
                  {selectedQuantity ? `${selectedQuantity} elementos seleccionados` : "¿Cuántos elementos para tu mariachi?"}
                </Text>
                <ChevronRightIcon size={20} color={COLORS.gold} strokeWidth={2.2} />
              </BlurView>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
              {categories.map((category) => {
                const isActive = category.label === selectedCategory;
                return (
                  <TouchableOpacity key={category.label} activeOpacity={0.82} style={styles.categoryItem} onPress={() => setSelectedCategory(category.label)}>
                    <View style={[styles.categoryCircle, isActive && styles.categoryCircleActive]}>
                      <CategoryIcon category={category} active={isActive} />
                    </View>
                    <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>{category.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>Curaduría destacada</Text>
                <Text style={styles.sectionTitle}>Servicios populares</Text>
              </View>
              <TouchableOpacity activeOpacity={0.75} onPress={navigateToMariachis}><Text style={styles.seeAll}>Ver todos</Text></TouchableOpacity>
            </View>

            <View style={styles.servicesList}>
              {services.map((service) => (
                <TouchableOpacity key={`${selectedCategory}-${service.title}`} activeOpacity={0.88} style={styles.serviceCard} onPress={() => handleServicePress(service)}>
                  <ImageBackground source={service.image} resizeMode="cover" style={styles.serviceImage} imageStyle={styles.serviceImageStyle}>
                    <LinearGradient colors={["rgba(0,0,0,0.9)", "rgba(0,0,0,0.42)", "rgba(0,0,0,0.86)"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.serviceOverlay}>
                      <View style={styles.cardAccent} />
                      <View style={styles.serviceTextBlock}>
                        <Text style={styles.serviceTitle}>{service.title}</Text>
                        <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                      </View>
                      {service.Icon ? <View style={styles.packageIcon}><service.Icon size={42} color={COLORS.gold} strokeWidth={1.8} /></View> : null}
                      {service.type === "mariachis" ? <View style={styles.serviceIcon}><MusicIcon size={26} color={COLORS.gold} strokeWidth={2} /></View> : null}
                      {service.type === "serenades" ? <View style={styles.serviceIcon}><SparklesIcon size={26} color={COLORS.gold} strokeWidth={2} /></View> : null}
                      <View style={styles.chevronWrap}><ChevronRightIcon size={24} color={COLORS.white} strokeWidth={2.2} /></View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <BlurView intensity={34} tint="dark" style={styles.tabBar}>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab.label} activeOpacity={0.8} style={styles.tabItem} onPress={tab.onPress}>
                <tab.Icon size={24} color={tab.active ? COLORS.gold : COLORS.gray} strokeWidth={2.2} />
                <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </BlurView>
        </View>
      </SafeAreaView>

      <Modal visible={quantityModalVisible} transparent animationType="slide" onRequestClose={() => setQuantityModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setQuantityModalVisible(false)}>
          <Pressable style={styles.quantitySheet}>
            <BlurView intensity={48} tint="dark" style={styles.quantityBlur}>
              <View style={styles.sheetHandle} />
              <View style={styles.quantityTitleRow}>
                <MusicIcon size={28} color={COLORS.gold} strokeWidth={2.2} />
                <Text style={styles.quantityTitle}>Selecciona la cantidad de elementos</Text>
              </View>
              <View style={styles.quantityGrid}>
                {quantityOptions.map((quantity) => {
                  const isSelected = quantity === selectedQuantity;
                  return (
                    <TouchableOpacity key={quantity} activeOpacity={0.84} style={[styles.quantityOption, isSelected && styles.quantityOptionActive]} onPress={() => { setSelectedQuantity(quantity); setQuantityModalVisible(false); }}>
                      <Text style={[styles.quantityOptionText, isSelected && styles.quantityOptionTextActive]}>{quantity}</Text>
                      <Text style={[styles.quantityOptionCaption, isSelected && styles.quantityOptionTextActive]}>elementos</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </BlurView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000000" },
  safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000000" },
  appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black, ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.42, shadowRadius: 40 }, default: {} }) },
  dimLayer: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.35)" },
  goldLineTop: { position: "absolute", top: 92, left: 18, right: 18, height: 1, backgroundColor: "rgba(216,183,106,0.22)" },
  goldLineBottom: { position: "absolute", bottom: 87, left: 28, right: 28, height: 1, backgroundColor: "rgba(216,183,106,0.18)" },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 126 },
  header: { height: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerSquare: { width: 54, height: 54, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(18,18,18,0.58)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  logo: { position: "absolute", left: 116, right: 116, top: 1, height: 70 },
  notificationBadge: { position: "absolute", top: 7, right: 8, width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.goldLight, borderWidth: 1, borderColor: COLORS.black },
  heroCopy: { marginTop: 20, marginBottom: 24 },
  kicker: { color: COLORS.goldLight, fontSize: 12, fontWeight: "900", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 },
  titleWhite: { color: COLORS.ivory, fontSize: 28, lineHeight: 35, fontWeight: "700", letterSpacing: -0.5 },
  titleGold: { color: COLORS.gold, fontSize: 43, lineHeight: 50, fontWeight: "900", letterSpacing: -0.9, fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  heroSubtitle: { marginTop: 10, color: "rgba(247,243,235,0.78)", fontSize: 14, lineHeight: 20, fontWeight: "600", maxWidth: 330 },
  searchBox: { height: 66, borderRadius: 18, overflow: "hidden", paddingHorizontal: 18, flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: "rgba(18,18,18,0.58)", borderWidth: 1, borderColor: "rgba(216,183,106,0.26)" },
  searchText: { flex: 1, color: "rgba(247,243,235,0.62)", fontSize: 15.5, fontWeight: "700" },
  searchTextSelected: { color: COLORS.ivory },
  categories: { gap: 14, paddingTop: 30, paddingBottom: 28 },
  categoryItem: { width: 64, alignItems: "center" },
  categoryCircle: { width: 58, height: 58, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder },
  categoryCircleActive: { backgroundColor: "rgba(216,183,106,0.16)", borderColor: COLORS.gold },
  categoryLabel: { marginTop: 9, color: "rgba(247,243,235,0.78)", fontSize: 10.5, fontWeight: "800", textAlign: "center" },
  categoryLabelActive: { color: COLORS.goldLight },
  sectionHeader: { marginBottom: 16, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  sectionEyebrow: { color: "rgba(216,183,106,0.75)", fontSize: 11, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 },
  sectionTitle: { color: COLORS.ivory, fontSize: 20, fontWeight: "900", letterSpacing: -0.35 },
  seeAll: { color: COLORS.gold, fontSize: 14, fontWeight: "900" },
  servicesList: { gap: 15 },
  serviceCard: { height: 136, borderRadius: 18, overflow: "hidden", backgroundColor: COLORS.blackSecondary, borderWidth: 1, borderColor: "rgba(255,255,255,0.13)", ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.24, shadowRadius: 18 }, default: { elevation: 5 } }) },
  serviceImage: { flex: 1 },
  serviceImageStyle: { borderRadius: 18 },
  serviceOverlay: { flex: 1, paddingLeft: 22, paddingRight: 17, flexDirection: "row", alignItems: "center" },
  cardAccent: { width: 3, height: 68, backgroundColor: COLORS.gold, marginRight: 15 },
  serviceTextBlock: { flex: 1, maxWidth: 240 },
  serviceTitle: { color: COLORS.ivory, fontSize: 24, lineHeight: 29, fontWeight: "900", letterSpacing: -0.45 },
  serviceSubtitle: { marginTop: 6, color: "rgba(247,243,235,0.82)", fontSize: 14.5, lineHeight: 20, fontWeight: "600" },
  packageIcon: { position: "absolute", right: 58, top: 46, opacity: 0.95 },
  serviceIcon: { position: "absolute", right: 64, top: 55, opacity: 0.92 },
  chevronWrap: { width: 36, height: 36, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" },
  tabBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 80, overflow: "hidden", paddingTop: 11, paddingHorizontal: 12, flexDirection: "row", justifyContent: "space-between", backgroundColor: "rgba(18,18,18,0.86)", borderTopWidth: 1, borderTopColor: "rgba(216,183,106,0.2)" },
  tabItem: { minWidth: 74, alignItems: "center", gap: 5 },
  tabLabel: { color: COLORS.gray, fontSize: 11.5, fontWeight: "800" },
  tabLabelActive: { color: COLORS.gold },
  modalOverlay: { flex: 1, justifyContent: "flex-end", alignItems: "center", backgroundColor: "rgba(0,0,0,0.64)" },
  quantitySheet: { width: "100%", maxWidth: MOBILE_WIDTH, paddingHorizontal: 12, paddingBottom: 14 },
  quantityBlur: { overflow: "hidden", borderRadius: 28, paddingHorizontal: 20, paddingTop: 13, paddingBottom: 24, backgroundColor: "rgba(18,18,18,0.94)", borderWidth: 1, borderColor: "rgba(216,183,106,0.32)" },
  sheetHandle: { alignSelf: "center", width: 42, height: 4, borderRadius: 2, backgroundColor: "rgba(247,243,235,0.26)", marginBottom: 18 },
  quantityTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 10 },
  quantityTitle: { flexShrink: 1, color: COLORS.ivory, fontSize: 20, lineHeight: 26, fontWeight: "900", textAlign: "center", letterSpacing: -0.35 },
  quantityGrid: { marginTop: 22, flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" },
  quantityOption: { width: 78, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.065)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  quantityOptionActive: { backgroundColor: COLORS.gold, borderColor: COLORS.goldLight },
  quantityOptionText: { color: COLORS.ivory, fontSize: 19, fontWeight: "900" },
  quantityOptionCaption: { marginTop: 1, color: "rgba(247,243,235,0.58)", fontSize: 9.5, fontWeight: "800", textTransform: "uppercase" },
  quantityOptionTextActive: { color: COLORS.black },
});
