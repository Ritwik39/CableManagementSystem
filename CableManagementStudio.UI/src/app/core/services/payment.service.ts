import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7177/api/Payment';

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  getPaymentsByCustomer(customerId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  addPayment(paymentData: {
    customerId: number;
    amount: number;
    paymentMode: string;
    remarks?: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, paymentData);
  }
}
