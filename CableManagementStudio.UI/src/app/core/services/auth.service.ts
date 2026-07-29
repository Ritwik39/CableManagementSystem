import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7177/api/Auth';

  login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/login`,
      request
    );
  }

}