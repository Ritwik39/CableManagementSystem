import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CustomerService } from '../../../core/services/customer.service';
import { PackageService } from '../../../core/services/package.service';

import { Customer } from '../../../core/models/customer';
import { Package } from '../../../core/models/package';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];

  packages: Package[] = [];

  packageMap = new Map<number, string>();

  loading = false;

  constructor(
    private customerService: CustomerService,
    private packageService: PackageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log('Customer Component Loaded');

    this.loadPackages();

    this.loadCustomers();
  }

  loadCustomers(): void {
    console.log('Calling Customer API...');

    this.loading = true;

    this.customerService.getCustomers().subscribe({
      next: (response) => {
        console.log('Customers Response:', response);

        this.customers = response;

        console.log('Total Customers:', this.customers.length);

        this.loading = false;
      },

      error: (error) => {
        console.error('Customer API Error:', error);

        this.loading = false;
      },
    });
  }

  loadPackages(): void {
    console.log('Calling Package API...');

    this.packageService.getPackages().subscribe({
      next: (packages) => {
        console.log('Packages Response:', packages);

        this.packages = packages;

        packages.forEach((p) => {
          this.packageMap.set(p.packageId, p.packageName);
        });

        console.log('Package Map:', this.packageMap);
      },

      error: (error) => {
        console.error('Package API Error:', error);
      },
    });
  }

  addCustomer(): void {
    this.router.navigate(['/customers/add']);
  }

  editCustomer(id: number): void {
    this.router.navigate(['/customers/edit', id]);
  }

  deleteCustomer(id: number): void {
    if (!confirm('Delete this customer?')) {
      return;
    }

    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        console.log('Customer Deleted');

        this.loadCustomers();
      },

      error: (error) => {
        console.error(error);
      },
    });
  }
}
