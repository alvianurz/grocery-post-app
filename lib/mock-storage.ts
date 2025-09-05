// Shared mock storage for development
interface MockOrder {
  id: string;
  items: { productId: string; quantity: number; price: string }[];
  customerId: string;
  status: string;
  totalPrice: string;
  createdAt: Date;
}

export const mockStorage = {
  orders: [] as MockOrder[],
};