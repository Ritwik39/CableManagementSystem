import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface LoginRequest {
  userName: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  userName: string;
  email: string;
  password: string;
}

interface LoginData {
  userId: number;
  fullName: string;
  userName: string;
  email: string;
  role: string;
  isActive: boolean;
  token: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Customer {
  customerId: number;
  userId: number;
  packageId: number;
  name: string;
  mobile: string;
  address: string;
  connectionNumber: string;
  isActive: boolean;
}

interface CablePackage {
  packageId: number;
  packageName: string;
  price: number;
  speedMbps: number;
}

interface Payment {
  paymentId: number;
  customerId: number;
  amount: number;
  paymentDate: string;
  paymentMode: string;
  status: string;
  remarks?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly apiUrl = 'https://localhost:7177/api';

  isLoggedIn = false;
  authMode: 'login' | 'register' = 'login';

  authLoading = false;
  authErrorMessage = '';
  authSuccessMessage = '';

  currentUserName = 'Admin';
  currentUserRole = '';

  selectedMenu = 'Dashboard';

  loginForm: LoginRequest = {
    userName: '',
    password: ''
  };

  registerForm: RegisterRequest = {
    fullName: '',
    userName: '',
    email: '',
    password: ''
  };

  customers: Customer[] = [];
  packages: CablePackage[] = [];
  payments: Payment[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.isLoggedIn = true;
      this.currentUserName =
        localStorage.getItem('userName') ?? 'Admin';
      this.currentUserRole =
        localStorage.getItem('role') ?? '';

      this.loadDashboardData();
    }
  }

  showLogin(): void {
    this.authMode = 'login';
    this.clearAuthMessages();
  }

  showRegister(): void {
    this.authMode = 'register';
    this.clearAuthMessages();
  }

  login(): void {
    this.clearAuthMessages();

    if (
      !this.loginForm.userName.trim() ||
      !this.loginForm.password.trim()
    ) {
      this.authErrorMessage =
        'Please enter username and password.';
      return;
    }

    this.authLoading = true;

    this.http
      .post<ApiResponse<LoginData>>(
        `${this.apiUrl}/Auth/login`,
        this.loginForm
      )
      .subscribe({
        next: response => {
          this.authLoading = false;

          if (!response.success || !response.data?.token) {
            this.authErrorMessage =
              response.message || 'Login failed.';
            return;
          }

          localStorage.setItem(
            'token',
            response.data.token
          );

          localStorage.setItem(
            'userName',
            response.data.userName
          );

          localStorage.setItem(
            'role',
            response.data.role
          );

          this.currentUserName =
            response.data.fullName ||
            response.data.userName;

          this.currentUserRole = response.data.role;
          this.isLoggedIn = true;
          this.selectedMenu = 'Dashboard';

          this.loadDashboardData();
        },
        error: error => {
          this.authLoading = false;
          this.authErrorMessage =
            this.getErrorMessage(
              error,
              'Invalid username or password.'
            );
        }
      });
  }

  register(): void {
    this.clearAuthMessages();

    if (
      !this.registerForm.fullName.trim() ||
      !this.registerForm.userName.trim() ||
      !this.registerForm.email.trim() ||
      !this.registerForm.password.trim()
    ) {
      this.authErrorMessage =
        'Please fill all registration fields.';
      return;
    }

    this.authLoading = true;

    this.http
      .post<ApiResponse<object>>(
        `${this.apiUrl}/Auth/register`,
        this.registerForm
      )
      .subscribe({
        next: response => {
          this.authLoading = false;

          if (!response.success) {
            this.authErrorMessage =
              response.message || 'Registration failed.';
            return;
          }

          this.authSuccessMessage =
            response.message ||
            'Registration successful. Please login.';

          const registeredUserName =
            this.registerForm.userName;

          this.registerForm = {
            fullName: '',
            userName: '',
            email: '',
            password: ''
          };

          this.loginForm.userName =
            registeredUserName;

          this.authMode = 'login';
        },
        error: error => {
          this.authLoading = false;
          this.authErrorMessage =
            this.getErrorMessage(
              error,
              'Unable to register.'
            );
        }
      });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');

    this.isLoggedIn = false;
    this.currentUserName = 'Admin';
    this.currentUserRole = '';
    this.authMode = 'login';

    this.loginForm = {
      userName: '',
      password: ''
    };

    this.clearAuthMessages();
  }

  selectMenu(menu: string): void {
    this.selectedMenu = menu;
  }

  loadDashboardData(): void {
    /*
     * Call your real APIs here after adding the
     * Authorization header/interceptor.
     *
     * Example methods:
     * this.loadCustomers();
     * this.loadPackages();
     * this.loadPayments();
     */

    this.loadSampleData();
  }

  private loadSampleData(): void {
    this.customers = [
      {
        customerId: 1,
        userId: 5015,
        packageId: 1,
        name: 'Somnath Laude',
        mobile: '1234567890',
        address: 'Kolkata',
        connectionNumber: 'CN00123',
        isActive: true
      },
      {
        customerId: 2,
        userId: 5016,
        packageId: 1,
        name: 'Priya Saha',
        mobile: '0987563572',
        address: 'Kolkata',
        connectionNumber: 'CN0045',
        isActive: true
      }
    ];

    this.packages = [
      {
        packageId: 1,
        packageName: 'Basic Plan',
        price: 499,
        speedMbps: 50
      }
    ];

    this.payments = [
      {
        paymentId: 1,
        customerId: 2,
        amount: 499,
        paymentDate: '2026-07-16',
        paymentMode: 'UPI',
        status: 'Paid',
        remarks: 'Monthly payment'
      }
    ];
  }

  get totalCustomers(): number {
    return this.customers.length;
  }

  get activeCustomers(): number {
    return this.customers.filter(
      customer => customer.isActive
    ).length;
  }

  get totalPackages(): number {
    return this.packages.length;
  }

  get totalPayments(): number {
    return this.payments.length;
  }

  get recentCustomers(): Customer[] {
    return this.customers.slice(-5).reverse();
  }

  get recentPayments(): Payment[] {
    return this.payments.slice(-5).reverse();
  }

  getCustomerName(customerId: number): string {
    return (
      this.customers.find(
        customer =>
          customer.customerId === customerId
      )?.name ?? 'Unknown'
    );
  }

  private clearAuthMessages(): void {
    this.authErrorMessage = '';
    this.authSuccessMessage = '';
  }

  private getErrorMessage(
    error: HttpErrorResponse,
    fallback: string
  ): string {
    return (
      error.error?.message ??
      error.error?.Message ??
      fallback
    );
  }

  /*
   * Keep your existing customer add, update,
   * delete, package and payment methods here.
   */
}