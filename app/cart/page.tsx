"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { convertToRupiah } from "@/lib/currency";

interface Product {
  id: string;
  name: string;
  price: string;
  stockQuantity: number;
  categoryId: string;
  categoryName: string;
  createdAt: string;
}

export default function ShoppingCartPage() {
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Load cart and customer info from localStorage
  useEffect(() => {
    const customer = localStorage.getItem("customer");
    if (!customer) {
      router.push("/customer-info");
      return;
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const newCart = { ...prevCart, [productId]: quantity };
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      delete newCart[productId];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const getCartItems = () => {
    return Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return product ? { product, quantity } : null;
    }).filter(Boolean) as { product: Product; quantity: number }[];
  };

  const getTotalPrice = () => {
    return getCartItems().reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    const customer = JSON.parse(localStorage.getItem("customer") || "{}");
    const items = getCartItems().map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));
    
    const totalPrice = getTotalPrice();
    
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: customer.id,
          items,
          totalPrice: totalPrice.toFixed(2),
        }),
      });
      
      if (!response.ok) throw new Error("Failed to create order");
      
      const order = await response.json();
      
      // Clear cart
      setCart({});
      localStorage.removeItem("cart");
      
      toast({
        title: "Order Placed",
        description: `Your order #${order.id} has been placed successfully!`,
      });
      
      // Redirect to order confirmation
      router.push(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cartItems = getCartItems();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading cart...</p>
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
            <h1 className="text-xl font-bold">Shopping Cart</h1>
          </div>
        </div>
      </header>

      <div className="container py-6 px-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to your cart to continue.</p>
            <Button onClick={() => router.push("/catalog")}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map(({ product, quantity }) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>{product.categoryName}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFromCart(product.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="font-semibold">
                        {convertToRupiah(parseFloat(product.price) * quantity)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{convertToRupiah(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{convertToRupiah(0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{convertToRupiah(getTotalPrice())}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}