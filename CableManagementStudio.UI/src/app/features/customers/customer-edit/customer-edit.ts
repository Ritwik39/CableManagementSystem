import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomerService } from '../../../core/services/customer.service';
import { PackageService } from '../../../core/services/package.service';

import { Customer } from '../../../core/models/customer';
import { Package } from '../../../core/models/package';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-edit.html',
  styleUrl: './customer-edit.css',
})
export class CustomerEdit implements OnInit {
  customerId!: number;

  customer: Customer = {
    customerId: 0,
    userId: 0,
    packageId: 0,
    name: '',
    mobile: '',
    address: '',
    connectionNumber: '',
    isActive: true,
  };

  packages: Package[] = [];

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private customerService: CustomerService,
    private packageService: PackageService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadPackages();
    this.loadCustomer();
  }

  // ==========================
  // Load Customer
  // ==========================

  loadCustomer(): void {
    this.loading = true;
    this.errorMessage = '';

    this.customerService.getCustomer(this.customerId).subscribe({
      next: (response: Customer) => {
        this.customer = {
          ...response,

          // Make sure packageId is a number
          packageId: Number(response.packageId),

          // Make sure other numeric values are numbers
          customerId: Number(response.customerId),
          userId: Number(response.userId),
        };

        console.log('Customer loaded:', this.customer);
        console.log('Selected Package ID:', this.customer.packageId);

        this.loading = false;
      },

      error: (error) => {
        console.error('Customer Load Error:', error);

        this.errorMessage = error.error?.message || 'Unable to load customer details.';

        this.loading = false;
      },
    });
  }

  // ==========================
  // Load Packages
  // ==========================

  loadPackages(): void {
    this.packageService.getPackages().subscribe({
      next: (response) => {
        this.packages = response.map((p) => ({
          ...p,
          packageId: Number(p.packageId),
        }));

        console.log('Packages:', this.packages);
        console.log('Current Customer Package:', this.customer.packageId);
      },

      error: (error) => {
        console.error('Package Load Error:', error);

        this.errorMessage = 'Unable to load packages.';
      },
    });
  }

  // ==========================
  // Update Customer
  // ==========================

  updateCustomer(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.customer.name ||
      !this.customer.mobile ||
      !this.customer.address ||
      !this.customer.connectionNumber ||
      !this.customer.packageId
    ) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.saving = true;

    this.customerService.updateCustomer(this.customer).subscribe({
      next: (response) => {
        console.log('Customer Updated:', response);

        this.saving = false;

        this.successMessage = 'Customer updated successfully.';

        setTimeout(() => {
          this.router.navigate(['/customers']);
        }, 1000);
      },

      error: (error) => {
        console.error('Customer Update Error:', error);

        this.saving = false;

        this.errorMessage = error.error?.message || 'Unable to update customer.';
      },
    });
  }

  // ==========================
  // Cancel
  // ==========================

  cancel(): void {
    this.router.navigate(['/customers']);
  }
}
