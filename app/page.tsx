"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code,
  Database,
  Shield,
  Zap,
  Globe,
  Palette,
  Package,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButtons, HeroAuthButtons } from "@/components/auth-buttons";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to customer info page for the grocery POS app
    router.push("/customer-info");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="text-center py-12 sm:py-16 relative px-4">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <AuthButtons />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
          <Image
            src="/codeguide-logo.png"
            alt="CodeGuide Logo"
            width={50}
            height={50}
            className="rounded-xl sm:w-[60px] sm:h-[60px]"
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent font-parkinsans">
            Grocery Point of Sale
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 mb-8">
          A modern full-stack grocery ordering system with real-time order management
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => router.push("/customer-info")}>
            Start Ordering
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/admin/orders")}>
            Admin Panel
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-8 max-w-5xl">
        {/* Project Overview */}
        <div className="text-center mb-8">
          <div className="text-4xl sm:text-5xl mb-2">🛒</div>
          <div className="font-bold text-lg sm:text-xl mb-2">Modern Grocery POS System</div>
          <div className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            This application provides a complete solution for grocery stores to manage customer orders,
            inventory, and real-time order processing.
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Customer Ordering */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200/50 dark:border-blue-700/30">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-lg">Customer Ordering</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Simple Registration</strong> - Quick customer info capture</li>
              <li>• <strong>Product Catalog</strong> - Browse by categories</li>
              <li>• <strong>Smart Search</strong> - Find products quickly</li>
              <li>• <strong>Shopping Cart</strong> - Add/remove items</li>
            </ul>
          </Card>

          {/* Order Management */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200/50 dark:border-green-700/30">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-lg">Order Management</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Real-time Updates</strong> - Instant order notifications</li>
              <li>• <strong>Status Tracking</strong> - Pending, Ready, Completed</li>
              <li>• <strong>Order Details</strong> - Complete itemized views</li>
              <li>• <strong>Receipt Printing</strong> - Thermal printer integration</li>
            </ul>
          </Card>

          {/* Inventory Control */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200/50 dark:border-purple-700/30">
            <div className="flex items-center gap-3 mb-3">
              <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-lg">Inventory Control</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Product Management</strong> - Add/edit/delete products</li>
              <li>• <strong>Category System</strong> - Organize products</li>
              <li>• <strong>Stock Tracking</strong> - Monitor quantities</li>
              <li>• <strong>Price Management</strong> - Update pricing</li>
            </ul>
          </Card>

          {/* Analytics */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 border-cyan-200/50 dark:border-cyan-700/30">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              <h3 className="font-semibold text-lg">Sales Analytics</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Daily Sales</strong> - Revenue tracking</li>
              <li>• <strong>Order Stats</strong> - Status breakdown</li>
              <li>• <strong>Popular Items</strong> - Best selling products</li>
              <li>• <strong>Customer Insights</strong> - Purchase patterns</li>
            </ul>
          </Card>

          {/* Technology */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border-orange-200/50 dark:border-orange-700/30">
            <div className="flex items-center gap-3 mb-3">
              <Code className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold text-lg">Modern Tech Stack</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Next.js 15</strong> - React framework</li>
              <li>• <strong>Drizzle ORM</strong> - Type-safe database</li>
              <li>• <strong>PostgreSQL</strong> - Reliable database</li>
              <li>• <strong>Tailwind CSS</strong> - Responsive design</li>
            </ul>
          </Card>

          {/* Mobile Ready */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border-indigo-200/50 dark:border-indigo-700/30">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-lg">Mobile Friendly</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Responsive Design</strong> - Works on all devices</li>
              <li>• <strong>Touch Optimized</strong> - Easy mobile interactions</li>
              <li>• <strong>Fast Loading</strong> - Optimized performance</li>
              <li>• <strong>Offline Ready</strong> - Progressive web app</li>
            </ul>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Quick Start
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Customer Workflow</h4>
              <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3 font-mono text-sm">
                <div>1. Register with name/phone</div>
                <div>2. Browse products</div>
                <div>3. Add to cart</div>
                <div>4. Checkout &amp; confirm</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Admin Workflow</h4>
              <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3 font-mono text-sm">
                <div>1. Login to admin panel</div>
                <div>2. View new orders (real-time)</div>
                <div>3. Print receipt</div>
                <div>4. Update order status</div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
