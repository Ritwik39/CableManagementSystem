import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ResetPasswordRequest } from '../../../core/models/reset-password-request';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordComponent implements OnInit {
  token = '';

  newPassword = '';
  confirmPassword = '';

  showNewPassword = false;
  showConfirmPassword = false;

  loading = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
    });
  }

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.token) {
      this.errorMessage =
        'Password reset link is invalid or has expired.';
      return;
    }

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage =
        'Please enter your new password and confirm it.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage =
        'Password must be at least 6 characters long.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage =
        'Passwords do not match.';
      return;
    }

    this.loading = true;

    const request: ResetPasswordRequest = {
      token: this.token,
      newPassword: this.newPassword,
    };

    this.authService.resetPassword(request).subscribe({
      next: (response: any) => {
        this.loading = false;

        this.successMessage =
          response?.message ||
          'Password changed successfully.';

        this.newPassword = '';
        this.confirmPassword = '';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },

      error: (error: any) => {
        this.loading = false;

        if (error?.status === 400) {
          this.errorMessage =
            error?.error?.message ||
            'Invalid or expired reset link.';
        } else if (error?.status === 404) {
          this.errorMessage =
            'User account could not be found.';
        } else {
          this.errorMessage =
            error?.error?.message ||
            'Unable to change password. Please try again.';
        }
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}