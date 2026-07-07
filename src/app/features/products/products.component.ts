import { AsyncPipe, DecimalPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  HostListener,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppState } from '../../store/app.state';
import { CategoryModel } from '../categories/models/category.model';
import { CategoryAction } from '../categories/state/category.action';
import { selectAllCategories } from '../categories/state/category.selector';
import { SupplierModel } from '../suppliers/models/supplier.model';
import { SupplierAction } from '../suppliers/state/supplier.action';
import { selectAllSuppliers } from '../suppliers/state/supplier.selector';
import { ProductFilterModel } from './models/product-filter.model';
import { ProductModel } from './models/product.model';
import { ProductAction } from './state/product.action';
import {
  selectAllProducts,
  selectProductsError,
  selectProductsLoading,
  selectProductsSuccessMessage,
  selectSelectedProduct
} from './state/product.selector';

type ProductModalMode = 'create' | 'edit' | 'details' | 'delete' | null;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  readonly products$ = this.store.select(selectAllProducts);
  readonly loading$ = this.store.select(selectProductsLoading);
  readonly error$ = this.store.select(selectProductsError);
  readonly successMessage$ = this.store.select(selectProductsSuccessMessage);
  readonly selectedProduct$ = this.store.select(selectSelectedProduct);
  readonly categories$ = this.store.select(selectAllCategories);
  readonly suppliers$ = this.store.select(selectAllSuppliers);
  modalMode: ProductModalMode = null;
  deleteTarget: ProductModel | null = null;
  suppliers: SupplierModel[] = [];
  private categories: CategoryModel[] = [];
  private categoriesLoaded = false;
  private suppliersLoaded = false;
  private successMessageTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly destroyRef = inject(DestroyRef);

  readonly productForm = this.fb.nonNullable.group({
    id: this.fb.control<number | null>(null),
    name: ['', [Validators.required]],
    sku: ['', [Validators.required]],
    weight: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    price: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    stock_quantity: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    category_id: this.fb.control<number | null>(null, [Validators.required]),
    supplier_id: this.fb.control<number | null>(null, [Validators.required])
  });

  readonly filterForm = this.fb.nonNullable.group({
    category: this.fb.control<number | null>(null),
    supplier: this.fb.control<number | null>(null),
    maxPrice: this.fb.control<number | null>(null, [Validators.min(0.01)])
  });

  constructor(
    private readonly store: Store<AppState>,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.store.dispatch(ProductAction.getListProducts({}));
    this.store.dispatch(CategoryAction.getListCategories());
    this.store.dispatch(SupplierAction.getListSuppliers());

    this.suppliers$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((suppliers) => {
        this.suppliers = suppliers;
        this.suppliersLoaded = true;
      });

    this.categories$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => {
        this.categories = categories;
        this.categoriesLoaded = true;
      });

    this.store
      .select(selectProductsSuccessMessage)
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        if (this.successMessageTimer) {
          clearTimeout(this.successMessageTimer);
          this.successMessageTimer = null;
        }

        if (message) {
          this.successMessageTimer = setTimeout(() => {
            this.store.dispatch(ProductAction.resetSuccessMessage());
          }, 5000);
        }
      });
  }

  openCreateModal(): void {
    this.resetForm();
    this.modalMode = 'create';
  }

  applyProductFilters(): void {
    this.filterForm.markAllAsTouched();

    if (this.filterForm.invalid) {
      return;
    }

    this.store.dispatch(ProductAction.getListProducts({
      filters: this.getActiveProductFilters()
    }));
  }

  clearProductFilters(): void {
    this.filterForm.reset({
      category: null,
      supplier: null,
      maxPrice: null
    });
    this.store.dispatch(ProductAction.getListProducts({}));
  }

  hasActiveFilters(): boolean {
    const { category, supplier, maxPrice } = this.filterForm.getRawValue();

    return Boolean(category || supplier || maxPrice);
  }

  submitProduct(): void {
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid) {
      return;
    }

    const { id, name, sku, weight, price, stock_quantity, category_id, supplier_id } =
      this.productForm.getRawValue();
    const request = {
      name: name.trim(),
      sku: sku.trim(),
      weight: weight as number,
      price: price as number,
      stock_quantity: stock_quantity as number,
      category_id: category_id as number,
      supplier_id: supplier_id as number
    };

    if (id) {
      this.store.dispatch(
        ProductAction.updateProduct({
          request: {
            id,
            ...request
          }
        })
      );
    } else {
      this.store.dispatch(ProductAction.createProduct({ request }));
    }

    this.closeModal();
  }

  editProduct(product: ProductModel): void {
    const category = this.categories.find((c) => c.name === product.category_name);
    const supplier = this.suppliers.find((s) => s.company_name === product.supplier_name);

    this.productForm.setValue({
      id: product.id,
      name: product.name,
      sku: product.sku,
      weight: product.weight,
      price: product.price,
      stock_quantity: product.stock_quantity,
      category_id: category?.id ?? null,
      supplier_id: supplier?.id ?? null
    });
    this.modalMode = 'edit';
  }

  isCategoryOrphaned(categoryName: string | null): boolean {
    if (!this.categoriesLoaded || !categoryName) {
      return false;
    }

    return !this.categories.some((category) => category.name === categoryName);
  }

  isSupplierOrphaned(supplierName: string | null): boolean {
    if (!this.suppliersLoaded || !supplierName) {
      return false;
    }

    return !this.suppliers.some((supplier) => supplier.company_name === supplierName);
  }

  showProductDetails(id: number): void {
    this.modalMode = 'details';
    this.store.dispatch(ProductAction.getProductDetail({ id }));
  }

  confirmDeleteProduct(product: ProductModel): void {
    this.deleteTarget = product;
    this.modalMode = 'delete';
  }

  proceedDelete(): void {
    if (!this.deleteTarget) {
      return;
    }

    this.store.dispatch(ProductAction.deleteProduct({ id: this.deleteTarget.id }));
    this.closeModal();
  }

  resetForm(): void {
    this.productForm.reset({
      id: null,
      name: '',
      sku: '',
      weight: null,
      price: null,
      stock_quantity: null,
      category_id: null,
      supplier_id: null
    });
  }

  isEditing(): boolean {
    return this.modalMode === 'edit';
  }

  closeModal(): void {
    this.modalMode = null;
    this.deleteTarget = null;
    this.resetForm();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.modalMode) {
      this.closeModal();
    }
  }

  ngOnDestroy(): void {
    if (this.successMessageTimer) {
      clearTimeout(this.successMessageTimer);
      this.successMessageTimer = null;
    }

    this.store.dispatch(ProductAction.resetProductsState());
    this.store.dispatch(ProductAction.cancelProductsRequest());
  }

  private getActiveProductFilters(): ProductFilterModel | undefined {
    const { category, supplier, maxPrice } = this.filterForm.getRawValue();
    const filters: ProductFilterModel = {};

    if (category) {
      filters.category = category;
    }

    if (supplier) {
      filters.supplier = supplier;
    }

    if (maxPrice) {
      filters.maxPrice = maxPrice;
    }

    return Object.keys(filters).length ? filters : undefined;
  }
}
