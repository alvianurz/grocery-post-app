"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { convertToRupiah } from "@/lib/currency";

interface OrderItem {
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  priceAtPurchase: string;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  totalPrice: string;
  user: {
    name: string;
    phoneNumber: string;
  };
  orderItems: OrderItem[];
}

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Get customer info from localStorage
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      try {
        setCustomer(JSON.parse(customerData));
      } catch (e) {
        console.error("Error parsing customer data:", e);
      }
    }
    
    if (!customerData) {
      router.push("/customer-info");
      return;
    }

    // Unwrap the params promise
    params.then(unwrappedParams => {
      fetchOrder(unwrappedParams.id);
    });
  }, [params, router]);

  const fetchOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found");
        }
        throw new Error("Failed to fetch order");
      }
      
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive",
      });
      router.push("/catalog");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/catalog")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Order Confirmation</h1>
          </div>
        </div>
      </header>

      <div className="container py-6 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
            <CardDescription>
              Thank you for your order. Your order number is <span className="font-semibold">#{order.id}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Order Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-medium">#{order.id}</span>
                
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
                
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium">{order.status}</span>
                
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">{convertToRupiah(order.totalPrice)}</span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Items</h3>
              <div className="space-y-2">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity} x {item.product.name || `Product #${item.product.id}`}</span>
                    <span>{convertToRupiah(parseFloat(item.priceAtPurchase) * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span>{customer?.name || order.user.name}</span>
                
                <span className="text-muted-foreground">Phone:</span>
                <span>{customer?.phoneNumber || order.user.phoneNumber}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => router.push("/catalog")}>
              Continue Shopping
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.print()}>
              Print Receipt
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}