import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
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
  refreshToken?: string;
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

interface CreateCustomerRequest {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
  connectionNumber: string;
  packageId: number;
}

interface UpdateCustomerRequest {
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
  remarks?: string | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly apiUrl = 'https://localhost:7177/api';

  isLoggedIn = false;
  authMode: 'login' | 'register' = 'login';

  authLoading = false;
  pageLoading = false;

  authErrorMessage = '';
  authSuccessMessage = '';
  errorMessage = '';
  successMessage = '';

  currentUserName = 'Admin';
  currentUserRole = '';

  selectedMenu:
    | 'Dashboard'
    | 'Customers'
    | 'Packages'
    | 'Payments' = 'Dashboard';

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

  customerSearch = '';
  packageSearch = '';
  paymentSearch = '';

  showCustomerForm = false;
  editingCustomerId: number | null = null;

  createCustomerForm: CreateCustomerRequest =
    this.getEmptyCreateCustomerForm();

  updateCustomerForm: UpdateCustomerRequest =
    this.getEmptyUpdateCustomerForm();

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    this.isLoggedIn = true;

    this.currentUserName =
      localStorage.getItem('fullName') ??
      localStorage.getItem('userName') ??
      'Admin';

    this.currentUserRole =
      localStorage.getItem('role') ?? '';

