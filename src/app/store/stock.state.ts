import { CategoryState } from '../features/categories/state/category.state';
import { ProductState } from '../features/products/state/product.state';

export interface StockState {
  categories?: CategoryState;
  products?: ProductState;
}
