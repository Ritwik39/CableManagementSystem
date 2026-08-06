import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private baseUrl = 'https://localhost:7177/api';

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Customer`);
  }

  getPackages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Package`);
  }

  getPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Payment`);
  }

}