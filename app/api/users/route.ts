import { NextResponse } from "next/server";

// Mock storage for users when database is not available
interface MockUser {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: Date;
}

const mockUsers: MockUser[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phoneNumber } = body;

    // Validate input
    if (!name || !phoneNumber) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    // Check if user already exists (in mock storage)
    const existingUser = mockUsers.find(user => user.phoneNumber === phoneNumber);

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Create new user (in mock storage)
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phoneNumber,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}