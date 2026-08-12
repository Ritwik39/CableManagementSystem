import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { ForgotPasswordRequest } from '../models/forgot-password-request';
import { ResetPasswordRequest } from '../models/reset-password-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7177/api/Auth';

  // ==========================
  // LOGIN
  // ==========================

  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/login`,
      request
    );
  }

  // ==========================
  // REGISTER
  // ==========================

  register(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/register`,
      request
    );
  }

  // ==========================
  // FORGOT PASSWORD
  // ==========================

  forgotPassword(
    request: ForgotPasswordRequest
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/forgot-password`,
      request
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/reset-password`,
    request
  );
}

  // ==========================
  // LOGOUT
  // ==========================

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');

    console.log('Refresh Token:', refreshToken);

    return this.http.post(
      `${this.apiUrl}/logout`,
      {
        refreshToken: refreshToken,
      }
    );
  }

  // ==========================
  // SAVE USER
  // ==========================

  saveUser(response: any): void {
    localStorage.setItem(
      'token',
      response.data.token
    );

    localStorage.setItem(
      'username',
      response.data.userName
    );

    localStorage.setItem(
      'fullName',
      response.data.fullName
    );

    localStorage.setItem(
      'role',
      response.data.role
    );

    localStorage.setItem(
      'refreshToken',
      response.data.refreshToken
    );
  }

  // ==========================
  // GET TOKEN
  // ==========================

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ==========================
  // LOGIN STATUS
  // ==========================

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}