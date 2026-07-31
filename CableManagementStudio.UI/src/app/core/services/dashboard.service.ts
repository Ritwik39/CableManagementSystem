import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  totalCustomers: number;
  activeCustomers: number;
  totalPackages: number;
  monthlyCollection: number;
  pendingPayments: number;
  recentPayments: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  // Change this to your backend URL
  private apiUrl = 'https://localhost:5001/api/dashboard';

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl);
  }

}