export type PageId = 'prediction';
export type Theme = 'light' | 'dark';
export interface Row {
  orderId: string;
  orderDate: string;
  customerId: string;
  customer: string;
  segment: string;
  region: string;
  state: string;
  city: string;
  product: string;
  category: string;
  subCategory: string;
  sales: number;
  quantity: number;
  discount: number;
  profit: number;
  shipMode: string;
}
export interface Filters {
  year: string;
  region: string;
  category: string;
  segment: string;
  shipMode: string;
}
