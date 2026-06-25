import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Modal,
TouchableOpacity,
} from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { COLORS } from "@/constants/colors";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.75;
const SPACING = 20;
const ITEM_SIZE = CARD_WIDTH + SPACING;

const mariachis = [
  {
    id: "1",
    image: require("@/assets/images/mariachis/mariachi1.png"),
    rating: 4.9,
    reviews: 182,
    contracts: 534,
    zone: "Guadalajara y Zapopan",
    price: 2500,
  },
  {
    id: "2",
    image: require("@/assets/images/mariachis/mariachi2.png"),
    rating: 4.8,
    reviews: 145,
    contracts: 421,
    zone: "Tlaquepaque",
    price: 2200,
  },
  {
    id: "3",
    image: require("@/assets/images/mariachis/mariachi3.png"),
    rating: 5.0,
    reviews: 256,
    contracts: 701,
    zone: "Zapopan",
    price: 3000,
  },
  {
    id: "4",
    image: require("@/assets/images/mariachis/mariachi4.png"),
    rating: 4.7,
    reviews: 97,
    contracts: 280,
    zone: "Guadalajara Centro",
    price: 2100,
  },
  {
    id: "5",
    image: require("@/assets/images/mariachis/mariachi5.png"),
    rating: 4.9,
    reviews: 198,
    contracts: 612,
    zone: "Zona Metropolitana",
    price: 2800,
  },
];

function MariachiCard({
  item,
  index,
  scrollX,
}: any) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
      (index + 1) * ITEM_SIZE,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.82, 1, 0.82],
      Extrapolation.CLAMP
    );

    const rotateY = interpolate(
      scrollX.value,
      inputRange,
      [20, 0, -20],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.55, 1, 0.55],
      Extrapolation.CLAMP
    );

    return {
  transform: [
    { perspective: 1000 },
    { rotateY: `${rotateY}deg` },
    { scale },
  ],

  opacity,

  zIndex: scale * 100,
};
  });

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <View style={styles.glow} />
      <BlurView
        intensity={35}
        tint="dark"
        style={styles.card}
      >
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.info}>
          <Text style={styles.rating}>
            ⭐ {item.rating} ({item.reviews})
          </Text>

          <Text style={styles.verified}>
            ✓ Verificado
          </Text>

          <Text style={styles.detail}>
            🎺 {item.contracts} contrataciones
          </Text>

          <Text style={styles.detail}>
            📍 {item.zone}
          </Text>

          <Text style={styles.price}>
            💰 Desde ${item.price.toLocaleString()}
          </Text>
        </View>
      </BlurView>
    </Animated.View>
  );
}

export default function MariachisScreen() {

  const [selectedMariachi, setSelectedMariachi] = useState<any>(null);
const [modalVisible, setModalVisible] = useState(false);
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <LinearGradient
      colors={["#121212", "#1A1A1A", "#232323"]}
      style={styles.container}
    >
      <View style={styles.backgroundGlowTop} />
<View style={styles.backgroundGlowBottom} />
      <Text style={styles.title}>
        Mariachis Disponibles
      </Text>

      <Text style={styles.subtitle}>
        Desliza para descubrir
      </Text>

      <Animated.FlatList
        data={mariachis}
        horizontal
        pagingEnabled={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal:
            (width - CARD_WIDTH) / 2,
        }}
        renderItem={({ item, index }) => (
  <TouchableOpacity
    activeOpacity={0.95}
    onPress={() => {
      setSelectedMariachi(item);
      setModalVisible(true);
    }}
  >
    <MariachiCard
      item={item}
      index={index}
      scrollX={scrollX}
    />
  </TouchableOpacity>
)}
      />

<Modal
  visible={modalVisible}
  transparent
  animationType="fade"
>
  <View style={styles.modalOverlay}>
    <BlurView
      intensity={60}
      tint="dark"
      style={styles.modalCard}
    >
      {selectedMariachi && (
        <>
          <Image
            source={selectedMariachi.image}
            style={styles.modalImage}
            resizeMode="contain"
          />

          <Text style={styles.modalRating}>
            ⭐ {selectedMariachi.rating}
          </Text>

          <Text style={styles.modalVerified}>
            ✓ Verificado
          </Text>

          <Text style={styles.modalDetail}>
            🎺 {selectedMariachi.contracts} contrataciones
          </Text>

          <Text style={styles.modalDetail}>
            📍 {selectedMariachi.zone}
          </Text>

          <Text style={styles.modalPrice}>
            💰 Desde $
            {selectedMariachi.price.toLocaleString()}
          </Text>

          <TouchableOpacity
            style={styles.contractButton}
          >
            <Text style={styles.contractButtonText}>
              Contratar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setModalVisible(false)
            }
          >
            <Text style={styles.closeText}>
              Cerrar
            </Text>
          </TouchableOpacity>
        </>
      )}
    </BlurView>
  </View>
</Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

glow: {
  position: "absolute",
  width: 220,
  height: 220,
  borderRadius: 999,
  backgroundColor: COLORS.gold,
  opacity: 0.18,
},

backgroundGlowTop: {
  position: "absolute",
  top: -120,
  left: -80,
  width: 300,
  height: 300,
  borderRadius: 999,
  backgroundColor: COLORS.gold,
  opacity: 0.12,
},

backgroundGlowBottom: {
  position: "absolute",
  bottom: -100,
  right: -80,
  width: 280,
  height: 280,
  borderRadius: 999,
  backgroundColor: COLORS.terracotta,
  opacity: 0.15,
},

  container: {
    flex: 1,
    paddingTop: 60,
  },

  title: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    color: COLORS.gold,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
  },

  cardContainer: {
    width: ITEM_SIZE,
    alignItems: "center",
  },

  card: {
    width: CARD_WIDTH,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glass,
  },

  image: {
    width: "100%",
    height: 320,
    backgroundColor: "#181818",
  },

  info: {
    padding: 20,
  },

  rating: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  verified: {
    color: COLORS.gold,
    marginTop: 8,
    fontWeight: "700",
  },

  detail: {
    color: COLORS.white,
    marginTop: 10,
  },

  price: {
    color: COLORS.gold,
    marginTop: 12,
    fontSize: 18,
    fontWeight: "800",
  },
modalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.6)",
},

modalCard: {
  width: width * 0.9,
  borderRadius: 30,
  padding: 20,
  overflow: "hidden",
  borderWidth: 1,
  borderColor: COLORS.glassBorder,
},

modalImage: {
  width: "100%",
  height: 280,
},

modalRating: {
  color: COLORS.white,
  fontSize: 20,
  fontWeight: "700",
  marginTop: 15,
},

modalVerified: {
  color: COLORS.gold,
  fontWeight: "700",
  marginTop: 8,
},

modalDetail: {
  color: COLORS.white,
  marginTop: 10,
  fontSize: 16,
},

modalPrice: {
  color: COLORS.gold,
  fontSize: 22,
  fontWeight: "800",
  marginTop: 15,
},

contractButton: {
  height: 55,
  borderRadius: 18,
  backgroundColor: COLORS.gold,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 25,
},

contractButtonText: {
  color: COLORS.black,
  fontWeight: "800",
  fontSize: 16,
},

closeText: {
  color: COLORS.white,
  textAlign: "center",
  marginTop: 20,
}


});