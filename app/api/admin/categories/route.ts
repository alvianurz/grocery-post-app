import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

// Get all categories
export async function GET() {
  try {
    // Fetch all categories
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.name));

    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// Create a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const newCategory = await db
      .insert(categories)
      .values({ name })
      .returning();

    return NextResponse.json(newCategory[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}