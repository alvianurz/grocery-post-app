import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import 'dotenv/config';

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@store.com"),
    });

    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const newUser = await auth.api.signUp({
      body: {
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@store.com",
        password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "password",
        name: "Admin User",
      },
    });

    console.log("Admin user created successfully:", newUser?.user?.id);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

createAdminUser().then(() => {
  console.log("Admin user initialization complete");
  process.exit(0);
}).catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});