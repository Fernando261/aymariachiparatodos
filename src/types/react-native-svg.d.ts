declare module "react-native-svg" {
  import * as React from "react";
  import { ViewStyle } from "react-native";

  type SvgCommonProps = {
    children?: React.ReactNode;
    color?: string;
    fill?: string;
    height?: number | string;
    opacity?: number;
    stroke?: string;
    strokeLinecap?: "butt" | "round" | "square";
    strokeLinejoin?: "miter" | "round" | "bevel";
    strokeWidth?: number | string;
    style?: ViewStyle;
    transform?: string;
    viewBox?: string;
    width?: number | string;
  };

  type ShapeProps = SvgCommonProps & Record<string, unknown>;

  const Svg: React.FC<SvgCommonProps>;
  export const Path: React.FC<ShapeProps>;
  export const Circle: React.FC<ShapeProps>;
  export const Line: React.FC<ShapeProps>;
  export const Rect: React.FC<ShapeProps>;
  export const Polyline: React.FC<ShapeProps>;
  export default Svg;
}
