import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ForgotPasswordRequest } from '../../../core/models/forgot-password-request';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  email = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // ==========================
  // FORGOT PASSWORD
  // ==========================

  submitForgotPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.loading = true;

    const request: ForgotPasswordRequest = {
      email: this.email.trim(),
    };

    this.authService.forgotPassword(request).subscribe({
      next: (response: any) => {
  this.loading = false;

  this.successMessage =
    response?.message ||
    'Email verified successfully.';

  const token =
    response?.data?.token ||
    response?.token;

  if (token) {
    setTimeout(() => {
      this.router.navigate(
        ['/reset-password'],
        {
          queryParams: {
            token: token,
          },
        },
      );
    }, 1000);
  }
},

      error: (error: any) => {
        this.loading = false;

        if (error?.status === 404) {
          this.errorMessage =
            'Email address not found.';
        } else if (error?.status === 400) {
          this.errorMessage =
            error?.error?.message ||
            'Invalid request.';
        } else {
          this.errorMessage =
            error?.error?.message ||
            'Unable to process your request. Please try again.';
        }
      },
    });
  }

  // ==========================
  // BACK TO LOGIN
  // ==========================

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}