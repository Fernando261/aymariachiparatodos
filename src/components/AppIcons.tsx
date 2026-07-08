import React from "react";
import Svg, { Path, Circle, Line, Rect, Polyline } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const defaultProps = { size: 24, color: "#D8B76A", strokeWidth: 2 };

function iconProps({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return { width: size, height: size, viewBox: "0 0 24 24" as const, fill: "none" as const, stroke: color, strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
}

export function MenuIcon(props: IconProps) {
  const svg = iconProps(props);
  return <Svg {...svg}><Line x1="4" y1="7" x2="20" y2="7" /><Line x1="4" y1="12" x2="20" y2="12" /><Line x1="4" y1="17" x2="20" y2="17" /></Svg>;
}

export function BellIcon(props: IconProps) {
  const svg = iconProps(props);
  return <Svg {...svg}><Path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><Path d="M10 21h4" /></Svg>;
}

export function UsersIcon(props: IconProps) {
  const svg = iconProps(props);
  return <Svg {...svg}><Circle cx="9" cy="8" r="3.2" /><Path d="M3.5 19c.7-3.3 2.6-5 5.5-5s4.8 1.7 5.5 5" /><Path d="M16 11.2a3 3 0 1 0-1-5.8" /><Path d="M16.5 14.2c2.2.5 3.6 2.1 4 4.8" /></Svg>;
}

export function CakeIcon(props: IconProps) {
  const svg = iconProps(props);
  return <Svg {...svg}><Path d="M4 11h16v9H4z" /><Path d="M4 15c2 1.2 4 1.2 6 0s4-1.2 6 0 3.2 1 4 0" /><Line x1="8" y1="11" x2="8" y2="7" /><Line x1="12" y1="11" x2="12" y2="6" /><Line x1="16" y1="11" x2="16" y2="7" /><Path d="M8 5.5l1-1.3 1 1.3" /><Path d="M12 4.5l1-1.3 1 1.3" /><Path d="M16 5.5l1-1.3 1 1.3" /></Svg>;
}

export function MusicIcon(props: IconProps) {
  const svg = iconProps(props);
  return <Svg {...svg}><Path d="M9 18V5l10-2v13" /><Circle cx="6" cy="18" r="3" /><Circle cx="16" cy="16" r="3" /></Svg>;
}

export function HeartIcon(props: IconProps) {
  const svg = iconProps(props);
  return <Svg {...svg}><Path d="M20.5 8.5c0 5-8.5 10.5-8.5 10.5S3.5 13.5 3.5 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8.5 2.5Z" /></Svg>;
}

export function CrownIcon(props: IconProps) {
  const svg = iconProps(props);
  return <Svg {...svg}><Path d="M4 18h16" /><Path d="M5 16l1-9 4 4 2-6 2 6 4-4 1 9H5Z" /></Svg>;
}

export function BuildingIcon(props: IconProps) {
  const svg = iconProps(props);
  return <Svg {...svg}><Rect x="5" y="4" width="14" height="16" rx="2" /><Line x1="9" y1="8" x2="9" y2="8.1" /><Line x1="15" y1="8" x2="15" y2="8.1" /><Line x1="9" y1="12" x2="9" y2="12.1" /><Line x1="15" y1="12" x2="15" y2="12.1" /><Path d="M10 20v-4h4v4" /></Svg>;
}

export function MoreIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Circle cx="5" cy="12" r="1.4" /><Circle cx="12" cy="12" r="1.4" /><Circle cx="19" cy="12" r="1.4" /></Svg>; }
export function HomeIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Path d="M3.5 11.5 12 4l8.5 7.5" /><Path d="M6 10.5V20h12v-9.5" /><Path d="M10 20v-5h4v5" /></Svg>; }
export function CalendarIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Rect x="4" y="5" width="16" height="15" rx="2" /><Line x1="8" y1="3" x2="8" y2="7" /><Line x1="16" y1="3" x2="16" y2="7" /><Line x1="4" y1="10" x2="20" y2="10" /></Svg>; }

