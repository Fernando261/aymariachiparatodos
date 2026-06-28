declare module "@expo/vector-icons" {
  import type { ComponentType } from "react";

  type IconProps = {
    name: string;
    size?: number;
    color?: string;
    style?: unknown;
  };

  export const Ionicons: ComponentType<IconProps>;
  export const MaterialCommunityIcons: ComponentType<IconProps>;
  export const FontAwesome5: ComponentType<IconProps>;
}
