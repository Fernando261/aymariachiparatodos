import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import type { ImageSourcePropType } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BellIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  HeartIcon,
  HomeIcon,
  LocationIcon,
  MenuIcon,
  MusicIcon,
  ShieldIcon,
  StarIcon,
  TicketIcon,
  UserIcon,
  UsersIcon,
  XIcon,
} from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;
const SIDE_SPACING = 18;
const CARD_GAP = 16;
const CARD_IMAGE_RATIO = 0.43;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");

type Mariachi = {
  id: string;
  alias: string;
  image: ImageSourcePropType;
  rating: number;
  reviews: number;
  contracts: number;
  zone: string;
  price: number;
  verified: boolean;
  comments: string[];
};

type Tab = {
  label: string;
  Icon: (props: {
    size?: number;
    color?: string;
    strokeWidth?: number;
  }) => React.ReactElement;
  active: boolean;
  onPress: () => void;
};

const mariachis: Mariachi[] = [
  {
    id: "184",
    alias: "Grupo Verificado #184",
    image: require("@/assets/images/mariachis/mariachi1.png"),
    rating: 4.9,
    reviews: 182,
    contracts: 534,
    zone: "Guadalajara y Zapopan",
    price: 2500,
    verified: true,
    comments: [
      "Excelente servicio y muy puntuales.",
      "Animaron toda la fiesta.",
      "Los volvería a contratar.",
    ],
  },
  {
    id: "207",
    alias: "Mariachi Premium #207",
    image: require("@/assets/images/mariachis/mariachi2.png"),
    rating: 4.8,
    reviews: 145,
    contracts: 421,
    zone: "Tlaquepaque",
    price: 2200,
    verified: true,
    comments: [
      "Muy profesionales.",
      "La serenata fue hermosa.",
      "Gran repertorio.",
    ],
  },
  {
    id: "321",
    alias: "Grupo Verificado #321",
    image: require("@/assets/images/mariachis/mariachi3.png"),
    rating: 5.0,
    reviews: 256,
    contracts: 701,
    zone: "Zapopan",
    price: 3000,
    verified: true,
    comments: [
      "Servicio impecable.",
      "Excelente presentación.",
      "Llegaron antes de la hora.",
    ],
  },
  {
    id: "418",
    alias: "Grupo Verificado #418",
    image: require("@/assets/images/mariachis/mariachi4.png"),
    rating: 4.7,
    reviews: 97,
    contracts: 280,
    zone: "Guadalajara Centro",
    price: 2100,
    verified: true,
    comments: [
      "Muy buen ambiente.",
      "Cuidaron cada detalle.",
      "La familia quedó encantada.",
    ],
  },
  {
    id: "512",
    alias: "Mariachi Premium #512",
    image: require("@/assets/images/mariachis/mariachi5.png"),
    rating: 4.9,
    reviews: 198,
    contracts: 612,
    zone: "Zona Metropolitana",
    price: 2800,
    verified: true,
    comments: [
      "Voces increíbles.",
      "Excelente repertorio tapatío.",
      "Muy puntuales y elegantes.",
    ],
  },
];

const filters = [
  "Mejor calificados",
  "Más contratados",
  "Precio menor",
  "Cercanos",
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    price,
  );
}

