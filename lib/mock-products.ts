// Mock products data for development
export const mockProducts = [
  {
    id: "1",
    name: "Apple",
    price: "1.99",
    stockQuantity: 100,
    categoryId: "1",
    categoryName: "Fruits",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Banana",
    price: "0.99",
    stockQuantity: 150,
    categoryId: "1",
    categoryName: "Fruits",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Milk",
    price: "3.99",
    stockQuantity: 50,
    categoryId: "2",
    categoryName: "Dairy",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Bread",
    price: "2.49",
    stockQuantity: 30,
    categoryId: "3",
    categoryName: "Bakery",
    createdAt: new Date().toISOString(),
  },
];

export function getProductNameById(id: string): string {
  const product = mockProducts.find(p => p.id === id);
  return product ? product.name : `Product #${id}`;
}