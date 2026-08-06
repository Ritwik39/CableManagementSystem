import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private customerApi = 'https://localhost:7177/api/Customer';
  private packageApi = 'https://localhost:7177/api/Package';
  private paymentApi = 'https://localhost:7177/api/Payment';

  constructor() { }

  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

  }

  getCustomers(): Observable<any[]> {

    return this.http.get<any[]>(
      this.customerApi,
      {
        headers: this.getHeaders()
      });

  }

  getPackages(): Observable<any[]> {

    return this.http.get<any[]>(
      this.packageApi,
      {
        headers: this.getHeaders()
      });

  }

  getPayments(): Observable<any[]> {

    return this.http.get<any[]>(
      this.paymentApi,
      {
        headers: this.getHeaders()
      });

  }

}