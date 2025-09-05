"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Printer,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BluetoothPrinter, isWebBluetoothSupported } from "@/lib/bluetooth-printer";

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

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isBluetoothSupported, setIsBluetoothSupported] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchOrder();
    setIsBluetoothSupported(isWebBluetoothSupported());
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders/${params.id}`);
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
      router.push("/admin/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error("Failed to update order status");
      
      const updatedOrder = await response.json();
      setOrder(prevOrder => prevOrder ? { ...prevOrder, status: updatedOrder.status } : null);
      
      toast({
        title: "Success",
        description: `Order status updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const printReceipt = async () => {
    if (!order) return;

    if (!isBluetoothSupported) {
      toast({
        title: "Not Supported",
        description: "Web Bluetooth is not supported in your browser. Please use Chrome, Edge, or Opera on a compatible device.",
        variant: "destructive",
      });
      return;
    }

    setIsPrinting(true);
    
    try {
      const printer = new BluetoothPrinter();
      const connected = await printer.connect();
      
      if (!connected) {
        throw new Error("Failed to connect to printer");
      }

      // Prepare receipt data
      const receiptData = {
        storeName: "Grocery Store",
        storePhone: "(555) 123-4567",
        orderId: order.id,
        orderDate: new Date(order.createdAt).toLocaleString(),
        customerName: order.user.name,
        customerPhone: order.user.phoneNumber,
        items: order.orderItems.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: parseFloat(item.priceAtPurchase)
        })),
        total: parseFloat(order.totalPrice)
      };

      // Print the receipt
      const success = await printer.printReceipt(receiptData);
      
      if (success) {
        toast({
          title: "Success",
          description: "Receipt printed successfully!",
        });
      } else {
        throw new Error("Failed to print receipt");
      }
      
      await printer.disconnect();
    } catch (error) {
      console.error("Error printing receipt:", error);
      toast({
        title: "Error",
        description: "Failed to print receipt. Make sure your Bluetooth printer is paired and nearby.",
        variant: "destructive",
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case "Ready for Pickup":
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Package className="mr-1 h-3 w-3" /> Ready</Badge>;
      case "Completed":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" /> Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/admin/orders")}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/orders")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-muted-foreground">Order details and management</p>
        </div>
        <div className="ml-auto">
          {getStatusBadge(order.status)}
        </div>
      </div>

      {!isBluetoothSupported && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Bluetooth Printing Not Available:</strong> Your browser or device doesn't support Web Bluetooth. 
                For receipt printing, please use Chrome, Edge, or Opera on a compatible device.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p>${item.priceAtPurchase} each</p>
                      <p className="font-semibold">${(parseFloat(item.priceAtPurchase) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">${order.totalPrice}</span>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{order.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.user.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                onClick={printReceipt}
                disabled={isPrinting || !isBluetoothSupported}
              >
                <Printer className={`mr-2 h-4 w-4 ${isPrinting ? "animate-spin" : ""}`} />
                {isPrinting ? "Printing..." : "Print Receipt"}
              </Button>
              
              {order.status === "Pending" && (
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => updateOrderStatus("Ready for Pickup")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Mark Ready for Pickup
                </Button>
              )}
              
              {order.status === "Ready for Pickup" && (
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => updateOrderStatus("Completed")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Completed
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}