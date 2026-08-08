import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Package } from '../models/package';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7177/api/Package';

  getPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(this.apiUrl);
  }

  getPackage(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.apiUrl}/${id}`);
  }

  addPackage(packageData: Package): Observable<Package> {
    return this.http.post<Package>(this.apiUrl, packageData);
  }

  updatePackage(packageData: Package): Observable<Package> {
    return this.http.put<Package>(`${this.apiUrl}/${packageData.packageId}`, packageData);
  }

  deletePackage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
