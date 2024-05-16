
// product.interface.ts
export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  sellerId: string;
  status: "sold" | "not sold";
}
  