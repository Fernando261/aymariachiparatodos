import React, { useMemo, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BellIcon,
  CalendarIcon,
  CardIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CrownIcon,
  EditIcon,
  HeartIcon,
  HelpIcon,
  HomeIcon,
  LocationIcon,
  MenuIcon,
  MoonIcon,
  ShieldIcon,
  TicketIcon,
  UserIcon,
} from "@/components/AppIcons";
import { COLORS } from "@/constants/colors";

const MOBILE_WIDTH = 430;
const backgroundImage = require("@/assets/images/mariachis/mariachibg.png");
const logoImage = require("@/assets/images/logo-glow.png");
const avatarImage = require("@/assets/images/mariachis/mariachi1.png");

type IconComponent = (props: { size?: number; color?: string; strokeWidth?: number }) => React.ReactElement;
type Tab = { label: string; Icon: IconComponent; active: boolean; onPress: () => void };
type OptionItem = { label: string; Icon: IconComponent };

const options: OptionItem[] = [
  { label: "Datos personales", Icon: UserIcon },
  { label: "Métodos de pago", Icon: CardIcon },
  { label: "Direcciones guardadas", Icon: LocationIcon },
  { label: "Notificaciones", Icon: BellIcon },
  { label: "Ayuda y soporte", Icon: HelpIcon },
];

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(true);

  const tabs: Tab[] = useMemo(
    () => [
      { label: "Inicio", Icon: HomeIcon, active: false, onPress: () => router.replace("/event-details") },
      { label: "Favoritos", Icon: HeartIcon, active: false, onPress: () => router.push("/favorites") },
      { label: "Mis eventos", Icon: CalendarIcon, active: false, onPress: () => router.push("/my-events") },
      { label: "Perfil", Icon: UserIcon, active: true, onPress: () => router.replace("/profile") },
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
              <Text style={styles.title}>Perfil</Text>
              <View style={styles.titleOrnament}>
                <View style={styles.ornamentLine} />
                <View style={styles.ornamentDiamond} />
              </View>
              <Text style={styles.subtitle}>Tu cuenta y preferencias</Text>
            </View>

            <BlurView intensity={30} tint="dark" style={styles.userCard}>
              <View style={styles.userTopRow}>
                <View style={styles.avatarWrap}>
                  <Image source={avatarImage} resizeMode="cover" style={styles.avatar} />
                  <View style={styles.avatarBadge}><ShieldIcon size={22} color={COLORS.black} strokeWidth={2.4} /></View>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Alex Fernando</Text>
                  <View style={styles.verifiedRow}>
                    <CheckCircleIcon size={18} color={COLORS.goldLight} strokeWidth={2.6} />
                    <Text style={styles.verifiedText}>Cliente verificado</Text>
                  </View>
                  <View style={styles.levelBadge}>
                    <CrownIcon size={19} color={COLORS.goldLight} strokeWidth={2.2} />
                    <Text style={styles.levelText}>Nivel Oro</Text>
                  </View>
                </View>
              </View>

              <View style={styles.statsRow}>
                <StatCard Icon={TicketIcon} value="4" label="eventos" />
                <View style={styles.statDivider} />
                <StatCard Icon={HeartIcon} value="3" label="favoritos" />
              </View>
            </BlurView>

            <BlurView intensity={28} tint="dark" style={styles.optionsCard}>
              {options.map((item, index) => <OptionRow key={item.label} item={item} showDivider={index < options.length - 1} />)}
            </BlurView>

            <BlurView intensity={28} tint="dark" style={styles.preferencesCard}>
              <Text style={styles.sectionTitle}>Preferencias</Text>
              <TouchableOpacity activeOpacity={0.82} style={styles.preferenceRow} onPress={() => setDarkMode((value) => !value)}>
                <MoonIcon size={28} color={COLORS.goldLight} strokeWidth={2} />
                <Text style={styles.rowText}>Tema oscuro</Text>
                <View style={[styles.switchTrack, darkMode && styles.switchTrackActive]}>
                  <View style={[styles.switchThumb, darkMode && styles.switchThumbActive]} />
                </View>
              </TouchableOpacity>
              <PreferenceDivider />
              <TouchableOpacity activeOpacity={0.82} style={styles.preferenceRow}>
                <CalendarIcon size={28} color={COLORS.goldLight} strokeWidth={2} />
                <Text style={styles.rowText}>Recordatorios de eventos</Text>
                <ChevronRightIcon size={25} color={COLORS.gray} strokeWidth={2.2} />
              </TouchableOpacity>
              <PreferenceDivider />
              <TouchableOpacity activeOpacity={0.82} style={styles.preferenceRow}>
                <LocationIcon size={28} color={COLORS.goldLight} strokeWidth={2} />
                <Text style={styles.rowText}>Ciudad preferida: <Text style={styles.goldText}>Guadalajara</Text></Text>
                <ChevronRightIcon size={25} color={COLORS.gray} strokeWidth={2.2} />
              </TouchableOpacity>
            </BlurView>

            <TouchableOpacity activeOpacity={0.88} style={styles.editButton} onPress={() => router.push("/edit-profile")}>
              <LinearGradient colors={["#E1A83A", COLORS.gold, "#B77A22"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.editButtonGradient}>
                <EditIcon size={23} color={COLORS.black} strokeWidth={2.5} />
                <Text style={styles.editButtonText}>Editar perfil</Text>
              </LinearGradient>
            </TouchableOpacity>
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

function StatCard({ Icon, value, label }: { Icon: IconComponent; value: string; label: string }) {
  return <View style={styles.statCard}><Icon size={30} color={COLORS.goldLight} strokeWidth={2.1} /><View><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View></View>;
}

function OptionRow({ item, showDivider }: { item: OptionItem; showDivider: boolean }) {
  return <TouchableOpacity activeOpacity={0.82} style={[styles.optionRow, showDivider && styles.rowDivider]}><item.Icon size={29} color={COLORS.goldLight} strokeWidth={2} /><Text style={styles.rowText}>{item.label}</Text><ChevronRightIcon size={25} color={COLORS.gray} strokeWidth={2.2} /></TouchableOpacity>;
}

function PreferenceDivider() {
  return <View style={styles.preferenceDivider} />;
}

const serifFont = Platform.select({ ios: "Georgia", android: "serif", web: "Georgia" });

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", backgroundColor: "#000000" },
  safeArea: { flex: 1, width: "100%", alignItems: "center", backgroundColor: "#000000" },
  appFrame: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? MOBILE_WIDTH : "100%", overflow: "hidden", backgroundColor: COLORS.black, ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.42, shadowRadius: 40 }, default: {} }) },
  dimLayer: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.36)" },
  goldLineTop: { position: "absolute", top: 92, left: 18, right: 18, height: 1, backgroundColor: "rgba(216,183,106,0.2)" },
  goldLineBottom: { position: "absolute", bottom: 87, left: 28, right: 28, height: 1, backgroundColor: "rgba(216,183,106,0.18)" },
  scrollContent: { paddingHorizontal: 19, paddingTop: 12, paddingBottom: 130 },
  header: { height: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerSquare: { width: 54, height: 54, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(18,18,18,0.58)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  logo: { position: "absolute", left: 116, right: 116, top: 1, height: 70 },
  notificationBadge: { position: "absolute", top: 7, right: 8, width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.goldLight, borderWidth: 1, borderColor: COLORS.black },
  heroCopy: { marginTop: 12, marginBottom: 22 },
  title: { color: COLORS.ivory, fontSize: 48, lineHeight: 56, fontWeight: "900", letterSpacing: -1.1, fontFamily: serifFont },
  titleOrnament: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 12 },
  ornamentLine: { width: 32, height: 2, borderRadius: 2, backgroundColor: COLORS.goldLight },
  ornamentDiamond: { width: 9, height: 9, borderWidth: 2, borderColor: COLORS.goldLight, transform: [{ rotate: "45deg" }] },
  subtitle: { marginTop: 15, color: "rgba(247,243,235,0.72)", fontSize: 17, lineHeight: 23, fontWeight: "700" },
  userCard: { borderRadius: 24, overflow: "hidden", padding: 16, marginBottom: 16, backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", ...Platform.select({ web: { shadowColor: "#000", shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.3, shadowRadius: 24 }, default: { elevation: 7 } }) },
  userTopRow: { flexDirection: "row", alignItems: "center", gap: 17 },
  avatarWrap: { width: 120, height: 120 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 1.5, borderColor: "rgba(216,183,106,0.46)" },
  avatarBadge: { position: "absolute", right: 0, bottom: 5, width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.goldLight, borderWidth: 2, borderColor: COLORS.black },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { color: COLORS.ivory, fontSize: 29, lineHeight: 34, fontWeight: "900", letterSpacing: -0.8, fontFamily: serifFont },
  verifiedRow: { marginTop: 9, flexDirection: "row", alignItems: "center", gap: 8 },
  verifiedText: { color: "rgba(247,243,235,0.73)", fontSize: 16, fontWeight: "700" },
  levelBadge: { marginTop: 12, alignSelf: "flex-start", height: 36, borderRadius: 18, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: "rgba(216,183,106,0.72)", backgroundColor: "rgba(18,18,18,0.62)" },
  levelText: { color: COLORS.goldLight, fontSize: 15, fontWeight: "900" },
  statsRow: { marginTop: 18, flexDirection: "row", alignItems: "center", gap: 9 },
  statCard: { flex: 1, minHeight: 64, borderRadius: 20, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  statDivider: { width: 1, height: 34, backgroundColor: "rgba(255,255,255,0.16)" },
  statValue: { color: COLORS.ivory, fontSize: 20, lineHeight: 23, fontWeight: "900" },
  statLabel: { color: "rgba(247,243,235,0.72)", fontSize: 13.5, fontWeight: "700" },
  optionsCard: { borderRadius: 24, overflow: "hidden", paddingHorizontal: 10, marginBottom: 14, backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" },
  optionRow: { minHeight: 68, flexDirection: "row", alignItems: "center", gap: 18, paddingHorizontal: 12 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
  rowText: { flex: 1, color: COLORS.ivory, fontSize: 17, lineHeight: 23, fontWeight: "700" },
  preferencesCard: { borderRadius: 24, overflow: "hidden", paddingHorizontal: 10, paddingTop: 18, marginBottom: 20, backgroundColor: "rgba(18,18,18,0.72)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" },
  sectionTitle: { paddingHorizontal: 10, marginBottom: 4, color: COLORS.ivory, fontSize: 23, lineHeight: 28, fontWeight: "900", fontFamily: serifFont },
  preferenceRow: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: 18, paddingHorizontal: 12 },
  preferenceDivider: { height: 1, marginLeft: 58, backgroundColor: "rgba(255,255,255,0.1)" },
  goldText: { color: COLORS.goldLight },
  switchTrack: { width: 62, height: 34, borderRadius: 17, padding: 3, alignItems: "flex-start", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.14)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  switchTrackActive: { alignItems: "flex-end", backgroundColor: COLORS.gold, borderColor: COLORS.goldLight },
  switchThumb: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.ivory },
  switchThumbActive: { backgroundColor: COLORS.white },
  editButton: { height: 64, borderRadius: 20, overflow: "hidden", marginBottom: 6, ...Platform.select({ web: { shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.28, shadowRadius: 20 }, default: { elevation: 7 } }) },
  editButtonGradient: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 13 },
  editButtonText: { color: COLORS.black, fontSize: 18, fontWeight: "900" },
  tabBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 80, overflow: "hidden", paddingTop: 11, paddingHorizontal: 12, flexDirection: "row", justifyContent: "space-between", backgroundColor: "rgba(18,18,18,0.86)", borderTopWidth: 1, borderTopColor: "rgba(216,183,106,0.2)" },
  tabItem: { minWidth: 74, alignItems: "center", gap: 5 },
  tabLabel: { color: COLORS.gray, fontSize: 11.5, fontWeight: "800" },
  tabLabelActive: { color: COLORS.gold },
  tabIndicator: { width: 24, height: 2, borderRadius: 2, backgroundColor: COLORS.gold, marginTop: 1 },
});
