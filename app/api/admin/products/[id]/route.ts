import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Get a specific product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // Fetch the product with its category
    const productWithCategory = await db
      .select({
        id: products.id,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, productId));

    if (productWithCategory.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(productWithCategory[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// Update a product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const body = await request.json();
    const { name, price, stockQuantity, categoryId } = body;

    // Validate input
    if (!name || !price || stockQuantity === undefined || !categoryId) {
      return NextResponse.json(
        { error: "Name, price, stock quantity, and category ID are required" },
        { status: 400 }
      );
    }

    // Update the product
    const updatedProduct = await db
      .update(products)
      .set({
        name,
        price,
        stockQuantity: parseInt(stockQuantity),
        categoryId,
      })
      .where(eq(products.id, productId))
      .returning();

    if (updatedProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

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
      .where(eq(products.id, updatedProduct[0].id));

    return NextResponse.json(productWithCategory[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // Delete the product
    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning();

    if (deletedProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}