import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  selectedMenu = 'Dashboard';

  totalCustomers = 3;
  activeCustomers = 3;
  totalPackages = 1;
  totalPayments = 2;

  recentCustomers = [
    {
      customerId: 1,
      name: 'Somnath Laude',
      mobile: '1234567890',
      connectionNumber: 'CN00123',
      isActive: true
    },
    {
      customerId: 2,
      name: 'Priya Saha',
      mobile: '0987563572',
      connectionNumber: 'CN0045',
      isActive: true
    },
    {
      customerId: 3,
      name: 'Rahul Sen',
      mobile: '9876543211',
      connectionNumber: 'CN0099',
      isActive: true
    }
  ];

  recentPayments = [
    {
      paymentId: 1,
      customerId: 2,
      amount: 499,
      paymentMode: 'UPI',
      status: 'Paid'
    },
    {
      paymentId: 2,
      customerId: 1,
      amount: 499,
      paymentMode: 'Cash',
      status: 'Paid'
    }
  ];

  selectMenu(menu: string): void {
    this.selectedMenu = menu;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    alert('Logged out successfully');
  }
}