export function ClockIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Circle cx="12" cy="12" r="9" /><Path d="M12 7v5l3.2 2" /></Svg>; }
export function CheckCircleIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Circle cx="12" cy="12" r="9" /><Path d="m8.5 12.2 2.3 2.3 4.9-5" /></Svg>; }
export function AlertCircleIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Circle cx="12" cy="12" r="9" /><Line x1="12" y1="7" x2="12" y2="12.5" /><Line x1="12" y1="16.5" x2="12" y2="16.6" /></Svg>; }
export function CalendarDaysIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Rect x="4" y="5" width="16" height="15" rx="2" /><Line x1="8" y1="3" x2="8" y2="7" /><Line x1="16" y1="3" x2="16" y2="7" /><Line x1="4" y1="10" x2="20" y2="10" /><Line x1="8" y1="14" x2="8.1" y2="14" /><Line x1="12" y1="14" x2="12.1" y2="14" /><Line x1="16" y1="14" x2="16.1" y2="14" /><Line x1="8" y1="17" x2="8.1" y2="17" /><Line x1="12" y1="17" x2="12.1" y2="17" /></Svg>; }
export function UserIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Circle cx="12" cy="8" r="4" /><Path d="M4.5 20c1-4 3.5-6 7.5-6s6.5 2 7.5 6" /></Svg>; }
export function GiftIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Rect x="4" y="9" width="16" height="11" rx="2" /><Path d="M12 9v11" /><Path d="M4 13h16" /><Path d="M12 9c-3 0-5-1.2-5-3a2 2 0 0 1 3.5-1.3C11.5 5.8 12 9 12 9Z" /><Path d="M12 9c3 0 5-1.2 5-3a2 2 0 0 0-3.5-1.3C12.5 5.8 12 9 12 9Z" /></Svg>; }
export function ChevronRightIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Polyline points="9 5 16 12 9 19" /></Svg>; }
export function SparklesIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Path d="M12 3l1.4 4.2L18 9l-4.6 1.8L12 15l-1.4-4.2L6 9l4.6-1.8L12 3Z" /><Path d="M5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" /><Path d="M19 14l.7 1.8 1.8.7-1.8.7L19 19l-.7-1.8-1.8-.7 1.8-.7L19 14Z" /></Svg>; }
export function SearchIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Circle cx="11" cy="11" r="6" /><Line x1="16" y1="16" x2="21" y2="21" /></Svg>; }
export function XIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Line x1="6" y1="6" x2="18" y2="18" /><Line x1="18" y1="6" x2="6" y2="18" /></Svg>; }
export function EyeIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><Circle cx="12" cy="12" r="3" /></Svg>; }
export function EyeOffIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Path d="M3 3l18 18" /><Path d="M10.6 6.2A9.7 9.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.3 2.9" /><Path d="M14 14.2A3 3 0 0 1 9.8 10" /><Path d="M6.7 6.8C4 8.6 2.5 12 2.5 12S6 18 12 18c1.2 0 2.3-.2 3.3-.6" /></Svg>; }

export function LocationIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Path d="M12 21s7-5.6 7-12a7 7 0 0 0-14 0c0 6.4 7 12 7 12Z" /><Circle cx="12" cy="9" r="2.4" /></Svg>; }
export function SlidersIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Line x1="4" y1="6" x2="14" y2="6" /><Line x1="18" y1="6" x2="20" y2="6" /><Circle cx="16" cy="6" r="2" /><Line x1="4" y1="12" x2="8" y2="12" /><Line x1="12" y1="12" x2="20" y2="12" /><Circle cx="10" cy="12" r="2" /><Line x1="4" y1="18" x2="13" y2="18" /><Line x1="17" y1="18" x2="20" y2="18" /><Circle cx="15" cy="18" r="2" /></Svg>; }
export function StarIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></Svg>; }
export function ShieldIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Path d="M12 22s8-3.8 8-10V5l-8-3-8 3v7c0 6.2 8 10 8 10Z" /><Path d="m9 12 2 2 4-5" /></Svg>; }

export function CardIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Rect x="3.5" y="5.5" width="17" height="13" rx="2.2" /><Line x1="3.5" y1="10" x2="20.5" y2="10" /><Line x1="7" y1="15" x2="10" y2="15" /><Line x1="14" y1="15" x2="17" y2="15" /></Svg>; }
export function HelpIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Circle cx="12" cy="12" r="9" /><Path d="M9.5 9.2a2.7 2.7 0 0 1 5.1 1.3c0 2-2.6 2.2-2.6 4" /><Line x1="12" y1="17.5" x2="12" y2="17.6" /></Svg>; }
export function MoonIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Path d="M20 15.3A8.2 8.2 0 0 1 8.7 4a7.7 7.7 0 1 0 11.3 11.3Z" /></Svg>; }
export function EditIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Path d="M12 20h9" /><Path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" /></Svg>; }
export function TicketIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Path d="M4 9.5 9.5 4l10.5 10.5-5.5 5.5a2.3 2.3 0 0 1-3.2 0L4 12.7a2.3 2.3 0 0 1 0-3.2Z" /><Path d="M8.5 8.5 10 10" /><Path d="M12 12 13.5 13.5" /><Path d="M15.5 15.5 17 17" /><Path d="M13.5 6.8a2 2 0 0 0 2.8 2.8" /></Svg>; }

export function MailIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Rect x="3.5" y="5.5" width="17" height="13" rx="2.2" /><Path d="m4.5 7 7.5 6 7.5-6" /></Svg>; }
export function DollarIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Circle cx="12" cy="12" r="9" /><Path d="M14.8 8.8c-.7-.7-1.7-1-2.8-1-1.7 0-3 .8-3 2.1 0 1.4 1.3 1.9 3 2.2 1.8.3 3 .8 3 2.2 0 1.3-1.2 2.1-3 2.1-1.3 0-2.5-.4-3.3-1.2" /><Line x1="12" y1="6.2" x2="12" y2="17.8" /></Svg>; }
export function SwitchIcon(props: IconProps) { const svg = iconProps(props); return <Svg {...svg}><Rect x="3" y="7" width="18" height="10" rx="5" /><Circle cx="15" cy="12" r="3" /></Svg>; }
