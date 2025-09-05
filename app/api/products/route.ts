import { NextResponse } from "next/server";
import { convertToRupiah } from "@/lib/currency";

// Mock data for products in Rupiah
const mockProducts = [
  {
    id: "1",
    name: "Apple",
    price: "29850", // 1.99 USD * 15000 IDR/USD
    stockQuantity: 100,
    categoryId: "1",
    categoryName: "Fruits",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Banana",
    price: "14850", // 0.99 USD * 15000 IDR/USD
    stockQuantity: 150,
    categoryId: "1",
    categoryName: "Fruits",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Milk",
    price: "59850", // 3.99 USD * 15000 IDR/USD
    stockQuantity: 50,
    categoryId: "2",
    categoryName: "Dairy",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Bread",
    price: "37350", // 2.49 USD * 15000 IDR/USD
    stockQuantity: 30,
    categoryId: "3",
    categoryName: "Bakery",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json(mockProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}