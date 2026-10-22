import { router, Stack, useRootNavigationState, useSegments } from "expo-router";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function RootLayout() {
  const [hasLoadedSession, setHasLoadedSession] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const navigationState = useRootNavigationState();
  const segments = useSegments();

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      // A storage/network error must not leave the app blocked at launch. The
      // auth listener remains active and will update this state if it recovers.
      setHasSession(!error && Boolean(data.session));
      setHasLoadedSession(true);
    };

    void loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setHasSession(Boolean(session));
        setHasLoadedSession(true);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedSession || !navigationState?.key) return;

    const currentRoute = segments[0];
    const isPublicRoute = !currentRoute || currentRoute === "welcome" || currentRoute === "login" || currentRoute === "register";

    if (hasSession && isPublicRoute) {
      // New accounts always start as customers. Mariachi/admin access is granted
      // outside the app by trusted server-side administration.
      router.replace("/role-redirect");
    } else if (!hasSession && !isPublicRoute) {
      router.replace("/welcome");
    }
  }, [hasLoadedSession, hasSession, navigationState?.key, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
