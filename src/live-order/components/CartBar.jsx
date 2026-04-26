import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { useLiveOrder } from "../context/LiveOrderContext";

function RND(value) {
  const n = +value;
  if (!isFinite(n)) return 0;
  return +n.toFixed(2);
}

function invoiceItemAdjustment(formObject, response) {
  const INV = { ...formObject };
  const line_items = [...(formObject.line_items || [])];

  let total_before_tax_and_adjustments = 0;
  let total_quantity = 0;
  let total = 0;
  let tax_map = {};
  let adjustments = 0;

  if (!response.OrgPrefs?.discount_after_tax) {
    adjustments = RND(adjustments - +(INV.discount_amount || 0));
    adjustments = RND(adjustments + +(INV.shipping_charge || 0));
  }

  for (const item of line_items) {
    if (!item?.item_id) continue;
    total_quantity += +(item.quantity || 0);
  }

  for (let i = 0; i < line_items.length; i++) {
    const ITEM = { ...line_items[i] };
    if (!ITEM?.item_id) continue;

    let item_gross_total = +ITEM.quantity * +ITEM.item_price;
    if (ITEM.discount_value == null) ITEM.discount_value = 0;
    ITEM.discount_value = RND(+ITEM.discount_value);

    let item_level_adjustment = 0;
    if (ITEM.discount_type == "percent") {
      const discount = RND((item_gross_total * ITEM.discount_value) / 100);
      item_level_adjustment = RND(0 - (discount || 0));
      item_gross_total = RND(item_gross_total - discount);
    } else {
      item_level_adjustment = RND(0 - +(ITEM.discount_value || 0));
      item_gross_total = RND(item_gross_total - +(ITEM.discount_value || 0));
    }

    let before_adjustment_amount = item_gross_total;
    let after_adjustment_amount = +before_adjustment_amount;
    after_adjustment_amount += (+adjustments * +ITEM.quantity) / +total_quantity;

    let taxable_amount;
    if (ITEM.is_tax_inclusive) {
      taxable_amount = RND((after_adjustment_amount * 100) / (100 + +ITEM.item_tax_percentage));
      before_adjustment_amount = RND(taxable_amount - (+adjustments * +ITEM.quantity) / +total_quantity);
    } else {
      taxable_amount = RND(+ITEM.quantity * +ITEM.item_price + (+adjustments * +ITEM.quantity) / +total_quantity + +item_level_adjustment);
    }

    total_before_tax_and_adjustments = RND(total_before_tax_and_adjustments + before_adjustment_amount);

    const tax_group = ITEM.tax_group || {};
    let tax_amount = 0;
    const tax_details = [];

    const placeOfSupply = response.OrgPrefs?.place_of_supply;
    const shippingState = INV.shipping_state || response.OrgPrefs?.place_of_supply;

    if (placeOfSupply == shippingState) {
      for (const t of (tax_group.taxes?.filter((tx) => tx.tax_type == "CGST") || [])) {
        const raw = (taxable_amount * +t.tax_percentage) / 100;
        const v = RND(raw);
        tax_amount += v;
        tax_map[t.name] = (tax_map[t.name] || 0) + raw;
        tax_details.push({ tax_id: t._id, tax_name: t.name, tax_percentage: t.tax_percentage, tax_type: t.tax_type, tax_amount: v, output_account_id: t.output_account_id, input_account_id: t.input_account_id });
      }
      for (const t of (tax_group.taxes?.filter((tx) => tx.tax_type == "SGST") || [])) {
        const raw = (taxable_amount * +t.tax_percentage) / 100;
        const v = RND(raw);
        tax_amount += v;
        tax_map[t.name] = (tax_map[t.name] || 0) + raw;
        tax_details.push({ tax_id: t._id, tax_name: t.name, tax_percentage: t.tax_percentage, tax_type: t.tax_type, tax_amount: v, output_account_id: t.output_account_id, input_account_id: t.input_account_id });
      }
    } else {
      for (const t of (tax_group.taxes?.filter((tx) => tx.tax_type == "IGST") || [])) {
        const raw = (taxable_amount * +t.tax_percentage) / 100;
        const v = RND(raw);
        tax_amount += v;
        tax_map[t.name] = (tax_map[t.name] || 0) + raw;
        tax_details.push({ tax_id: t._id, tax_name: t.name, tax_percentage: t.tax_percentage, tax_type: t.tax_type, tax_amount: v, output_account_id: t.output_account_id, input_account_id: t.input_account_id });
      }
    }

    line_items[i] = { ...ITEM, item_gross_total, item_tax_amount: tax_amount, taxable_amount, tax_details, location_id: INV.location_id };
    total = total + taxable_amount + tax_amount;
  }

  let after_tax_adjustments = 0;
  if (response.OrgPrefs?.discount_after_tax) {
    after_tax_adjustments = RND(after_tax_adjustments - (INV.discount_amount || 0));
    after_tax_adjustments = RND(after_tax_adjustments + (INV.shipping_charge || 0));
  }

  let final_total = total + after_tax_adjustments;
  const rounded_total = +(final_total.toFixed(0));
  const round_off = +(rounded_total - final_total).toFixed(2);
  final_total = RND(final_total + round_off);

  for (const k of Object.keys(tax_map)) tax_map[k] = RND(tax_map[k]);

  return {
    line_items,
    sub_total: total_before_tax_and_adjustments,
    total_before_tcs: total_before_tax_and_adjustments,
    summary: total_before_tax_and_adjustments,
    tax_map,
    total: final_total,
    adjustment: round_off,
  };
}

