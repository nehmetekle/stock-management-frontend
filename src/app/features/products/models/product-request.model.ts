export interface ProductRequestModel {
  id?: number;
  name: string;
  sku: string;
  weight: number;
  price: number;
  stock_quantity: number;
  category_id: number;
  supplier_id: number;
}
