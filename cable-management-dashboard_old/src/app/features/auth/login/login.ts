import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  token: string;
  refreshToken: string;
  userId: number;
  fullName: string;
  userName: string;
  email: string;
  role: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly apiUrl = 'https://localhost:7177/api';

  username = '';
  password = '';

  loading = false;
  errorMessage = '';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(): void {
    this.loading = true;
    this.errorMessage = '';

    const request = {
      userName: this.username,
      password: this.password,
    };

    this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/Auth/login`, request).subscribe({
      next: (response) => {
        this.loading = false;

        if (!response.success) {
          this.errorMessage = response.message;
          return;
        }

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userName', response.data.userName);
        localStorage.setItem('fullName', response.data.fullName);

        this.router.navigate(['/dashboard']);
      },

      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid username or password';
      },
    });
  }
}
