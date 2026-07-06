import { AsyncPipe } from '@angular/common';
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
import { ProductService } from '../products/services/product.service';
import { CategoryModel } from './models/category.model';
import { CategoryAction } from './state/category.action';
import {
  selectAllCategories,
  selectCategoriesError,
  selectCategoriesLoading,
  selectCategoriesSuccessMessage,
  selectSelectedCategory
} from './state/category.selector';

type CategoryModalMode = 'create' | 'edit' | 'details' | 'delete' | null;

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  readonly categories$ = this.store.select(selectAllCategories);
  readonly loading$ = this.store.select(selectCategoriesLoading);
  readonly error$ = this.store.select(selectCategoriesError);
  readonly successMessage$ = this.store.select(selectCategoriesSuccessMessage);
  readonly selectedCategory$ = this.store.select(selectSelectedCategory);
  modalMode: CategoryModalMode = null;
  deleteTarget: CategoryModel | null = null;
  deleteUsageCount: number | null = null;
  checkingUsage = false;
  private successMessageTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly destroyRef = inject(DestroyRef);

  readonly categoryForm = this.fb.nonNullable.group({
    id: this.fb.control<number | null>(null),
    name: ['', [Validators.required]],
    description: ['']
  });

  constructor(
    private readonly store: Store<AppState>,
    private readonly fb: FormBuilder,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(CategoryAction.getListCategories());

    this.store
      .select(selectCategoriesSuccessMessage)
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        if (this.successMessageTimer) {
          clearTimeout(this.successMessageTimer);
          this.successMessageTimer = null;
        }

        if (message) {
          this.successMessageTimer = setTimeout(() => {
            this.store.dispatch(CategoryAction.resetSuccessMessage());
          }, 5000);
        }
      });
  }

  openCreateModal(): void {
    this.resetForm();
    this.modalMode = 'create';
  }

  submitCategory(): void {
    this.categoryForm.markAllAsTouched();

    if (this.categoryForm.invalid) {
      return;
    }

    const { id, name, description } = this.categoryForm.getRawValue();
    const request = {
      name: name.trim(),
      description: description.trim()
    };

    if (id) {
      this.store.dispatch(
        CategoryAction.updateCategory({
          request: {
            id,
            ...request
          }
        })
      );
    } else {
      this.store.dispatch(CategoryAction.createCategory({ request }));
    }

    this.closeModal();
  }

  editCategory(category: CategoryModel): void {
    this.categoryForm.setValue({
      id: category.id,
      name: category.name,
      description: category.description ?? ''
    });
    this.modalMode = 'edit';
  }

  showCategoryDetails(id: number): void {
    this.modalMode = 'details';
    this.store.dispatch(CategoryAction.getCategoryDetail({ id }));
  }

  confirmDeleteCategory(category: CategoryModel): void {
    this.deleteTarget = category;
    this.deleteUsageCount = null;
    this.checkingUsage = true;
    this.modalMode = 'delete';

    this.productService
      .getListProducts({ category: category.id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.deleteUsageCount = response.data?.length ?? 0;
          this.checkingUsage = false;
        },
        error: () => {
          this.checkingUsage = false;
        }
      });
  }

  proceedDelete(): void {
    if (!this.deleteTarget) {
      return;
    }

    this.store.dispatch(CategoryAction.deleteCategory({ id: this.deleteTarget.id }));
    this.closeModal();
  }

  resetForm(): void {
    this.categoryForm.reset({
      id: null,
      name: '',
      description: ''
    });
  }

  isEditing(): boolean {
    return this.modalMode === 'edit';
  }

  closeModal(): void {
    this.modalMode = null;
    this.deleteTarget = null;
    this.deleteUsageCount = null;
    this.checkingUsage = false;
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

    this.store.dispatch(CategoryAction.resetCategoriesState());
    this.store.dispatch(CategoryAction.cancelCategoriesRequest());
  }
}
