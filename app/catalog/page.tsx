"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Load customer info and cart from localStorage
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
    fetchCategories();
  }, [router]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
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

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filter products based on search query and category
  useEffect(() => {
    let result = products;
    
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      result = result.filter(product => product.categoryId === selectedCategory);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  const addToCart = (productId: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      newCart[productId] = (newCart[productId] || 0) + 1;
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
    
    toast({
      title: "Added to Cart",
      description: "Product added to your shopping cart",
    });
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        return total + (parseFloat(product.price) * quantity);
      }
      return total;
    }, 0);
  };

  const groupedProducts = () => {
    const groups: {[key: string]: Product[]} = {};
    
    filteredProducts.forEach(product => {
      if (!groups[product.categoryId]) {
        groups[product.categoryId] = [];
      }
      groups[product.categoryId].push(product);
    });
    
    return groups;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Store Catalog</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push("/cart")}
              disabled={getCartCount() === 0}
            >
              Cart ({getCartCount()}) - ${getTotalPrice().toFixed(2)}
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6 px-4">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div>
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {/* Category Filter */}
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 pb-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Product List */}
        {Object.entries(groupedProducts()).map(([categoryId, categoryProducts]) => {
          const category = categories.find(c => c.id === categoryId);
          return (
            <div key={categoryId} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {category ? category.name : "Other"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryProducts.map((product) => (
                  <Card key={product.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{convertToRupiah(product.price)}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.categoryName}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => addToCart(product.id)}
                        disabled={product.stockQuantity === 0}
                      >
                        {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}