    this.loadDashboardData();
  }

  // ============================================================
  // Authentication
  // ============================================================

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

    const request: LoginRequest = {
      userName: this.loginForm.userName.trim(),
      password: this.loginForm.password
    };

    if (!request.userName || !request.password.trim()) {
      this.authErrorMessage =
        'Please enter username and password.';
      return;
    }

    this.authLoading = true;

    this.http
      .post<ApiResponse<LoginData>>(
        `${this.apiUrl}/Auth/login`,
        request
      )
      .subscribe({
        next: response => {
          this.authLoading = false;

          if (!response.success || !response.data?.token) {
            this.authErrorMessage =
              response.message || 'Login failed.';
            return;
          }

          this.saveLoginData(response.data);

          this.currentUserName =
            response.data.fullName ||
            response.data.userName;

          this.currentUserRole =
            response.data.role;

          this.isLoggedIn = true;
          this.selectedMenu = 'Dashboard';

          this.loginForm = {
            userName: '',
            password: ''
          };

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

    const request: RegisterRequest = {
      fullName: this.registerForm.fullName.trim(),
      userName: this.registerForm.userName.trim(),
      email: this.registerForm.email.trim(),
      password: this.registerForm.password
    };

    if (
      !request.fullName ||
      !request.userName ||
      !request.email ||
      !request.password.trim()
    ) {
      this.authErrorMessage =
        'Please fill all registration fields.';
      return;
    }

    this.authLoading = true;

    this.http
      .post<ApiResponse<object>>(
        `${this.apiUrl}/Auth/register`,
        request
      )
      .subscribe({
        next: response => {
          this.authLoading = false;

          if (!response.success) {
            this.authErrorMessage =
              response.message ||
              'Registration failed.';
            return;
          }

          this.authSuccessMessage =
            response.message ||
            'Registration successful. Please login.';

          this.loginForm = {
            userName: request.userName,
            password: ''
          };

          this.registerForm = {
            fullName: '',
            userName: '',
            email: '',
            password: ''
          };

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
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');

    this.isLoggedIn = false;
    this.authMode = 'login';

    this.currentUserName = 'Admin';
    this.currentUserRole = '';

    this.customers = [];
    this.packages = [];
    this.payments = [];

    this.selectedMenu = 'Dashboard';

    this.loginForm = {
      userName: '',
      password: ''
    };

    this.clearAllMessages();
  }

  // ============================================================
  // Navigation
  // ============================================================

  selectMenu(
    menu: 'Dashboard' | 'Customers' | 'Packages' | 'Payments'
  ): void {
    this.selectedMenu = menu;
    this.clearPageMessages();

    if (menu === 'Customers') {
      this.loadCustomers();
    }

    if (menu === 'Packages') {
      this.loadPackages();
    }

    if (menu === 'Payments') {
      this.loadPayments();
    }
  }

  // ============================================================
  // Dashboard data
  // ============================================================

  loadDashboardData(): void {
    this.loadCustomers();
    this.loadPackages();
    this.loadPayments();
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
    return [...this.customers]
      .sort(
        (first, second) =>
          second.customerId - first.customerId
      )
      .slice(0, 5);
  }

  get recentPayments(): Payment[] {
    return [...this.payments]
      .sort(
        (first, second) =>
          second.paymentId - first.paymentId
      )
      .slice(0, 5);
  }

  // ============================================================
  // Customer API
  // ============================================================

  loadCustomers(): void {
    this.pageLoading = true;

    this.http
      .get<Customer[] | ApiResponse<Customer[]>>(
        `${this.apiUrl}/Customer`,
        { headers: this.getAuthorizationHeaders() }
      )
      .subscribe({
        next: response => {
          this.customers =
            this.extractArrayData<Customer>(response);

          this.pageLoading = false;
        },
        error: error => {
          this.pageLoading = false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to load customers.'
            );

          this.handleUnauthorized(error);
        }
      });
  }

  openAddCustomerForm(): void {
    this.editingCustomerId = null;
    this.createCustomerForm =
      this.getEmptyCreateCustomerForm();

    this.showCustomerForm = true;
    this.selectedMenu = 'Customers';
    this.clearPageMessages();
  }

  addCustomer(): void {
    this.clearPageMessages();

    const request: CreateCustomerRequest = {
      fullName:
        this.createCustomerForm.fullName.trim(),
      userName:
        this.createCustomerForm.userName.trim(),
      email:
        this.createCustomerForm.email.trim(),
      password:
        this.createCustomerForm.password,
      mobile:
        this.createCustomerForm.mobile.trim(),
      address:
        this.createCustomerForm.address.trim(),
      connectionNumber:
        this.createCustomerForm.connectionNumber.trim(),
      packageId:
        Number(this.createCustomerForm.packageId)
    };

    if (
      !request.fullName ||
      !request.userName ||
      !request.email ||
      !request.password.trim() ||
      !request.mobile ||
      !request.connectionNumber ||
      request.packageId <= 0
    ) {
      this.errorMessage =
        'Please fill all required customer fields.';
      return;
    }

    this.pageLoading = true;

    this.http
      .post<ApiResponse<object> | object>(
        `${this.apiUrl}/Customer`,
        request,
        { headers: this.getAuthorizationHeaders() }
      )
      .subscribe({
        next: response => {
          this.pageLoading = false;

          this.successMessage =
            this.extractMessage(
              response,
              'Customer added successfully.'
            );

          this.cancelCustomerForm();
          this.loadCustomers();
        },
        error: error => {
          this.pageLoading = false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to add customer.'
            );

          this.handleUnauthorized(error);
        }
      });
  }

  openEditCustomerForm(customer: Customer): void {
    this.editingCustomerId =
      customer.customerId;

    this.updateCustomerForm = {
      customerId: customer.customerId,
      userId: customer.userId,
      packageId: customer.packageId,
      name: customer.name,
      mobile: customer.mobile,
      address: customer.address,
      connectionNumber:
        customer.connectionNumber,
      isActive: customer.isActive
    };

    this.showCustomerForm = true;
    this.selectedMenu = 'Customers';
    this.clearPageMessages();
  }

  updateCustomer(): void {
    if (this.editingCustomerId === null) {
      this.errorMessage =
        'No customer selected for update.';
      return;
    }

    this.clearPageMessages();

    const request: UpdateCustomerRequest = {
      customerId: this.editingCustomerId,
      userId:
        Number(this.updateCustomerForm.userId),
      packageId:
        Number(this.updateCustomerForm.packageId),
      name:
        this.updateCustomerForm.name.trim(),
      mobile:
        this.updateCustomerForm.mobile.trim(),
      address:
        this.updateCustomerForm.address.trim(),
      connectionNumber:
        this.updateCustomerForm.connectionNumber.trim(),
      isActive:
        this.updateCustomerForm.isActive
    };

    if (
      !request.name ||
      !request.mobile ||
      !request.connectionNumber ||
      request.packageId <= 0
    ) {
      this.errorMessage =
        'Please fill all required update fields.';
      return;
    }

    this.pageLoading = true;

    this.http
      .put<ApiResponse<object> | object>(
        `${this.apiUrl}/Customer/${this.editingCustomerId}`,
        request,
        { headers: this.getAuthorizationHeaders() }
      )
      .subscribe({
        next: response => {
          this.pageLoading = false;

          this.successMessage =
            this.extractMessage(
              response,
              'Customer updated successfully.'
            );

          this.cancelCustomerForm();
          this.loadCustomers();
        },
        error: error => {
          this.pageLoading = false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to update customer.'
            );

          this.handleUnauthorized(error);
        }
      });
  }

  deleteCustomer(customer: Customer): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${customer.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.clearPageMessages();
    this.pageLoading = true;

    this.http
      .delete<ApiResponse<object> | object>(
        `${this.apiUrl}/Customer/${customer.customerId}`,
        { headers: this.getAuthorizationHeaders() }
      )
      .subscribe({
        next: response => {
          this.pageLoading = false;

          this.successMessage =
            this.extractMessage(
              response,
              'Customer deleted successfully.'
            );

          this.loadCustomers();
        },
        error: error => {
          this.pageLoading = false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to delete customer.'
            );

          this.handleUnauthorized(error);
        }
      });
  }

  submitCustomerForm(): void {
    if (this.editingCustomerId === null) {
      this.addCustomer();
      return;
    }

    this.updateCustomer();
  }

  cancelCustomerForm(): void {
    this.showCustomerForm = false;
    this.editingCustomerId = null;

    this.createCustomerForm =
      this.getEmptyCreateCustomerForm();

    this.updateCustomerForm =
      this.getEmptyUpdateCustomerForm();
  }

  // ============================================================
  // Package API
  // ============================================================

  loadPackages(): void {
    this.http
      .get<CablePackage[] | ApiResponse<CablePackage[]>>(
        `${this.apiUrl}/Package`,
        { headers: this.getAuthorizationHeaders() }
      )
      .subscribe({
        next: response => {
          this.packages =
            this.extractArrayData<CablePackage>(response);
        },
        error: error => {
          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to load packages.'
            );

          this.handleUnauthorized(error);
        }
      });
  }

  // ============================================================
  // Payment API
  // ============================================================

  loadPayments(): void {
    this.http
      .get<Payment[] | ApiResponse<Payment[]>>(
        `${this.apiUrl}/Payment`,
        { headers: this.getAuthorizationHeaders() }
      )
      .subscribe({
        next: response => {
          this.payments =
            this.extractArrayData<Payment>(response);
        },
        error: error => {
          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to load payments.'
            );

          this.handleUnauthorized(error);
        }
      });
  }

  // ============================================================
  // Search and display helpers
  // ============================================================

  get filteredCustomers(): Customer[] {
    const search =
      this.customerSearch.trim().toLowerCase();

    if (!search) {
      return this.customers;
    }

    return this.customers.filter(customer =>
      customer.name.toLowerCase().includes(search) ||
      customer.mobile.toLowerCase().includes(search) ||
      customer.address.toLowerCase().includes(search) ||
      customer.connectionNumber
        .toLowerCase()
        .includes(search)
    );
  }

  get filteredPackages(): CablePackage[] {
    const search =
      this.packageSearch.trim().toLowerCase();

    if (!search) {
      return this.packages;
    }

    return this.packages.filter(packageItem =>
      packageItem.packageName
        .toLowerCase()
        .includes(search) ||
      packageItem.price
        .toString()
        .includes(search) ||
      packageItem.speedMbps
        .toString()
        .includes(search)
    );
  }

  get filteredPayments(): Payment[] {
    const search =
      this.paymentSearch.trim().toLowerCase();

    if (!search) {
      return this.payments;
    }

    return this.payments.filter(payment =>
      payment.paymentId
        .toString()
        .includes(search) ||
      this.getCustomerName(payment.customerId)
        .toLowerCase()
        .includes(search) ||
      payment.paymentMode
        .toLowerCase()
        .includes(search) ||
      payment.status
        .toLowerCase()
        .includes(search)
    );
  }

  getCustomerName(customerId: number): string {
    return (
      this.customers.find(
        customer =>
          customer.customerId === customerId
      )?.name ?? `Customer #${customerId}`
    );
  }

  getPackageName(packageId: number): string {
    return (
      this.packages.find(
        packageItem =>
          packageItem.packageId === packageId
      )?.packageName ?? `Package #${packageId}`
    );
  }

  // ============================================================
  // Private helpers
  // ============================================================

  private saveLoginData(data: LoginData): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem(
      'userId',
      data.userId.toString()
    );
    localStorage.setItem(
      'fullName',
      data.fullName
    );
    localStorage.setItem(
      'userName',
      data.userName
    );
    localStorage.setItem(
      'role',
      data.role
    );

    if (data.refreshToken) {
      localStorage.setItem(
        'refreshToken',
        data.refreshToken
      );
    }
  }

  private getAuthorizationHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set(
        'Authorization',
        `Bearer ${token}`
      );
    }

    return headers;
  }

  private extractArrayData<T>(
    response: T[] | ApiResponse<T[]>
  ): T[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (
      response &&
      typeof response === 'object' &&
      'data' in response &&
      Array.isArray(response.data)
    ) {
      return response.data;
    }

    return [];
  }

  private extractMessage(
    response: unknown,
    fallback: string
  ): string {
    if (
      response &&
      typeof response === 'object' &&
      'message' in response
    ) {
      const message = (
        response as { message?: unknown }
      ).message;

      if (typeof message === 'string') {
        return message;
      }
    }

    return fallback;
  }

  private handleUnauthorized(
    error: HttpErrorResponse
  ): void {
    if (error.status === 401) {
      this.logout();
      this.authErrorMessage =
        'Your login session has expired. Please login again.';
    }

    if (error.status === 403) {
      this.errorMessage =
        'You do not have permission to perform this action.';
    }
  }

  private clearAuthMessages(): void {
    this.authErrorMessage = '';
    this.authSuccessMessage = '';
  }

  private clearPageMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private clearAllMessages(): void {
    this.clearAuthMessages();
    this.clearPageMessages();
  }

  private getErrorMessage(
    error: HttpErrorResponse,
    fallback: string
  ): string {
    const errorBody = error.error;

    if (typeof errorBody === 'string') {
      return errorBody;
    }

    return (
      errorBody?.message ??
      errorBody?.Message ??
      errorBody?.title ??
      fallback
    );
  }

  private getEmptyCreateCustomerForm():
    CreateCustomerRequest {
    return {
      fullName: '',
      userName: '',
      email: '',
      password: '',
      mobile: '',
      address: '',
      connectionNumber: '',
      packageId: 1
    };
  }

  private getEmptyUpdateCustomerForm():
    UpdateCustomerRequest {
    return {
      customerId: 0,
      userId: 0,
      packageId: 1,
      name: '',
      mobile: '',
      address: '',
      connectionNumber: '',
      isActive: true
    };
  }
}