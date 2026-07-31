import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  AuthService,
  LoginRequest,
  RegisterRequest
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  // ==========================
  // Tabs
  // ==========================

  selectedTab: 'login' | 'register' = 'login';

  // ==========================
  // Login Model
  // ==========================

  username = '';
  password = '';

  // ==========================
  // Register Model
  // ==========================

  fullName = '';
  registerUsername = '';
  email = '';
  registerPassword = '';
  confirmPassword = '';

  // ==========================
  // Password Visibility
  // ==========================

  showLoginPassword = false;
  showRegisterPassword = false;
  showConfirmPassword = false;

  // ==========================
  // Loading
  // ==========================

  loading = false;

  // ==========================
  // Messages
  // ==========================

  loginError = '';
  registerError = '';
 registerSuccess = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // ==========================
  // Change Tabs
  // ==========================

  changeTab(tab: 'login' | 'register') {

    this.selectedTab = tab;

    this.loginError = '';
    this.registerError = '';
    this.registerSuccess = '';

  }

  // ==========================
  // LOGIN
  // ==========================

  login(): void {

    this.loginError = '';

    if (!this.username || !this.password) {

      this.loginError = 'Please enter Username and Password.';
      return;

    }

    this.loading = true;

    const request: LoginRequest = {

      username: this.username,
      password: this.password

    };

    this.authService.login(request).subscribe({

      next: (response) => {

        this.loading = false;

        this.authService.saveUser(response);

        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        this.loading = false;

        if (error.status === 401) {

          this.loginError = 'Invalid Username or Password';

        }
        else {

          this.loginError = 'Unable to connect to server';

        }

      }

    });

  }

  // ==========================
  // REGISTER
  // ==========================

  register(): void {

    this.registerError = '';
    this.registerSuccess = '';

    if (
      !this.fullName ||
      !this.registerUsername ||
      !this.email ||
      !this.registerPassword ||
      !this.confirmPassword
    ) {

      this.registerError = 'Please fill all fields.';
      return;

    }

    if (this.registerPassword !== this.confirmPassword) {

      this.registerError = 'Passwords do not match.';
      return;

    }

    const request: RegisterRequest = {

      fullName: this.fullName,
      username: this.registerUsername,
      email: this.email,
      password: this.registerPassword

    };

    this.loading = true;

    this.authService.register(request).subscribe({

      next: () => {

        this.loading = false;

        this.registerSuccess = 'Registration Successful.';

        this.fullName = '';
        this.registerUsername = '';
        this.email = '';
        this.registerPassword = '';
        this.confirmPassword = '';

        setTimeout(() => {

          this.selectedTab = 'login';

        }, 1500);

      },

      error: () => {

        this.loading = false;

        this.registerError = 'Registration Failed';

      }

    });

  }

}