import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PaymentService } from '../../../core/services/payment.service';
import { Payment } from '../../../core/models/payment';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.css',
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];

  loading = false;
  errorMessage = '';

  constructor(
    private paymentService: PaymentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.errorMessage = '';

    this.paymentService.getPayments().subscribe({
      next: (response) => {
        this.payments = response ?? [];
        this.loading = false;
      },

      error: (error) => {
        console.error('Payment API Error:', error);

        this.errorMessage = 'Unable to load payments.';
        this.loading = false;
      },
    });
  }

  refreshPayments(): void {
    this.loadPayments();
  }

  addPayment(): void {
    this.router.navigate(['/payments/add']);
  }
}
