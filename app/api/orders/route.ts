import { NextResponse } from "next/server";
import { mockStorage } from "@/lib/mock-storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items, totalPrice } = body;

    // Validate input
    if (!userId || !items || !totalPrice) {
      return NextResponse.json(
        { error: "User ID, items, and total price are required" },
        { status: 400 }
      );
    }

    // Create the order
    const newOrder = {
      id: Date.now().toString(), // Use timestamp as ID for uniqueness
      userId,
      items, // Store the actual items
      totalPrice,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    mockStorage.orders.push(newOrder);

    // Return the order with mock user details (in a real app, you'd fetch actual user data)
    const completeOrder = {
      ...newOrder,
      user: {
        name: "Customer", // This will be overridden by the frontend
        phoneNumber: "Customer Phone", // This will be overridden by the frontend
      },
    };

    return NextResponse.json(completeOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Get all orders (for admin)
export async function GET(request: Request) {
  try {
    // Return mock orders with user details
    const allOrders = mockStorage.orders.map(order => ({
      ...order,
      user: {
        name: "Customer",
        phoneNumber: "Customer Phone",
      },
    }));

    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}