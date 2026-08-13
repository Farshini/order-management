"use client";

import { useEffect, useState } from "react";
import { createOrder, getMenuItems } from "@/lib/api";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [order, setOrder] = useState<any>(null);
  async function updateOrderStatus(orderId: number, status: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update order status");
    }

    return data;
  }

  useEffect(() => {
    async function loadMenu() {
      try {
        const response = await getMenuItems();
        setMenuItems(response.data);
      } catch {
        setError("Unable to load menu items.");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  function addToCart(item: MenuItem) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.item.id === item.id
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.item.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          item,
          quantity: 1,
        },
      ];
    });
  }

  function increaseQuantity(itemId: number) {
    setCart((currentCart) =>
      currentCart.map((cartItem) =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  }

  function decreaseQuantity(itemId: number) {
    setCart((currentCart) =>
      currentCart
        .map((cartItem) =>
          cartItem.item.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  }

  function removeFromCart(itemId: number) {
    setCart((currentCart) =>
      currentCart.filter((cartItem) => cartItem.item.id !== itemId)
    );
  }

  const cartTotal = cart.reduce(
    (total, cartItem) =>
      total + Number(cartItem.item.price) * cartItem.quantity,
    0
  );

  async function handlePlaceOrder() {
    if (cart.length === 0) {
      setOrderError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setOrderError("");

    try {
      const order = await createOrder({
        customer_name: customerName,
        address,
        phone,
        items: cart.map((cartItem) => ({
          menu_item_id: cartItem.item.id,
          quantity: cartItem.quantity,
        })),
      });

      setOrder(order.data);

      alert("Order placed successfully!");

      setCart([]);
      setShowCheckout(false);
      setCustomerName("");
      setAddress("");
      setPhone("");
    } catch (error) {
      setOrderError(
        error instanceof Error ? error.message : "Unable to place order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!order) {
      return;
    }

    const updateStatus = async () => {
      try {
        const preparingResponse = await updateOrderStatus(
          order.id,
          "preparing"
        );

        setOrder(preparingResponse.data);

        setTimeout(async () => {
          try {
            const deliveryResponse = await updateOrderStatus(
              order.id,
              "out_for_delivery"
            );

            setOrder(deliveryResponse.data);
          } catch (error) {
            console.error("Delivery status error:", error);
          }
        }, 5000);
      } catch (error) {
        console.error("Preparing status error:", error);
      }
    };

    const preparingTimer = setTimeout(updateStatus, 5000);

    return () => {
      clearTimeout(preparingTimer);
    };
  }, [order?.id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading menu...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Food Delivery</h1>
            <p className="text-sm text-gray-500">
              Delicious food, delivered to you
            </p>
          </div>

          <div className="text-sm font-medium text-gray-700">
            🛒 Cart (
            {cart.reduce((total, cartItem) => total + cartItem.quantity, 0)})
          </div>
        </div>
      </header>

      {/* Menu */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Our Menu</h2>
          <p className="mt-2 text-gray-500">
            Choose your favorite food and add it to your cart.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{item.price}
                  </span>

                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>

          {cart.length === 0 ? (
            <p className="mt-4 text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {cart.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {cartItem.item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      ₹{cartItem.item.price} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(cartItem.item.id)}
                      className="h-9 w-9 rounded-lg border text-lg"
                    >
                      −
                    </button>

                    <span className="w-6 text-center font-medium">
                      {cartItem.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(cartItem.item.id)}
                      className="h-9 w-9 rounded-lg border text-lg"
                    >
                      +
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFromCart(cartItem.item.id)}
                      className="ml-3 text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4">
                <span className="text-lg font-semibold">Total</span>

                <span className="text-2xl font-bold">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCheckout(true);
                }}
                className="w-full rounded-lg bg-black py-3 font-medium text-white hover:bg-gray-800"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </section>

      {showCheckout && (
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter your delivery details to place the order.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="mt-1 w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>

                <textarea
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="mt-1 w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                  placeholder="Enter delivery address"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-1 w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                  placeholder="Enter phone number"
                />
              </div>

              {orderError && (
                <p className="text-sm text-red-500">{orderError}</p>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full rounded-lg bg-black py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </section>
      )}

      {order && (
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <div className="max-w-xl mx-auto rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              Order #{order.id}
            </h2>

            <p className="mt-2 text-gray-500">
              Thank you, {order.customer_name}!
            </p>

            <div className="mt-6">
              <div className="mt-6">
                <p className="text-sm text-gray-500">Order Status</p>

                <div className="mt-4 space-y-4">
                  {[
                    { key: "received", label: "Order Received" },
                    { key: "preparing", label: "Preparing" },
                    { key: "out_for_delivery", label: "Out for Delivery" },
                  ].map((status) => {
                    const statuses = [
                      "received",
                      "preparing",
                      "out_for_delivery",
                    ];

                    const currentIndex = statuses.indexOf(order.status);
                    const statusIndex = statuses.indexOf(status.key);

                    const completed = statusIndex <= currentIndex;

                    return (
                      <div key={status.key} className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${
                            completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {completed ? "✓" : statusIndex + 1}
                        </div>

                        <span
                          className={`font-medium ${
                            completed ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4">
              <span className="font-medium">Total</span>

              <span className="font-bold">
                ₹{Number(order.total_amount).toFixed(2)}
              </span>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
