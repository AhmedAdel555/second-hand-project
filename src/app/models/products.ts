export type cateoryType = "Electronics" | "Clothing" | "Books"| "Furniture"

// product.interface.ts
export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: cateoryType;
  sellerId: string;
  status: "sold" | "not sold";
}
  