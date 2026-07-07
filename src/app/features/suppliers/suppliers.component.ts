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
import { ProductService } from '../products/services/product.service';
import { SupplierModel } from './models/supplier.model';
import { SupplierSummaryModel } from './models/supplier-summary.model';
import { SupplierAction } from './state/supplier.action';
import {
  selectAllSuppliers,
  selectSelectedSupplier,
  selectSupplierSummary,
  selectSuppliersError,
  selectSuppliersLoading,
  selectSuppliersSuccessMessage
} from './state/supplier.selector';

type SupplierModalMode = 'create' | 'edit' | 'details' | 'delete' | null;

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, ReactiveFormsModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent implements OnInit, OnDestroy {
  readonly suppliers$ = this.store.select(selectAllSuppliers);
  readonly loading$ = this.store.select(selectSuppliersLoading);
  readonly error$ = this.store.select(selectSuppliersError);
  readonly successMessage$ = this.store.select(selectSuppliersSuccessMessage);
  readonly selectedSupplier$ = this.store.select(selectSelectedSupplier);
  readonly supplierSummary$ = this.store.select(selectSupplierSummary);
  modalMode: SupplierModalMode = null;
  deleteTarget: SupplierModel | null = null;
  deleteUsageCount: number | null = null;
  checkingUsage = false;
  supplierSummaryById: Record<number, SupplierSummaryModel> = {};
  private successMessageTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly destroyRef = inject(DestroyRef);

  readonly supplierForm = this.fb.nonNullable.group({
    id: this.fb.control<number | null>(null),
    company_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    country: ['', [Validators.required]]
  });

  constructor(
    private readonly store: Store<AppState>,
    private readonly fb: FormBuilder,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(SupplierAction.getListSuppliers());
    this.store.dispatch(SupplierAction.getSupplierSummary());

    this.supplierSummary$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((summaries) => {
        this.supplierSummaryById = summaries.reduce<Record<number, SupplierSummaryModel>>(
          (summaryById, summary) => ({
            ...summaryById,
            [summary.supplier_id]: summary
          }),
          {}
        );
      });

    this.store
      .select(selectSuppliersSuccessMessage)
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        if (this.successMessageTimer) {
          clearTimeout(this.successMessageTimer);
          this.successMessageTimer = null;
        }

        if (message) {
          this.successMessageTimer = setTimeout(() => {
            this.store.dispatch(SupplierAction.resetSuccessMessage());
          }, 5000);
        }
      });
  }

  openCreateModal(): void {
    this.resetForm();
    this.modalMode = 'create';
  }

  submitSupplier(): void {
    this.supplierForm.markAllAsTouched();

    if (this.supplierForm.invalid) {
      return;
    }

    const { id, company_name, email, phone, country } = this.supplierForm.getRawValue();
    const request = {
      company_name: company_name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim()
    };

    if (id) {
      this.store.dispatch(
        SupplierAction.updateSupplier({
          request: {
            id,
            ...request
          }
        })
      );
    } else {
      this.store.dispatch(SupplierAction.createSupplier({ request }));
    }

    this.closeModal();
  }

  editSupplier(supplier: SupplierModel): void {
    this.supplierForm.setValue({
      id: supplier.id,
      company_name: supplier.company_name,
      email: supplier.email,
      phone: supplier.phone ?? '',
      country: supplier.country
    });
    this.modalMode = 'edit';
  }

  showSupplierDetails(id: number): void {
    this.modalMode = 'details';
    this.store.dispatch(SupplierAction.getSupplierDetail({ id }));
  }

  getSupplierSummary(supplierId: number): SupplierSummaryModel | undefined {
    return this.supplierSummaryById[supplierId];
  }

  confirmDeleteSupplier(supplier: SupplierModel): void {
    this.deleteTarget = supplier;
    this.deleteUsageCount = null;
    this.checkingUsage = true;
    this.modalMode = 'delete';

    this.productService
      .getListProducts({ supplier: supplier.id })
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

    this.store.dispatch(SupplierAction.deleteSupplier({ id: this.deleteTarget.id }));
    this.closeModal();
  }

  resetForm(): void {
    this.supplierForm.reset({
      id: null,
      company_name: '',
      email: '',
      phone: '',
      country: ''
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

    this.store.dispatch(SupplierAction.resetSuppliersState());
    this.store.dispatch(SupplierAction.cancelSuppliersRequest());
  }
}
