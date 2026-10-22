import { Stack } from "expo-router";

import { AccountAccessProvider, useAccountAccess } from "@/lib/account-access";
import { publicRoutes, roleRoutes, sharedRoutes } from "@/lib/account-routes";
import RoleRedirectScreen from "./role-redirect";

export default function RootLayout() {
  return <AccountAccessProvider><RoleNavigator /></AccountAccessProvider>;
}

function RoleNavigator() {
  const access = useAccountAccess();

  // Resolve access before mounting the navigator. This also preserves legitimate
  // initial deep links instead of replacing them while the session is restored.
  if (access.status === "loading" || access.status === "error") {
    return <RoleRedirectScreen />;
  }

  const role = access.status === "ready" ? access.role : null;

  return (
    // Reset mounted screens and their local data when the account changes,
    // including switches between two accounts with the same role.
    <Stack key={access.userId ?? "anonymous"} screenOptions={{ headerShown: false }}>
      {/* Fallback for denied routes; redirects to the verified role's destination. */}
      <Stack.Screen name="role-redirect" />

      <Stack.Protected guard={access.status === "signed-out"}>
        {publicRoutes.map((name) => <Stack.Screen key={name} name={name} />)}
      </Stack.Protected>

      <Stack.Protected guard={role === "customer"}>
        {roleRoutes.customer.map((name) => <Stack.Screen key={name} name={name} />)}
      </Stack.Protected>

      <Stack.Protected guard={role === "admin"}>
        {roleRoutes.admin.map((name) => <Stack.Screen key={name} name={name} />)}
      </Stack.Protected>

      <Stack.Protected guard={role === "mariachi_team"}>
        {roleRoutes.mariachi_team.map((name) => <Stack.Screen key={name} name={name} />)}
      </Stack.Protected>

      <Stack.Protected guard={access.status === "ready"}>
        {sharedRoutes.map((name) => <Stack.Screen key={name} name={name} />)}
      </Stack.Protected>
    </Stack>
  );
}
