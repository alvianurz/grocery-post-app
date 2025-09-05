import { NextResponse } from "next/server";
import { mockStorage } from "@/lib/mock-storage";
import { getProductNameById } from "@/lib/mock-products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap the params promise
    const unwrappedParams = await params;
    const orderId = unwrappedParams.id;

    // Find the order
    const order = mockStorage.orders.find(o => o.id === orderId);

    if (!order) {
      // If order doesn't exist, return a 404
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Return the order with mock details
    const orderWithDetails = {
      ...order,
      user: {
        name: "Customer", // This will be overridden by the frontend
        phoneNumber: "Customer Phone", // This will be overridden by the frontend
      },
      // Use the actual items from the order with real product names
      orderItems: order.items.map((item: { quantity: number; price: string; productId: string }) => ({
        quantity: item.quantity,
        priceAtPurchase: item.price,
        product: {
          id: item.productId,
          name: getProductNameById(item.productId),
        },
      })),
    };

    return NextResponse.json(orderWithDetails);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// Update order status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap the params promise
    const unwrappedParams = await params;
    const orderId = unwrappedParams.id;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Find and update the order
    const orderIndex = mockStorage.orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    mockStorage.orders[orderIndex].status = status;

    return NextResponse.json(mockStorage.orders[orderIndex]);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}