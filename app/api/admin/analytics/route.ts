import { db } from "@/db";
import { orders } from "@/db/schema";
import { sql, eq, and, gte, lt } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get today's date
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfTomorrow = new Date(startOfDay);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    // Get total sales for today
    const todaySalesResult = await db
      .select({
        totalSales: sql<number>`SUM(${orders.totalPrice})`.mapWith(Number),
        orderCount: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, startOfDay),
          lt(orders.createdAt, startOfTomorrow)
        )
      );

    const todaySales = todaySalesResult[0].totalSales || 0;
    const todayOrders = todaySalesResult[0].orderCount || 0;

    // Get order counts by status
    const statusCountsResult = await db
      .select({
        status: orders.status,
        count: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(orders)
      .groupBy(orders.status);

    // Convert to object for easier access
    const statusCounts: Record<string, number> = {};
    statusCountsResult.forEach(({ status, count }) => {
      statusCounts[status] = count;
    });

    // Get recent orders (last 5)
    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(5);

    return NextResponse.json({
      todaySales,
      todayOrders,
      statusCounts,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}