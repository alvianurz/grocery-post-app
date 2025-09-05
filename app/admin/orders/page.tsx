"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Printer,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BluetoothPrinter, isWebBluetoothSupported } from "@/lib/bluetooth-printer";
import Link from "next/link";

interface Order {
  id: number;
  createdAt: string;
  status: string;
  totalPrice: string;
  user: {
    name: string;
    phoneNumber: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPrinting, setIsPrinting] = useState<{[key: number]: boolean}>({});
  const [isBluetoothSupported, setIsBluetoothSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    setIsBluetoothSupported(isWebBluetoothSupported());
    
    // In a real app, you would set up a WebSocket connection for real-time updates
    // For now, we'll simulate real-time updates with polling
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error("Failed to update order status");
      
      const updatedOrder = await response.json();
      
      // Update the order in the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
      
      toast({
        title: "Success",
        description: `Order #${orderId} status updated to ${status}`,
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

  const printReceipt = async (orderId: number) => {
    if (!isBluetoothSupported) {
      toast({
        title: "Not Supported",
        description: "Web Bluetooth is not supported in your browser. Please use Chrome, Edge, or Opera on a compatible device.",
        variant: "destructive",
      });
      return;
    }

    setIsPrinting(prev => ({ ...prev, [orderId]: true }));
    
    try {
      // Fetch order details for printing
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error("Failed to fetch order details");
      
      const order = await response.json();
      
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
        items: order.orderItems.map((item: any) => ({
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
      setIsPrinting(prev => ({ ...prev, [orderId]: false }));
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
          <p className="mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <Button onClick={fetchOrders} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
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

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        Order #{order.id}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold">Customer</h3>
                    <p className="text-sm">{order.user.name}</p>
                    <p className="text-sm text-muted-foreground">{order.user.phoneNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Order Value</h3>
                    <p className="text-sm">${order.totalPrice}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => printReceipt(order.id)}
                      disabled={!isBluetoothSupported || isPrinting[order.id]}
                    >
                      <Printer className={`mr-2 h-4 w-4 ${isPrinting[order.id] ? "animate-spin" : ""}`} />
                      {isPrinting[order.id] ? "Printing..." : "Print Receipt"}
                    </Button>
                    <div className="flex gap-2">
                      {order.status === "Pending" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateOrderStatus(order.id, "Ready for Pickup")}
                        >
                          Mark Ready
                        </Button>
                      )}
                      {order.status === "Ready for Pickup" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateOrderStatus(order.id, "Completed")}
                        >
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}