declare module "lucide-react-native" {
  import type { ComponentType } from "react";
  import type { StyleProp, ViewStyle } from "react-native";

  export type LucideIconProps = {
    size?: number;
    color?: string;
    strokeWidth?: number;
    style?: StyleProp<ViewStyle>;
  };

  export type LucideIcon = ComponentType<LucideIconProps>;

  export const ArrowLeft: LucideIcon;
  export const Bell: LucideIcon;
  export const Building2: LucideIcon;
  export const Cake: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Crown: LucideIcon;
  export const Gift: LucideIcon;
  export const Heart: LucideIcon;
  export const Home: LucideIcon;
  export const Menu: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Music: LucideIcon;
  export const Sparkles: LucideIcon;
  export const User: LucideIcon;
  export const Users: LucideIcon;
}
