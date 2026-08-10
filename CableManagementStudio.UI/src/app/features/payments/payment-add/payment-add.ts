import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { PaymentService } from '../../../core/services/payment.service';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer';

@Component({
  selector: 'app-payment-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment-add.html',
  styleUrl: './payment-add.css',
})
export class PaymentAddComponent implements OnInit {
  customers: Customer[] = [];

  loading = false;
  submitting = false;
  errorMessage = '';

  paymentData = {
    customerId: 0,
    amount: 0,
    paymentMode: '',
    remarks: '',
  };

  constructor(
    private paymentService: PaymentService,
    private customerService: CustomerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log('Payment Add Component Loaded');

    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.customerService.getCustomers().subscribe({
      next: (response) => {
        console.log('Customers loaded:', response);

        this.customers = response ?? [];
        this.loading = false;
      },

      error: (error) => {
        console.error('Unable to load customers:', error);

        this.errorMessage = 'Unable to load customers.';
        this.loading = false;
      },
    });
  }

  addPayment(): void {
    this.errorMessage = '';

    if (!this.paymentData.customerId) {
      this.errorMessage = 'Please select a customer.';
      return;
    }

    if (!this.paymentData.amount || this.paymentData.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount.';
      return;
    }

    if (!this.paymentData.paymentMode) {
      this.errorMessage = 'Please select a payment mode.';
      return;
    }

    this.submitting = true;

    this.paymentService.addPayment(this.paymentData).subscribe({
      next: (response) => {
        console.log('Payment added successfully:', response);

        this.submitting = false;
        this.router.navigate(['/payments']);
      },

      error: (error) => {
        console.error('Payment add error:', error);

        this.errorMessage = error.error?.message || 'Unable to add payment. Please try again.';

        this.submitting = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/payments']);
  }
}
