import type { AppRole } from "./account-role";

export const roleDestinations = {
  customer: "/event-details",
  admin: "/admin-dashboard",
  mariachi_team: "/mariachi-dashboard",
} as const satisfies Record<AppRole, string>;

export const publicRoutes = ["index", "welcome", "login", "register"] as const;

// Informational Expo starter screen; it contains no role-specific functionality.
export const sharedRoutes = ["explore"] as const;

export const roleRoutes = {
  customer: [
    "event-details",
    "select-musicians",
    "mariachis",
    "booking",
    "my-events",
    "event-detail",
    "favorites",
    "profile",
    "edit-profile",
    "packages",
    "serenades",
  ],
  admin: ["admin-dashboard"],
  mariachi_team: [
    "mariachi-dashboard",
    "mariachi-requests",
    "mariachi-schedule",
    "mariachi-earnings",
    "mariachi-profile",
    "mariachi-event-detail",
    "mariachi-reviews",
  ],
} as const satisfies Record<AppRole, readonly string[]>;
