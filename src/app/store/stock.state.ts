import { CategoryState } from '../features/categories/state/category.state';
import { ProductState } from '../features/products/state/product.state';
import { SupplierState } from '../features/suppliers/state/supplier.state';

export interface StockState {
  categories?: CategoryState;
  products?: ProductState;
  suppliers?: SupplierState;
}
