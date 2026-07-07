export interface ProductModel {
  id: number;
  name: string;
  sku: string;
  weight: number;
  price: number;
  stock_quantity: number;
  category_name: string | null;
  supplier_name: string | null;
  is_heavy_and_cheap: boolean;
  is_low_stock: boolean;
  created_at: string | null;
  updated_at: string | null;
}
