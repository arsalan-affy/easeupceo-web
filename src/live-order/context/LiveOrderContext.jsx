import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Realtime } from "ably";
import toast from "react-hot-toast";

const LiveOrderContext = createContext(null);

const API_BASE = "https://alfabackend.inkapps.io";
const SESSION_DURATION_MS = 45 * 60 * 1000;
const ABLY_API_KEY = "x9wJ8g.wQTA_Q:VhLrbtIzPb8K_KMg6jMsFk1B2CUG2566pC8rAxkJVY4";

let ablyInstance = null;

function getAblyClient() {
  if (!ablyInstance) {
    ablyInstance = new Realtime({ key: ABLY_API_KEY });
    if (typeof window != "undefined") {
      window.addEventListener("beforeunload", () => {
        if (ablyInstance) {
          ablyInstance.close();
          ablyInstance = null;
        }
      });
    }
  }
  return ablyInstance;
}

function closeAblyClient() {
  if (ablyInstance) {
    ablyInstance.close();
    ablyInstance = null;
  }
}

function getStored(key) {
  try {
    return localStorage.getItem(`lo_${key}`) || null;
  } catch {
    return null;
  }
}

function setStored(key, value) {
  try {
    if (value == null) localStorage.removeItem(`lo_${key}`);
    else localStorage.setItem(`lo_${key}`, typeof value == "string" ? value : JSON.stringify(value));
  } catch {}
}

function clearAllLoStorage() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf("lo_") == 0) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {}
}

