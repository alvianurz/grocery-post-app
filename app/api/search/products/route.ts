import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { asc, ilike } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Fetch products matching the search query
    const searchResults = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        stockQuantity: products.stockQuantity,
        categoryId: products.categoryId,
        categoryName: categories.name,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(ilike(products.name, `%${query}%`))
      .orderBy(asc(products.name));

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}