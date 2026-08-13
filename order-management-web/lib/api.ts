const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMenuItems() {
  const response = await fetch(`${API_URL}/menu-items`);

  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }

  return response.json();
}

export async function createOrder(orderData: {
  customer_name: string;
  address: string;
  phone: string;
  items: {
    menu_item_id: number;
    quantity: number;
  }[];
}) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create order");
  }

  return data;
}