export function LiveOrderProvider({ children }) {
  const initialSessionExpiry = (() => {
    const raw = getStored("sessionExpiry");
    if (!raw) return null;
    const t = new Date(raw).getTime();
    if (!isFinite(t) || t <= Date.now()) {
      clearAllLoStorage();
      return null;
    }
    return raw;
  })();

  const initialTableId = (() => {
    if (!initialSessionExpiry) return null;
    return getStored("tableId");
  })();

  const [tableId, setTableIdState] = useState(initialTableId);
  const [tableName, setTableNameState] = useState(() => initialSessionExpiry ? getStored("tableName") : null);
  const [orgId, setOrgIdState] = useState(() => initialSessionExpiry ? getStored("orgId") : null);
  const [locationId, setLocationIdState] = useState(() => initialSessionExpiry ? getStored("locationId") : null);
  const [cart, setCartState] = useState(() => {
    if (!initialSessionExpiry) {
      try { localStorage.removeItem("lo_cart"); } catch {}
      return [];
    }
    try {
      const stored = localStorage.getItem("lo_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [orderId, setOrderId] = useState(null);
  const [supportNumber, setSupportNumber] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiryState] = useState(initialSessionExpiry);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const setTableId = (v) => { setTableIdState(v); setStored("tableId", v); };
  const setTableName = (v) => {
    const trimmed = typeof v == "string" ? v.trim() : v;
    const safe = trimmed ? trimmed : null;
    setTableNameState(safe);
    setStored("tableName", safe);
  };
  const setOrgId = (v) => { setOrgIdState(v); setStored("orgId", v); };
  const setLocationId = (v) => { setLocationIdState(v); setStored("locationId", v); };
  const setSessionExpiry = (v) => { setSessionExpiryState(v); setStored("sessionExpiry", v); };

  const setCart = useCallback((value) => {
    setCartState((prev) => {
      const next = typeof value == "function" ? value(prev) : value;
      try {
        localStorage.setItem("lo_cart", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const apiHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    orgid: orgId,
  }), [orgId]);

  const clearSession = useCallback(() => {
    closeAblyClient();
    setTableId(null);
    setTableName(null);
    setOrgId(null);
    setLocationId(null);
    setSessionExpiry(null);
    setCart([]);
    setOrderId(null);
    setSupportNumber("");
    setCategories([]);
    setProducts([]);
    localStorage.removeItem("lo_cart");
  }, [setCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    try { localStorage.removeItem("lo_cart"); } catch {}
  }, [setCart]);

  const applyUrlParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const qTableId = params.get("tableId");
    const qTableName = params.get("tableName");
    const qOrgId = params.get("orgId");
    const qLocationId = params.get("locationId");

    if (!qTableId && !qOrgId && !qLocationId) return;

    const currentTableId = getStored("tableId");
    const sameTable = qTableId && currentTableId && qTableId == currentTableId;
    if (sameTable) return;

    if (orderId) {
      toast.error("An order is in progress at this table. Ask staff for help.");
      return;
    }

    let storedCart = [];
    try {
      const raw = localStorage.getItem("lo_cart");
      storedCart = raw ? JSON.parse(raw) : [];
    } catch {}

    if (storedCart.length > 0) {
      const ok = window.confirm("You have items in your cart. Switching to a new table will clear it. Continue?");
      if (!ok) return;
    }

    clearCart();
    setTableId(qTableId || null);
    setTableName(qTableName ? qTableName.trim() : null);
    if (qOrgId) setOrgId(qOrgId);
    setLocationId(qLocationId || null);
    setSessionExpiry(new Date(Date.now() + SESSION_DURATION_MS).toISOString());
  }, [orderId, clearCart]);

  useEffect(() => {
    applyUrlParams();
  }, []);

  useEffect(() => {
    function onPop() {
      applyUrlParams();
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [applyUrlParams]);

  useEffect(() => {
    if (!sessionExpiry) return;
    intervalRef.current = setInterval(() => {
      if (new Date() >= new Date(sessionExpiry)) {
        clearSession();
        window.location.href = "/live-order";
      }
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [sessionExpiry, clearSession]);

  useEffect(() => {
    if (!orgId) { setLoading(false); return; }
    const existingRaw = getStored("sessionExpiry");
    const existingMs = existingRaw ? new Date(existingRaw).getTime() : 0;
    if (!isFinite(existingMs) || existingMs <= Date.now()) {
      setSessionExpiry(new Date(Date.now() + SESSION_DURATION_MS).toISOString());
    }
    fetchProducts();
  }, [orgId]);

  useEffect(() => {
    if (!orgId || !tableId) return;
    fetchTableOrder();

    let channel;
    const onUpdate = (msg) => {
      const payload = msg?.data || {};
      if (payload.table_id != null && String(payload.table_id) != String(tableId)) return;
      fetchTableOrder();
    };
    try {
      const ably = getAblyClient();
      channel = ably.channels.get("table-management-" + orgId);
      channel.subscribe("update", onUpdate);
    } catch (err) {
      console.error("Ably connection failed:", err);
    }

    return () => {
      if (channel) {
        channel.unsubscribe("update", onUpdate);
        channel.detach();
      }
    };
  }, [orgId, tableId]);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${API_BASE}/api/shop/getProducts`, {
        search: "", minPrice: "", maxPrice: "", page: 1, perPage: 100000, meta: {},
      }, { headers: apiHeaders() });

      const data = res.data?.data;
      setCategories(data?.ItemCategories || []);
      setProducts(data?.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      const msg = "Failed to load menu. Please check your connection and try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTableOrder() {
    try {
      const res = await axios.post(`${API_BASE}/api/shop/getTableDetailsWithOrder`, {
        search: "", minPrice: "", maxPrice: "", page: 1, perPage: 100000, meta: {}, table_id: tableId,
      }, { headers: apiHeaders() });

      if (res.data?.success == false) {
        const msg = res.data?.message || "Invalid table. Please rescan the QR code.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      setError(null);
      setOrderId(res.data?.order?._id || null);
      setSupportNumber(res.data?.data?.phone || "");

      if (res.data?.order == null) {
        setCart((prev) => {
          const localOnly = (prev || []).filter((it) => !it.line_id && !it.kot_sent_quantity);
          return localOnly;
        });
      } else {
        const serverLines = res.data.order.line_items || [];
        setCart((prev) => {
          const prevById = new Map();
          (prev || []).forEach((it) => { if (it._id) prevById.set(String(it._id), it); });

          const merged = [];
          const matchedIds = new Set();

          for (const elm of serverLines) {
            const sid = String(elm.item._id);
            const local = prevById.get(sid);
            matchedIds.add(sid);
            const serverQty = +elm.quantity || 0;
            const localQty = local ? +local.quantity || 0 : 0;
            const quantity = local ? Math.max(serverQty, localQty) : serverQty;
            merged.push({
              _id: elm.item._id,
              name: elm.item.name,
              description: elm.item.description,
              price: elm.item_price,
              old_qty: elm.quantity,
              quantity,
              kot_sent_quantity: elm.kot_sent_quantity,
              line_id: elm._id,
              src: elm.item.image_urls?.[0]?.url || "",
              meta: local?.meta,
              parent_meta: local?.parent_meta,
            });
          }

          for (const it of (prev || [])) {
            const sid = String(it._id);
            if (matchedIds.has(sid)) continue;
            if (it.line_id || it.kot_sent_quantity) continue;
            merged.push(it);
          }

          return merged;
        });
      }
    } catch (err) {
      console.error("Failed to fetch table order:", err);
      const msg = "Failed to load table order. Please try again.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  }

  function addToCart(product) {
    setCart((prev) => {
      const exists = prev.find((item) => item._id == product._id);
      if (exists) {
        return prev.map((item) =>
          item._id == product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.sales_rate,
        quantity: 1,
        src: product.image_urls?.[0]?.url || "",
        meta: product.meta,
        parent_meta: product.parent_meta,
      }];
    });
  }

  function removeFromCart(ids) {
    const idSet = new Set(ids || []);
    setCart((prev) => prev.filter((item) => !idSet.has(item._id)));
  }

  function updateQuantity(productId, action) {
    setCart((prev) =>
      prev.map((item) =>
        item._id == productId
          ? { ...item, quantity: action == "add" ? item.quantity + 1 : Math.max(0, item.quantity - 1) }
          : item
      ).filter((item) => item.quantity > 0)
    );
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    tableId, tableName, orgId, locationId, cart, setCart, orderId, setOrderId,
    supportNumber, categories, products, loading, error,
    addToCart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems,
    fetchTableOrder, apiHeaders, clearSession,
    API_BASE,
  };

  return <LiveOrderContext.Provider value={value}>{children}</LiveOrderContext.Provider>;
}

export function useLiveOrder() {
  const ctx = useContext(LiveOrderContext);
  if (!ctx) throw new Error("useLiveOrder must be used within LiveOrderProvider");
  return ctx;
}
