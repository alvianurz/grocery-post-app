import { NextResponse } from "next/server";

// Mock data for categories
const mockCategories = [
  {
    id: "1",
    name: "Fruits",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Dairy",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Bakery",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json(mockCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}