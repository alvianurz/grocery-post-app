import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

// Get all products
export async function GET() {
  try {
    // Fetch all products with their categories
    const productsWithCategories = await db
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
      .orderBy(asc(categories.name), asc(products.name));

    return NextResponse.json(productsWithCategories);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, stockQuantity, categoryId } = body;

    // Validate input
    if (!name || !price || stockQuantity === undefined || !categoryId) {
      return NextResponse.json(
        { error: "Name, price, stock quantity, and category ID are required" },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = await db
      .insert(products)
      .values({
        name,
        price,
        stockQuantity: parseInt(stockQuantity),
        categoryId,
      })
      .returning();

    // Fetch the product with category name
    const productWithCategory = await db
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
      .where(eq(products.id, newProduct[0].id));

    return NextResponse.json(productWithCategory[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}