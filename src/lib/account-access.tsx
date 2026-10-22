import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import { getAppRole, type AppRole } from "./account-role";
import { supabase } from "./supabase";

type Identity = { userId: string | null } | { error: string };
type RoleResult = { identity: Identity } & (
  | { status: "ready"; role: AppRole }
  | { status: "error"; message: string }
);

type AccountAccess = (
  | { status: "loading"; userId?: string }
  | { status: "signed-out"; userId?: never }
  | { status: "ready"; userId: string; role: AppRole }
  | { status: "error"; userId?: string; message: string }
) & { retry: () => void };

const AccountAccessContext = createContext<AccountAccess | null>(null);

export function AccountAccessProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [roleResult, setRoleResult] = useState<RoleResult | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;

    const acceptSession = (session: Session | null) => {
      const userId = session?.user.id ?? null;
      setIdentity((previous) =>
        previous && "userId" in previous && previous.userId === userId
          ? previous
          : { userId },
      );
    };

    // Keep this callback synchronous: querying Supabase inside an awaited auth
    // callback can deadlock its session lock. Role queries run in a separate effect.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      receivedAuthEvent = true;
      acceptSession(session);
    });

    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        // A newer auth event takes precedence over the initial storage read.
        if (!active || receivedAuthEvent) return;
        if (error) throw error;
        acceptSession(data.session);
      } catch {
        if (active && !receivedAuthEvent) {
          setIdentity({ error: "No pudimos verificar tu sesión." });
        }
      }
    };

    void restoreSession();

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [attempt]);

  useEffect(() => {
    if (!identity || !("userId" in identity) || !identity.userId) return;
    const userId = identity.userId;
    let active = true;

    const resolveRole = async () => {
      try {
        const role = await getAppRole(userId);
        if (active) setRoleResult({ identity, status: "ready", role });
      } catch {
        if (active) {
          setRoleResult({ identity, status: "error", message: "No pudimos verificar tu tipo de cuenta." });
        }
      }
    };

    void resolveRole();
    return () => { active = false; };
  }, [identity]);

  const retry = () => {
    setIdentity(null);
    setRoleResult(null);
    setAttempt((value) => value + 1);
  };

  let access: AccountAccess;
  if (!identity) {
    access = { status: "loading", retry };
  } else if ("error" in identity) {
    access = { status: "error", message: identity.error, retry };
  } else if (!identity.userId) {
    access = { status: "signed-out", retry };
  } else if (roleResult?.identity !== identity) {
    // Never reuse a previous account's role, even before effect cleanup runs.
    access = { status: "loading", userId: identity.userId, retry };
  } else if (roleResult.status === "error") {
    access = { status: "error", userId: identity.userId, message: roleResult.message, retry };
  } else {
    access = { status: "ready", userId: identity.userId, role: roleResult.role, retry };
  }

  return <AccountAccessContext.Provider value={access}>{children}</AccountAccessContext.Provider>;
}

export function useAccountAccess(): AccountAccess {
  const access = useContext(AccountAccessContext);
  if (!access) throw new Error("AccountAccessProvider is required.");
  return access;
}
