import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  // Change this to your .NET API URL
  private apiUrl = 'https://localhost:5001/api/Auth';

  constructor() { }

  login(request: LoginRequest): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      request
    );

  }

  register(request: RegisterRequest): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/register`,
      request
    );

  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');

  }

  saveUser(response: any): void {

    localStorage.setItem('token', response.token);
    localStorage.setItem('username', response.username);
    localStorage.setItem('fullName', response.fullName);
    localStorage.setItem('role', response.role);

  }

  getToken(): string | null {

    return localStorage.getItem('token');

  }

  isLoggedIn(): boolean {

    return this.getToken() != null;

  }

}