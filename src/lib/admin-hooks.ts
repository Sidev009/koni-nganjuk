/**
 * admin-hooks.ts
 * ─────────────────────────────────────────────────────────────
 * React hooks for subscribing to the admin store.
 * ─────────────────────────────────────────────────────────────
 */
import { useEffect, useState } from "react";
import {
  getStore,
  isAdminLoggedIn,
  type AdminStore,
} from "./admin-store";

/** Returns the full store object, re-renders on any store change. */
export function useAdminStore(): AdminStore {
  const [store, setStore] = useState<AdminStore>(getStore);

  useEffect(() => {
    const onchange = () => setStore(getStore());
    window.addEventListener("koni-store-change", onchange);
    return () => window.removeEventListener("koni-store-change", onchange);
  }, []);

  return store;
}

/** Returns true when admin is logged in (checks sessionStorage). */
export function useAdminAuth(): boolean {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn);

  useEffect(() => {
    const onchange = () => setLoggedIn(isAdminLoggedIn());
    window.addEventListener("koni-store-change", onchange);
    // Also check on focus (tab switch)
    window.addEventListener("focus", onchange);
    return () => {
      window.removeEventListener("koni-store-change", onchange);
      window.removeEventListener("focus", onchange);
    };
  }, []);

  return loggedIn;
}
