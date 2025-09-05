import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";

// Get a specific category
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    // Fetch the category
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId));

    if (category.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category[0]);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// Update a category
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;
    const body = await request.json();
    const { name } = body;

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if another category with the same name exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name))
      .where(ne(categories.id, categoryId))
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    // Update the category
    const updatedCategory = await db
      .update(categories)
      .set({ name })
      .where(eq(categories.id, categoryId))
      .returning();

    if (updatedCategory.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCategory[0]);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// Delete a category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    // Check if there are products in this category
    const productsInCategory = await db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryId))
      .limit(1);

    if (productsInCategory.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing products" },
        { status: 400 }
      );
    }

    // Delete the category
    const deletedCategory = await db
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning();

    if (deletedCategory.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}