export default function CartBar() {
  const { cart, totalPrice, totalItems, tableId, orgId, locationId, orderId, setOrderId, apiHeaders, fetchTableOrder, removeFromCart, API_BASE } = useLiveOrder();
  const isDelivery = !tableId;
  const channel = tableId ? 'dine_in' : 'delivery';
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [placing, setPlacing] = useState(false);
  const [invoiceResponse, setInvoiceResponse] = useState(null);
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const deliverySettings = invoiceResponse?.OrgPrefs?.delivery_settings || {};
  const deliveryFee = isDelivery && deliverySettings.enable_delivery
    ? +(deliverySettings.delivery_fee || 0)
    : 0;
  const meetsMinOrder = !isDelivery
    || !deliverySettings.min_order_amount
    || +totalPrice >= +deliverySettings.min_order_amount;
  const navigate = useNavigate();
  const formObjectRef = useRef({
    date: new Date(), due_date: new Date(), number: "Auto-Generated", status: "Pending",
    line_items: [], summary: 0, sub_total: 0, total: 0, total_before_tcs: 0,
    shipping_charge: 0, adjustment: 0, billing_country: "India", billing_state: null,
    shipping_country: "India", shipping_state: null, tax_map: {},
  });

  useEffect(() => {
    if (!orgId) return;
    axios.post(`${API_BASE}/api/Invoices/getCreateData`, {}, { headers: apiHeaders() })
      .then((res) => {
        setInvoiceResponse(res.data);
        setInvoiceProducts(res.data?.Items || []);
      })
      .catch(console.error);
  }, [orgId, apiHeaders, API_BASE]);

  function buildInvoiceDetails() {
    if (!invoiceResponse) return formObjectRef.current;

    const TaxGroups = invoiceResponse.TaxGroups || [];
    const line_items = [];
    const removedItems = [];
    const invalidPriceItems = [];

    for (const cartItem of cart) {
      const item = invoiceProducts.find((p) => p._id == cartItem._id);
      if (!item) {
        removedItems.push({ _id: cartItem._id, name: cartItem.name });
        continue;
      }
      if (!item.sales_rate || +item.sales_rate <= 0) {
        invalidPriceItems.push(item.name);
        continue;
      }
      const tax_group = TaxGroups.find((tg) => tg._id == item.tax_group_id);

      const existing = line_items.findIndex((li) => li.item_id == cartItem._id);
      if (existing == -1) {
        line_items.push({
          item_id: item._id, item_name: item.name, hsn_or_sac: item.hsn_or_sac,
          description: item.description, account_id: item.sales_account_id,
          track_inventory: item.track_inventory, track_serial_number: item.track_serial_number,
          track_batch_number: item.track_batch_number, usage_unit: item.usage_unit,
          tax_group_id: item.tax_group_id, tax_group, quantity: cartItem.quantity,
          item_price: item.sales_rate, item_gross_total: item.sales_rate,
          item_total: item.sales_rate, discount_percentage: 0, discount_amount: 0,
          status: "Pending", serial_numbers: [],
        });
      } else {
        line_items[existing].quantity = cartItem.quantity;
      }
    }

    if (removedItems.length > 0) {
      return { removedItems };
    }
    if (invalidPriceItems.length > 0) {
      return { invalidPriceItems };
    }

    const formObj = { ...formObjectRef.current, line_items, shipping_charge: deliveryFee };
    const adjusted = invoiceItemAdjustment(formObj, invoiceResponse);
    return { ...formObj, ...adjusted };
  }

  async function placeOrder() {
    let digits = "";
    if (!orderId) {
      if (!name.trim()) { toast.error("Please enter your name"); return; }
      digits = phone.replace(/[^0-9]/g, "");
      if (digits.startsWith("91") && digits.length > 10) digits = digits.slice(2);
      if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
      if (digits.length != 10) { toast.error("Please enter a valid 10-digit phone number"); return; }
      if (isDelivery) {
        if (!deliverySettings.enable_delivery) { toast.error("Delivery is not enabled for this restaurant"); return; }
        if (!meetsMinOrder) { toast.error(`Minimum order for delivery is ₹${deliverySettings.min_order_amount}`); return; }
        if (!address.trim()) { toast.error("Please enter your delivery address"); return; }
        if (!city.trim()) { toast.error("Please enter your city"); return; }
        if (!pincode.trim()) { toast.error("Please enter your pincode"); return; }
      }
    }

    if (!invoiceResponse?.OrgPrefs?.place_of_supply) {
      toast.error("Tax configuration missing — contact restaurant");
      return;
    }

    const invoiceDetails = buildInvoiceDetails();
    if (invoiceDetails.removedItems && invoiceDetails.removedItems.length > 0) {
      toast.error("Some items are no longer available and were removed");
      removeFromCart(invoiceDetails.removedItems.map((i) => i._id));
      return;
    }
    if (invoiceDetails.invalidPriceItems && invoiceDetails.invalidPriceItems.length > 0) {
      toast.error(`Item '${invoiceDetails.invalidPriceItems[0]}' has no price configured`);
      return;
    }

    setPlacing(true);
    try {
      if (!orderId) {
        await axios.post(`${API_BASE}/api/shop/creatCustomerIfNotExists`, { phone: "+91" + digits }, { headers: apiHeaders() });
      }

      if (tableId) invoiceDetails.table_id = tableId;
      if (locationId) invoiceDetails.location_id = locationId;
      invoiceDetails.invoice_id = orderId;
      invoiceDetails.status = "Pending";

      const body = {
        customer: { name, email: "", phone: "+91" + digits },
        shipping_address: isDelivery
          ? { address, apartment: "", city, state: "", pincode }
          : { address: "", apartment: "", city: "", state: "", pincode: "" },
        items: cart.map((p) => ({ product: p._id, quantity: p.quantity })),
        payment_details: {},
        invoice_details: invoiceDetails,
        channel,
      };

      const res = await axios.post(`${API_BASE}/api/shop/placeOrder`, body, { headers: apiHeaders() });
      const newOrderId = res?.data?._id;
      const invoiceNumber = res?.data?.invoice_number;
      if (newOrderId) {
        if (typeof setOrderId == "function") {
          setOrderId(newOrderId);
        } else if (typeof fetchTableOrder == "function") {
          fetchTableOrder();
        }
      }
      toast.success("Order placed successfully!");
      setOpen(false);
      navigate("/live-order/thank-you", { state: { invoiceNumber } });
    } catch (err) {
      console.error(err);
      const backendMsg = err?.response?.data?.message;
      toast.error(backendMsg || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  if (cart.length == 0) return null;

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 0,
  }).format(totalPrice);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-auto">
          <SheetHeader>
            <SheetTitle>Place Order</SheetTitle>
          </SheetHeader>

          <div className="px-4 pb-6 space-y-4">
            {!orderId && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">+91</span>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                {isDelivery && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Delivery Address</label>
                      <input
                        type="text"
                        placeholder="House / street / area"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-foreground mb-1 block">City</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium text-foreground mb-1 block">Pincode</label>
                        <input
                          type="text"
                          placeholder="Pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                    {deliverySettings.enable_delivery && deliveryFee > 0 && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    {!meetsMinOrder && (
                      <p className="text-xs text-red-600">Minimum order ₹{deliverySettings.min_order_amount} required for delivery.</p>
                    )}
                  </>
                )}
              </>
            )}

            {orderId && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Order Summary</p>
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">x{item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold text-sm">
                  <span>Total</span>
                  <span>{formattedTotal}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 gradient-brand text-white"
                onClick={placeOrder}
                disabled={placing || (isDelivery && !invoiceResponse)}
              >
                {placing ? "Placing..." : (isDelivery && !invoiceResponse ? "Loading…" : "Place Order")}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Fixed bottom cart bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key == 'Enter' || e.key == ' ') { e.preventDefault(); setOpen(true); } }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="mx-3 mb-3 gradient-brand text-white rounded-xl px-4 py-3 flex items-center justify-between shadow-brand">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart className="size-5" />
                <Badge className="absolute -top-2 -right-3 size-5 flex items-center justify-center text-[10px] bg-white text-brand border-0">
                  {totalItems}
                </Badge>
              </div>
              <span className="font-semibold">{formattedTotal}</span>
            </div>
            <span className="font-semibold text-sm tracking-wide">CHECKOUT &rarr;</span>
          </div>
        </div>
      </div>
    </>
  );
}
