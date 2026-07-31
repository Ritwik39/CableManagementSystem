import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerListComponent implements OnInit {

  customers: Customer[] = [];

  loading = false;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {

    this.loading = true;

    this.customerService.getCustomers().subscribe({

      next: (response) => {

        this.customers = response;
        this.loading = false;

      },

      error: (error) => {

        console.error(error);
        this.loading = false;

      }

    });

  }

  addCustomer() {

    this.router.navigate(['/customers/add']);

  }

  editCustomer(id: number) {

    this.router.navigate(['/customers/edit', id]);

  }

  deleteCustomer(id: number) {

    if (!confirm('Delete this customer?')) {
      return;
    }

    this.customerService.deleteCustomer(id).subscribe({

      next: () => {

        this.loadCustomers();

      },

      error: (error) => {

        console.error(error);

      }

    });

  }

}