import React, { useMemo, useState } from "react";
import {
  Alert,
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
import { SymbolView } from "expo-symbols";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";

type SymbolName = React.ComponentProps<typeof SymbolView>["name"];
type CategoryLabel = "Cumpleaños" | "Serenatas" | "Bodas" | "XV Años" | "Empresas" | "Más";

type Category = {
  label: CategoryLabel;
  icon: SymbolName;
};

type Service = {
  title: string;
  subtitle: string;
  image?: number;
  icon?: SymbolName;
  type: "mariachis" | "serenades" | "packages";
};

type Tab = {
  label: string;
  icon: SymbolName;
  active: boolean;
  onPress: () => void;
};

const MOBILE_WIDTH = 430;

const quantityOptions = [4, 5, 6, 7, 8, 9, 10, 12, 15];

const categories: Category[] = [
  { label: "Cumpleaños", icon: "birthday.cake" },
  { label: "Serenatas", icon: "music.mic" },
  { label: "Bodas", icon: "heart.circle" },
  { label: "XV Años", icon: "crown" },
  { label: "Empresas", icon: "building.2" },
  { label: "Más", icon: "ellipsis" },
];

const serviceImages = {
  mariachis: require("@/assets/images/mariachis/mariachi1.png"),
  serenades: require("@/assets/images/mariachis/mariachi2.png"),
  packages: require("@/assets/images/mariachis/mariachibg.png"),
};

const servicesByCategory: Record<CategoryLabel, Service[]> = {
  Cumpleaños: [
    { title: "Mariachis", subtitle: "Elige el grupo perfecto", image: serviceImages.mariachis, type: "mariachis" },
    { title: "Paquetes", subtitle: "Celebra con una experiencia completa", image: serviceImages.packages, icon: "gift", type: "packages" },
    { title: "Serenatas", subtitle: "Momentos memorables para festejar", image: serviceImages.serenades, type: "serenades" },
  ],
  Serenatas: [
    { title: "Serenatas", subtitle: "Sorprende a esa persona especial", image: serviceImages.serenades, type: "serenades" },
    { title: "Mariachis románticos", subtitle: "Canciones clásicas con estilo premium", image: serviceImages.mariachis, type: "mariachis" },
    { title: "Paquetes sorpresa", subtitle: "Detalles listos para una noche única", image: serviceImages.packages, icon: "gift", type: "packages" },
  ],
  Bodas: [
    { title: "Mariachis para bodas", subtitle: "Música elegante para tu celebración", image: serviceImages.mariachis, type: "mariachis" },
    { title: "Paquetes premium", subtitle: "Experiencias completas para invitados", image: serviceImages.packages, icon: "gift", type: "packages" },
    { title: "Música para ceremonia", subtitle: "Entrada, misa y momentos especiales", image: serviceImages.serenades, type: "serenades" },
  ],
  "XV Años": [
    { title: "Mariachis para XV años", subtitle: "Una entrada inolvidable", image: serviceImages.mariachis, type: "mariachis" },
    { title: "Entrada especial", subtitle: "Acompañamiento para el momento principal", image: serviceImages.serenades, type: "serenades" },
    { title: "Paquetes familiares", subtitle: "Opciones para toda la celebración", image: serviceImages.packages, icon: "gift", type: "packages" },
  ],
  Empresas: [
    { title: "Eventos empresariales", subtitle: "Ameniza cenas, lanzamientos y posadas", image: serviceImages.serenades, type: "serenades" },
    { title: "Paquetes corporativos", subtitle: "Soluciones para equipos y clientes", image: serviceImages.packages, icon: "gift", type: "packages" },
    { title: "Mariachis premium", subtitle: "Presentación ejecutiva de alto nivel", image: serviceImages.mariachis, type: "mariachis" },
  ],
  Más: [
    { title: "Aniversarios", subtitle: "Celebra historias con música en vivo", image: serviceImages.serenades, type: "serenades" },
    { title: "Despedidas", subtitle: "Música para cierres memorables", image: serviceImages.packages, icon: "gift", type: "packages" },
    { title: "Eventos privados", subtitle: "Mariachi a la medida de tu evento", image: serviceImages.mariachis, type: "mariachis" },
  ],
};

function AppIcon({ name, size = 24, color = COLORS.gold }: { name: SymbolName; size?: number; color?: string }) {
  return <SymbolView name={name} size={size} tintColor={color} weight="regular" resizeMode="scaleAspectFit" />;
}

export default function EventDetailsScreen() {
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryLabel>("Cumpleaños");

  const services = servicesByCategory[selectedCategory];
  const tabs: Tab[] = useMemo(
    () => [
      { label: "Inicio", icon: "house.fill", active: true, onPress: () => router.replace("/event-details") },
      { label: "Favoritos", icon: "heart", active: false, onPress: () => router.push("/favorites") },
      { label: "Mis eventos", icon: "calendar", active: false, onPress: () => router.push("/my-events") },
      { label: "Perfil", icon: "person", active: false, onPress: () => router.push("/profile") },
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
    router.push({ pathname: "/mariachis", params: { musicians: String(selectedQuantity), category: selectedCategory } });
  };

  const handleServicePress = (service: Service) => {
    if (service.type === "mariachis") {
      navigateToMariachis();
      return;
    }
    if (service.type === "serenades") router.push("/serenades");
    if (service.type === "packages") router.push("/packages");
  };

  const handleSeeAll = () => {
    if (!selectedQuantity) {
      Alert.alert("Selecciona primero", "Selecciona primero la cantidad de elementos para tu mariachi.");
      return;
    }
    router.push({ pathname: "/mariachis", params: { musicians: String(selectedQuantity), category: selectedCategory } });
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <LinearGradient colors={["#050505", COLORS.black, "#080808"]} locations={[0, 0.48, 1]} style={styles.container}>
            <View style={styles.goldGlowTop} />
            <View style={styles.goldGlowBottom} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.header}>
                <TouchableOpacity activeOpacity={0.75} style={styles.headerButton}>
                  <AppIcon name="line.3.horizontal" size={30} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.75} style={styles.notificationButton}>
                  <AppIcon name="bell.fill" size={30} />
                  <View style={styles.notificationBadge}><Text style={styles.notificationBadgeText}>1</Text></View>
                </TouchableOpacity>
              </View>

              <View style={styles.heroCopy}>
                <Text style={styles.titleWhite}>¿A dónde vas a llevar</Text>
                <Text style={styles.titleGold}>la música hoy?</Text>
              </View>

              <TouchableOpacity activeOpacity={0.86} onPress={() => setQuantityModalVisible(true)}>
                <BlurView intensity={25} tint="dark" style={styles.searchBox}>
                  <AppIcon name="person.3" size={25} color={COLORS.ivory} />
                  <Text style={[styles.searchText, selectedQuantity !== null && styles.searchTextSelected]}>
                    {selectedQuantity ? `${selectedQuantity} elementos seleccionados` : "¿Cuántos elementos para tu mariachi?"}
                  </Text>
                  <AppIcon name="chevron.down" size={20} color={COLORS.gold} />
                </BlurView>
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
                {categories.map((category) => {
                  const isActive = category.label === selectedCategory;
                  return (
                    <TouchableOpacity key={category.label} activeOpacity={0.82} style={styles.categoryItem} onPress={() => setSelectedCategory(category.label)}>
                      <View style={[styles.categoryCircle, isActive && styles.categoryCircleActive]}>
                        <AppIcon name={category.icon} size={28} color={isActive ? COLORS.black : COLORS.gold} />
                      </View>
                      <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>{category.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Servicios populares</Text>
                <TouchableOpacity activeOpacity={0.75} onPress={handleSeeAll}><Text style={styles.seeAll}>Ver todos</Text></TouchableOpacity>
              </View>

              <View style={styles.servicesList}>
                {services.map((service) => (
                  <TouchableOpacity key={`${selectedCategory}-${service.title}`} activeOpacity={0.88} style={styles.serviceCard} onPress={() => handleServicePress(service)}>
                    <ImageBackground source={service.image} resizeMode="cover" style={styles.serviceImage} imageStyle={styles.serviceImageStyle}>
                      <LinearGradient colors={["rgba(0,0,0,0.84)", "rgba(0,0,0,0.38)", "rgba(0,0,0,0.82)"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.serviceOverlay}>
                        <View style={styles.serviceTextBlock}><Text style={styles.serviceTitle}>{service.title}</Text><Text style={styles.serviceSubtitle}>{service.subtitle}</Text></View>
                        {service.icon ? <View style={styles.packageIconWrap}><AppIcon name={service.icon} size={58} /></View> : null}
                        <View style={styles.chevronWrap}><AppIcon name="chevron.right" size={28} color={COLORS.ivory} /></View>
                      </LinearGradient>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <BlurView intensity={28} tint="dark" style={styles.tabBar}>
              {tabs.map((tab) => (
                <TouchableOpacity key={tab.label} activeOpacity={0.8} style={styles.tabItem} onPress={tab.onPress}>
                  <AppIcon name={tab.icon} size={30} color={tab.active ? COLORS.gold : "#787878"} />
                  <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </BlurView>
          </LinearGradient>
        </View>
      </SafeAreaView>

      <Modal visible={quantityModalVisible} transparent animationType="fade" onRequestClose={() => setQuantityModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setQuantityModalVisible(false)}>
          <Pressable style={styles.quantitySheet}>
            <BlurView intensity={46} tint="dark" style={styles.quantityBlur}>
              <View style={styles.quantityHandle} />
              <Text style={styles.quantityTitle}>Selecciona la cantidad de elementos</Text>
              <View style={styles.quantityGrid}>
                {quantityOptions.map((quantity) => {
                  const isSelected = quantity === selectedQuantity;
                  return (
                    <TouchableOpacity key={quantity} activeOpacity={0.84} style={[styles.quantityOption, isSelected && styles.quantityOptionActive]} onPress={() => { setSelectedQuantity(quantity); setQuantityModalVisible(false); }}>
                      <Text style={[styles.quantityOptionText, isSelected && styles.quantityOptionTextActive]}>{quantity}</Text>
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
  appFrame: { flex: 1, width: "100%", maxWidth: MOBILE_WIDTH, overflow: "hidden", backgroundColor: COLORS.black, ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.42, shadowRadius: 40 }, default: {} }) },
  container: { flex: 1 },
  goldGlowTop: { position: "absolute", top: -130, right: -120, width: 260, height: 260, borderRadius: 130, backgroundColor: "rgba(200,155,60,0.14)" },
  goldGlowBottom: { position: "absolute", bottom: 70, left: -150, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(200,155,60,0.07)" },
  scrollContent: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 122 },
  header: { height: 40, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerButton: { width: 44, height: 40, justifyContent: "center" },
  notificationButton: { width: 44, height: 40, alignItems: "center", justifyContent: "center" },
  notificationBadge: { position: "absolute", top: 0, right: 3, width: 17, height: 17, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.goldLight, borderWidth: 1, borderColor: "rgba(0,0,0,0.35)" },
  notificationBadgeText: { color: COLORS.black, fontSize: 9, fontWeight: "900" },
  heroCopy: { marginTop: 14, marginBottom: 28 },
  titleWhite: { color: COLORS.ivory, fontSize: 27, lineHeight: 36, fontWeight: "600", letterSpacing: -0.5 },
  titleGold: { marginTop: 1, color: COLORS.gold, fontSize: 42, lineHeight: 50, fontWeight: "800", letterSpacing: -0.8, fontFamily: Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" }) },
  searchBox: { height: 64, borderRadius: 15, overflow: "hidden", paddingHorizontal: 21, flexDirection: "row", alignItems: "center", gap: 15, backgroundColor: "rgba(255,255,255,0.055)", borderWidth: 1, borderColor: "rgba(255,255,255,0.055)" },
  searchText: { flex: 1, color: "rgba(247,243,235,0.58)", fontSize: 16, fontWeight: "600" },
  searchTextSelected: { color: COLORS.ivory },
  categories: { gap: 16, paddingTop: 42, paddingBottom: 31 },
  categoryItem: { width: 58, alignItems: "center" },
  categoryCircle: { width: 58, height: 58, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.055)", borderWidth: 1, borderColor: "rgba(255,255,255,0.035)" },
  categoryCircleActive: { backgroundColor: COLORS.gold, borderColor: COLORS.goldLight },
  categoryLabel: { marginTop: 10, color: COLORS.ivory, fontSize: 11, fontWeight: "700", textAlign: "center" },
  categoryLabelActive: { color: COLORS.gold },
  sectionHeader: { marginBottom: 17, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: COLORS.ivory, fontSize: 19, fontWeight: "800", letterSpacing: -0.3 },
  seeAll: { color: COLORS.gold, fontSize: 14, fontWeight: "800" },
  servicesList: { gap: 15 },
  serviceCard: { height: 132, borderRadius: 15, overflow: "hidden", backgroundColor: COLORS.blackSecondary, borderWidth: 1, borderColor: "rgba(255,255,255,0.045)" },
  serviceImage: { flex: 1 },
  serviceImageStyle: { borderRadius: 15 },
  serviceOverlay: { flex: 1, paddingLeft: 24, paddingRight: 19, flexDirection: "row", alignItems: "center" },
  serviceTextBlock: { flex: 1, maxWidth: 230 },
  serviceTitle: { color: COLORS.ivory, fontSize: 24, lineHeight: 29, fontWeight: "900", letterSpacing: -0.4 },
  serviceSubtitle: { marginTop: 5, color: "rgba(247,243,235,0.82)", fontSize: 15, lineHeight: 21, fontWeight: "600" },
  packageIconWrap: { position: "absolute", right: 54, top: 36, opacity: 0.95 },
  chevronWrap: { width: 28, alignItems: "flex-end" },
  tabBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 76, overflow: "hidden", paddingTop: 10, paddingHorizontal: 19, flexDirection: "row", justifyContent: "space-between", backgroundColor: "rgba(18,18,18,0.86)", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.05)" },
  tabItem: { minWidth: 70, alignItems: "center", gap: 4 },
  tabLabel: { color: "#747474", fontSize: 12, fontWeight: "700" },
  tabLabelActive: { color: COLORS.gold },
  modalOverlay: { flex: 1, justifyContent: "flex-end", alignItems: "center", backgroundColor: "rgba(0,0,0,0.64)" },
  quantitySheet: { width: "100%", maxWidth: MOBILE_WIDTH, paddingHorizontal: 12, paddingBottom: 14 },
  quantityBlur: { overflow: "hidden", borderRadius: 28, paddingHorizontal: 20, paddingTop: 13, paddingBottom: 24, backgroundColor: "rgba(18,18,18,0.92)", borderWidth: 1, borderColor: "rgba(216,183,106,0.32)" },
  quantityHandle: { alignSelf: "center", width: 42, height: 4, borderRadius: 999, backgroundColor: "rgba(247,243,235,0.26)", marginBottom: 20 },
  quantityTitle: { color: COLORS.ivory, fontSize: 22, lineHeight: 28, fontWeight: "900", textAlign: "center", letterSpacing: -0.35 },
  quantityGrid: { marginTop: 22, flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" },
  quantityOption: { width: 76, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.065)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  quantityOptionActive: { backgroundColor: COLORS.gold, borderColor: COLORS.goldLight },
  quantityOptionText: { color: COLORS.ivory, fontSize: 19, fontWeight: "900" },
  quantityOptionTextActive: { color: COLORS.black },
});