function MariachiCard({
  item,
  index,
  scrollX,
  itemSize,
  cardWidth,
  cardHeight,
  onPress,
}: {
  item: Mariachi;
  index: number;
  scrollX: SharedValue<number>;
  itemSize: number;
  cardWidth: number;
  cardHeight: number;
  onPress: () => void;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * itemSize,
      index * itemSize,
      (index + 1) * itemSize,
    ];
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.82, 1, 0.82],
      Extrapolation.CLAMP,
    );
    const rotateY = interpolate(
      scrollX.value,
      inputRange,
      [18, 0, -18],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [22, 0, 22],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.58, 1, 0.58],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { translateY },
        { scale },
      ],
      zIndex: Math.round(scale * 100),
    };
  });

  return (
    <Animated.View
      style={[styles.cardContainer, { width: itemSize }, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.cardPressable,
          pressed && styles.pressed,
        ]}
      >
        <BlurView
          intensity={34}
          tint="dark"
          style={[styles.card, { width: cardWidth, height: cardHeight }]}
        >
          <View style={styles.activeGlow} />
          <View
            style={[
              styles.imageWrapper,
              { height: cardHeight * CARD_IMAGE_RATIO },
            ]}
          >
            <Image
              source={item.image}
              resizeMode="contain"
              style={styles.cardImage}
            />
            <LinearGradient
              colors={[
                "rgba(0,0,0,0.02)",
                "rgba(0,0,0,0.18)",
                "rgba(0,0,0,0.48)",
              ]}
              locations={[0, 0.58, 1]}
              style={styles.imageOverlay}
              pointerEvents="none"
            />
            <View style={styles.imageBadge}>
              <ShieldIcon size={14} color={COLORS.goldLight} strokeWidth={2} />
              <Text style={styles.imageBadgeText}>Verificado</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.cardTitle}
            >
              {item.alias}
            </Text>
            <View style={styles.ratingLine}>
              <StarIcon size={16} color={COLORS.goldLight} strokeWidth={2} />
              <Text style={styles.ratingText}>
                {item.rating.toFixed(1)} ({item.reviews} reseñas)
              </Text>
              <View style={styles.verifiedPill}>
                <CheckCircleIcon
                  size={13}
                  color={COLORS.goldLight}
                  strokeWidth={2.2}
                />
                <Text style={styles.verifiedText}>Verificado</Text>
              </View>
            </View>
            <View style={styles.infoGrid}>
              <InfoItem
                Icon={MusicIcon}
                label={`${item.contracts} contrataciones`}
              />
              <InfoItem Icon={LocationIcon} label={item.zone} />
            </View>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.priceLabel}>Desde</Text>
                <Text style={styles.price}>${formatPrice(item.price)}</Text>
              </View>
              <View style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>Ver detalles</Text>
                <ChevronRightIcon
                  size={18}
                  color={COLORS.black}
                  strokeWidth={2.4}
                />
              </View>
            </View>
          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

function InfoItem({ Icon, label }: { Icon: Tab["Icon"]; label: string }) {
  return (
    <View style={styles.infoItem}>
      <Icon size={17} color={COLORS.gray} strokeWidth={2} />
      <Text numberOfLines={1} style={styles.infoText}>
        {label}
      </Text>
    </View>
  );
}

