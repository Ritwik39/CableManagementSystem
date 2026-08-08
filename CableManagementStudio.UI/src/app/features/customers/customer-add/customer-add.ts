import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomerService } from '../../../core/services/customer.service';
import { PackageService } from '../../../core/services/package.service';

import { Package } from '../../../core/models/package';
import { CreateCustomerRequest } from '../../../core/models/create-customer-request';

@Component({
  selector: 'app-customer-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-add.html',
  styleUrl: './customer-add.css',
})
export class CustomerAddComponent implements OnInit {
  // ==========================
  // Form Fields
  // ==========================

  fullName = '';
  userName = '';
  email = '';
  password = '';

  mobile = '';
  address = '';
  connectionNumber = '';

  packageId: number | null = null;

  // ==========================
  // Packages
  // ==========================

  packages: Package[] = [];

  loadingPackages = true;

  // ==========================
  // Status
  // ==========================

  loading = false;

  errorMessage = '';

  successMessage = '';

  constructor(
    private customerService: CustomerService,
    private packageService: PackageService,
    private router: Router,
  ) {}

  // ==========================
  // INIT
  // ==========================

  ngOnInit(): void {
    this.loadPackages();
  }

  // ==========================
  // LOAD PACKAGES
  // ==========================

  loadPackages(): void {
    this.loadingPackages = true;

    this.packageService.getPackages().subscribe({
      next: (response) => {
        this.packages = response ?? [];

        this.loadingPackages = false;
      },

      error: (error) => {
        console.error('Package loading error:', error);

        this.errorMessage = 'Unable to load packages.';

        this.loadingPackages = false;
      },
    });
  }

  // ==========================
  // ADD CUSTOMER
  // ==========================

  addCustomer(): void {
    this.errorMessage = '';

    this.successMessage = '';

    // Validation

    if (
      !this.fullName.trim() ||
      !this.userName.trim() ||
      !this.email.trim() ||
      !this.password.trim() ||
      !this.mobile.trim() ||
      !this.address.trim() ||
      !this.connectionNumber.trim() ||
      this.packageId === null
    ) {
      this.errorMessage = 'Please fill all fields.';

      return;
    }

    this.loading = true;

    const request: CreateCustomerRequest = {
      fullName: this.fullName.trim(),

      userName: this.userName.trim(),

      email: this.email.trim(),

      password: this.password,

      mobile: this.mobile.trim(),

      address: this.address.trim(),

      connectionNumber: this.connectionNumber.trim(),

      packageId: this.packageId,
    };

    this.customerService.addCustomer(request as any).subscribe({
      next: (response) => {
        console.log('Customer created successfully:', response);

        this.loading = false;

        this.successMessage = 'Customer created successfully.';

        setTimeout(() => {
          this.router.navigate(['/customers']);
        }, 1000);
      },

      error: (error) => {
        console.error('Customer creation error:', error);

        this.loading = false;

        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.error?.Message) {
          this.errorMessage = error.error.Message;
        } else {
          this.errorMessage = 'Unable to create customer.';
        }
      },
    });
  }

  // ==========================
  // CANCEL
  // ==========================

  cancel(): void {
    this.router.navigate(['/customers']);
  }
}
