import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Realtime } from "ably";

const LiveOrderContext = createContext(null);

const API_BASE = "https://alfabackend.inkapps.io";
const SESSION_DURATION_MS = 45 * 60 * 1000;
const ABLY_API_KEY = "x9wJ8g.wQTA_Q:VhLrbtIzPb8K_KMg6jMsFk1B2CUG2566pC8rAxkJVY4";

// Singleton Ably client — one connection shared across all components
let ablyInstance = null;

function getAblyClient() {
  if (!ablyInstance) {
    ablyInstance = new Realtime({ key: ABLY_API_KEY });
    if (typeof window !== "undefined") {
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
    else localStorage.setItem(`lo_${key}`, typeof value === "string" ? value : JSON.stringify(value));
  } catch {}
}

export function LiveOrderProvider({ children }) {
  const [tableId, setTableIdState] = useState(() => getStored("tableId"));
  const [tableName, setTableNameState] = useState(() => getStored("tableName"));
  const [orgId, setOrgIdState] = useState(() => getStored("orgId"));
  const [cart, setCartState] = useState(() => {
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
  const [sessionExpiry, setSessionExpiryState] = useState(() => getStored("sessionExpiry"));
  const intervalRef = useRef(null);

  const setTableId = (v) => { setTableIdState(v); setStored("tableId", v); };
  const setTableName = (v) => { setTableNameState(v); setStored("tableName", v); };
  const setOrgId = (v) => { setOrgIdState(v); setStored("orgId", v); };
  const setSessionExpiry = (v) => { setSessionExpiryState(v); setStored("sessionExpiry", v); };

  const setCart = useCallback((value) => {
    setCartState(value);
    try {
      localStorage.setItem("lo_cart", JSON.stringify(value));
    } catch {}
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
    setSessionExpiry(null);
    setCart([]);
    setOrderId(null);
    setSupportNumber("");
    setCategories([]);
    setProducts([]);
    localStorage.removeItem("lo_cart");
  }, [setCart]);

  // Extract URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qTableId = params.get("tableId");
    const qTableName = params.get("tableName");
    const qOrgId = params.get("orgId");

    if (qTableId) setTableId(qTableId);
    if (qTableName) setTableName(qTableName?.trim());
    if (qOrgId) setOrgId(qOrgId);
  }, []);

  // Session expiry check
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

  // Fetch products + reset session expiry when orgId is ready
  useEffect(() => {
    if (!orgId) { setLoading(false); return; }
    const expiry = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
    setSessionExpiry(expiry);
    fetchProducts();
  }, [orgId]);

  // Fetch existing order + subscribe to Ably real-time updates when tableId is ready
  useEffect(() => {
    if (!orgId || !tableId) return;
    fetchTableOrder();

    // Subscribe to table-management-{org_id} — the channel the backend actually publishes to
    // on invoice save/update/void/transfer/merge. This covers: kitchen updates, payment,
    // order delivered/cancelled/voided, table transfers and merges.
    let channel;
    try {
      const ably = getAblyClient();
      channel = ably.channels.get("table-management-" + orgId);
      channel.subscribe("update", () => {
        fetchTableOrder();
      });
    } catch (err) {
      console.error("Ably connection failed:", err);
    }

    return () => {
      if (channel) {
        channel.unsubscribe();
        channel.detach();
      }
    };
  }, [orgId, tableId]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/shop/getProducts`, {
        search: "", minPrice: "", maxPrice: "", page: 1, perPage: 100000, meta: {},
      }, { headers: apiHeaders() });

      const data = res.data?.data;
      setCategories(data?.ItemCategories || []);
      setProducts(data?.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTableOrder() {
    try {
      const res = await axios.post(`${API_BASE}/api/shop/getTableDetailsWithOrder`, {
        search: "", minPrice: "", maxPrice: "", page: 1, perPage: 100000, meta: {}, table_id: tableId,
      }, { headers: apiHeaders() });

      setOrderId(res.data?.order?._id || null);
      setSupportNumber(res.data?.data?.phone || "");

      if (res.data?.order == null) {
        setCart([]);
      } else {
        setCart(res.data.order.line_items.map((elm) => ({
          _id: elm.item._id,
          name: elm.item.name,
          description: elm.item.description,
          price: elm.item_price,
          old_qty: elm.quantity,
          quantity: elm.quantity,
          kot_sent_quantity: elm.kot_sent_quantity,
          src: elm.item.image_urls?.[0]?.url || "",
        })));
      }
    } catch (err) {
      console.error("Failed to fetch table order:", err);
    }
  }

  function addToCart(product) {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      setCart(cart.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.sales_rate,
        quantity: 1,
        src: product.image_urls?.[0]?.url || "",
        meta: product.meta,
        parent_meta: product.parent_meta,
      }]);
    }
  }

  function updateQuantity(productId, action) {
    setCart(
      cart.map((item) =>
        item._id === productId
          ? { ...item, quantity: action === "add" ? item.quantity + 1 : Math.max(0, item.quantity - 1) }
          : item
      ).filter((item) => item.quantity > 0)
    );
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    tableId, tableName, orgId, cart, setCart, orderId, setOrderId,
    supportNumber, categories, products, loading,
    addToCart, updateQuantity, totalPrice, totalItems,
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