export default function MariachisScreen() {
  const params = useLocalSearchParams<{
    musicians?: string;
    category?: string;
  }>();
  const { width, height } = useWindowDimensions();
  const frameWidth = Math.min(
    width,
    Platform.OS === "web" ? MOBILE_WIDTH : width,
  );
  const cardWidth = Math.min(frameWidth * 0.78, frameWidth - SIDE_SPACING * 2);
  const cardHeight = Math.min(Math.max(height * 0.5, 400), 470);
  const itemSize = cardWidth + CARD_GAP;
  const [selectedMariachi, setSelectedMariachi] = useState<Mariachi | null>(
    null,
  );
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  const contextLine = [
    params.musicians ? `Para ${params.musicians} elementos` : null,
    params.category || null,
  ]
    .filter(Boolean)
    .join(" • ");
  const tabs: Tab[] = useMemo(
    () => [
      {
        label: "Inicio",
        Icon: HomeIcon,
        active: false,
        onPress: () => router.replace("/event-details"),
      },
      {
        label: "Favoritos",
        Icon: HeartIcon,
        active: false,
        onPress: () => router.push("/favorites"),
      },
      {
        label: "Mis eventos",
        Icon: CalendarIcon,
        active: false,
        onPress: () => router.push("/my-events"),
      },
      {
        label: "Perfil",
        Icon: UserIcon,
        active: false,
        onPress: () => router.push("/profile"),
      },
    ],
    [],
  );

  function requestBooking() {
    if (!selectedMariachi) return;
    setSelectedMariachi(null);
    router.push({
      pathname: "/booking",
      params: {
        mariachiId: selectedMariachi.id,
        musicians: params.musicians ?? "",
        category: params.category ?? "",
      },
    });
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.appFrame}>
          <Image
            source={backgroundImage}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <View style={styles.dimLayer} />
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.52)", "rgba(0,0,0,0.9)"]}
            locations={[0, 0.42, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.goldLineTop} />
          <View style={styles.goldLineBottom} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.headerSquare}
              >
                <MenuIcon size={26} color={COLORS.ivory} strokeWidth={2.1} />
              </TouchableOpacity>
              <Image
                source={logoImage}
                resizeMode="contain"
                style={styles.logo}
              />
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.headerSquare}
              >
                <BellIcon size={25} color={COLORS.ivory} strokeWidth={2.1} />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.title}>Mariachis disponibles</Text>
              <View style={styles.titleOrnament}>
                <View style={styles.ornamentLine} />
                <View style={styles.ornamentDiamond} />
              </View>
              <Text style={styles.subtitle}>
                Elige el grupo ideal para tu celebración
              </Text>
              {contextLine ? (
                <Text style={styles.contextLine}>{contextLine}</Text>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersRow}
            >
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  activeOpacity={0.82}
                  onPress={() => setActiveFilter(filter)}
                  style={[
                    styles.filterPill,
                    filter === activeFilter && styles.filterPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === activeFilter && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Animated.FlatList
              data={mariachis}
              horizontal
              snapToInterval={itemSize}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              onScroll={onScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{
                paddingHorizontal: Math.max(
                  SIDE_SPACING,
                  (frameWidth - cardWidth) / 2,
                ),
                paddingTop: 4,
                paddingBottom: 110,
              }}
              renderItem={({ item, index }) => (
                <MariachiCard
                  item={item}
                  index={index}
                  scrollX={scrollX}
                  itemSize={itemSize}
                  cardWidth={cardWidth}
                  cardHeight={cardHeight}
                  onPress={() => setSelectedMariachi(item)}
                />
              )}
            />
          </ScrollView>

          <BlurView intensity={34} tint="dark" style={styles.tabBar}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.label}
                activeOpacity={0.8}
                style={styles.tabItem}
                onPress={tab.onPress}
              >
                <tab.Icon
                  size={25}
                  color={tab.active ? COLORS.gold : COLORS.gray}
                  strokeWidth={2.2}
                />
                <Text
                  style={[styles.tabLabel, tab.active && styles.tabLabelActive]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </BlurView>

          <Modal
            visible={!!selectedMariachi}
            transparent
            animationType="fade"
            onRequestClose={() => setSelectedMariachi(null)}
          >
            <View style={styles.modalOverlay}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setSelectedMariachi(null)}
              />
              {selectedMariachi ? (
                <BlurView intensity={64} tint="dark" style={styles.modalCard}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.modalScroll}
                  >
                    <TouchableOpacity
                      activeOpacity={0.76}
                      onPress={() => setSelectedMariachi(null)}
                      style={styles.closeButton}
                    >
                      <XIcon size={22} color={COLORS.ivory} strokeWidth={2.2} />
                    </TouchableOpacity>
                    <View style={styles.modalImageWrapper}>
                      <Image
                        source={selectedMariachi.image}
                        resizeMode="contain"
                        style={styles.modalImage}
                      />
                      <LinearGradient
                        colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.22)"]}
                        style={styles.modalImageOverlay}
                        pointerEvents="none"
                      />
                    </View>
                    <Text style={styles.modalTitle}>
                      {selectedMariachi.alias}
                    </Text>
                    <View style={styles.modalStats}>
                      <Stat
                        Icon={StarIcon}
                        value={selectedMariachi.rating.toFixed(1)}
                        label={`${selectedMariachi.reviews} reseñas`}
                      />
                      <Stat
                        Icon={TicketIcon}
                        value={`${selectedMariachi.contracts}`}
                        label="contrataciones"
                      />
                      <Stat
                        Icon={LocationIcon}
                        value={selectedMariachi.zone}
                        label="zona"
                      />
                    </View>
                    <View style={styles.modalPriceBox}>
                      <Text style={styles.priceLabel}>Desde</Text>
                      <Text style={styles.modalPrice}>
                        ${formatPrice(selectedMariachi.price)}
                      </Text>
                      <View style={styles.modalVerifiedRow}>
                        <ShieldIcon
                          size={16}
                          color={COLORS.goldLight}
                          strokeWidth={2}
                        />
                        <Text style={styles.verifiedText}>
                          Grupo verificado por ¡Ay! Mariachi
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.commentsTitle}>
                      Comentarios recientes
                    </Text>
                    {selectedMariachi.comments.map((comment) => (
                      <View key={comment} style={styles.commentCard}>
                        <Text style={styles.commentText}>{comment}</Text>
                      </View>
                    ))}
                    <TouchableOpacity
                      activeOpacity={0.86}
                      onPress={requestBooking}
                      style={styles.contractButton}
                    >
                      <UsersIcon
                        size={20}
                        color={COLORS.black}
                        strokeWidth={2.4}
                      />
                      <Text style={styles.contractButtonText}>
                        Solicitar contratación
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </BlurView>
              ) : null}
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Stat({
  Icon,
  value,
  label,
}: {
  Icon: Tab["Icon"];
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Icon size={18} color={COLORS.goldLight} strokeWidth={2} />
      <Text numberOfLines={1} style={styles.statValue}>
        {value}
      </Text>
      <Text numberOfLines={1} style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000" },
  safeArea: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#000",
  },
  appFrame: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%",
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
  dimLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.34)",
  },
  goldLineTop: {
    position: "absolute",
    top: 92,
    left: 18,
    right: 18,
    height: 1,
    backgroundColor: "rgba(216,183,106,0.2)",
  },
  goldLineBottom: {
    position: "absolute",
    bottom: 87,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(216,183,106,0.18)",
  },
  scrollContent: { paddingTop: 6, paddingBottom: 0 },
  header: {
    height: 62,
    marginHorizontal: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSquare: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(18,18,18,0.58)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  logo: { position: "absolute", left: 122, right: 122, top: 0, height: 60 },
  notificationBadge: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.goldLight,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  heroCopy: { marginHorizontal: 19, marginTop: 4, marginBottom: 4 },
  title: {
    color: COLORS.ivory,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "900",
    letterSpacing: -1.1,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      web: "Georgia",
    }),
  },
  titleOrnament: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ornamentLine: {
    width: 32,
    height: 2,
    borderRadius: 2,
    backgroundColor: COLORS.goldLight,
  },
  ornamentDiamond: {
    width: 9,
    height: 9,
    borderWidth: 2,
    borderColor: COLORS.goldLight,
    transform: [{ rotate: "45deg" }],
  },
  subtitle: {
    marginTop: 8,
    color: "rgba(247,243,235,0.74)",
    fontSize: 15.5,
    lineHeight: 20,
    fontWeight: "700",
  },
  contextLine: {
    marginTop: 4,
    color: COLORS.goldLight,
    fontSize: 13.5,
    fontWeight: "900",
  },
  filtersRow: {
    paddingHorizontal: 19,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  filterPill: {
    height: 44,
    borderRadius: 24,
    paddingHorizontal: 18,
    justifyContent: "center",
    backgroundColor: "rgba(18,18,18,0.58)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  filterPillActive: {
    backgroundColor: "rgba(216,183,106,0.14)",
    borderColor: COLORS.gold,
  },
  filterText: { color: COLORS.gray, fontSize: 14, fontWeight: "700" },
  filterTextActive: { color: COLORS.goldLight },
  cardContainer: { alignItems: "center" },
  cardPressable: { borderRadius: 30 },
  pressed: { transform: [{ scale: 0.985 }] },
  card: {
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "rgba(18,18,18,0.7)",
    borderWidth: 1,
    borderColor: "rgba(216,183,106,0.28)",
    shadowColor: COLORS.gold,
    shadowOpacity: 0.2,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 9,
  },
  activeGlow: {
    position: "absolute",
    left: 26,
    right: 26,
    top: -10,
    height: 2,
    backgroundColor: "rgba(216,183,106,0.75)",
    shadowColor: COLORS.goldLight,
    shadowOpacity: 0.65,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    zIndex: 3,
  },
  imageWrapper: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: "100%" },
  imageOverlay: { ...StyleSheet.absoluteFillObject },
  imageBadge: {
    position: "absolute",
    left: 12,
    bottom: 12,
    minHeight: 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(18,18,18,0.76)",
    borderWidth: 1,
    borderColor: "rgba(216,183,106,0.38)",
  },
  imageBadgeText: {
    color: COLORS.goldLight,
    fontSize: 12.5,
    fontWeight: "900",
  },
  cardBody: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 16 },
  cardTitle: {
    color: COLORS.ivory,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "900",
    letterSpacing: -0.4,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      web: "Georgia",
    }),
  },
  ratingLine: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  ratingText: {
    color: "rgba(247,243,235,0.78)",
    fontSize: 14,
    fontWeight: "800",
  },
  verifiedPill: {
    borderRadius: 13,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(216,183,106,0.09)",
    borderWidth: 1,
    borderColor: "rgba(216,183,106,0.4)",
  },
  verifiedText: { color: COLORS.goldLight, fontSize: 12.5, fontWeight: "900" },
  infoGrid: { marginTop: 7, gap: 6 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 7 },
  infoText: {
    flex: 1,
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
  cardFooter: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(200,155,60,0.22)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  priceLabel: {
    color: "rgba(247,243,235,0.62)",
    fontSize: 12.5,
    fontWeight: "800",
  },
  price: {
    color: COLORS.goldLight,
    fontSize: 22,
    lineHeight: 25,
    fontWeight: "900",
    letterSpacing: -0.4,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      web: "Georgia",
    }),
  },
  detailsButton: {
    height: 46,
    borderRadius: 24,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.goldLight,
  },
  detailsButtonText: { color: COLORS.black, fontSize: 14, fontWeight: "800" },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    overflow: "hidden",
    paddingTop: 11,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(18,18,18,0.86)",
    borderTopWidth: 1,
    borderTopColor: "rgba(216,183,106,0.2)",
  },
  tabItem: { minWidth: 74, alignItems: "center", gap: 5 },
  tabLabel: { color: COLORS.gray, fontSize: 11.5, fontWeight: "800" },
  tabLabelActive: { color: COLORS.gold },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  modalCard: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 398 : Dimensions.get("window").width - 28,
    maxHeight: "88%",
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "rgba(18,18,18,0.82)",
    borderWidth: 1,
    borderColor: "rgba(216,183,106,0.32)",
  },
  modalScroll: { padding: 16, paddingBottom: 20 },
  closeButton: {
    position: "absolute",
    right: 28,
    top: 28,
    zIndex: 4,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(18,18,18,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  modalImageWrapper: {
    width: "100%",
    height: 240,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: { width: "100%", height: "100%" },
  modalImageOverlay: { ...StyleSheet.absoluteFillObject },
  modalTitle: {
    marginTop: 17,
    color: COLORS.ivory,
    fontSize: 28,
    lineHeight: 33,
    fontWeight: "900",
    letterSpacing: -0.5,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      web: "Georgia",
    }),
  },
  modalStats: { marginTop: 14, flexDirection: "row", gap: 8 },
  statCard: {
    flex: 1,
    minHeight: 78,
    borderRadius: 18,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  statValue: {
    marginTop: 7,
    color: COLORS.ivory,
    fontSize: 14,
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 2,
    color: "rgba(247,243,235,0.6)",
    fontSize: 11.5,
    fontWeight: "800",
  },
  modalPriceBox: {
    marginTop: 12,
    borderRadius: 22,
    padding: 15,
    backgroundColor: "rgba(216,183,106,0.08)",
    borderWidth: 1,
    borderColor: "rgba(216,183,106,0.26)",
  },
  modalPrice: {
    color: COLORS.goldLight,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "900",
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      web: "Georgia",
    }),
  },
  modalVerifiedRow: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  commentsTitle: {
    marginTop: 16,
    marginBottom: 9,
    color: COLORS.ivory,
    fontSize: 17,
    fontWeight: "900",
  },
  commentCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.11)",
  },
  commentText: {
    color: "rgba(247,243,235,0.78)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  contractButton: {
    minHeight: 56,
    borderRadius: 20,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
    backgroundColor: COLORS.goldLight,
  },
  contractButtonText: { color: COLORS.black, fontSize: 16, fontWeight: "900" },
});
