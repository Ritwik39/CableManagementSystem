import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface SummaryCard {
  title: string;
  value: string;
  description: string;
}

interface Payment {
  customer: string;
  packageName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  cards: SummaryCard[] = [
    {
      title: 'Total Customers',
      value: '245',
      description: '+12 this month'
    },
    {
      title: 'Active Connections',
      value: '220',
      description: '89.8% active'
    },
    {
      title: 'Monthly Revenue',
      value: '₹1,42,500',
      description: '+8.4% this month'
    },
    {
      title: 'Pending Payments',
      value: '25',
      description: 'Requires attention'
    }
  ];

  recentPayments: Payment[] = [
    {
      customer: 'Priya Saha',
      packageName: 'Premium HD',
      amount: 650,
      date: '16 Jul 2026',
      status: 'Paid'
    },
    {
      customer: 'Rahul Das',
      packageName: 'Family Pack',
      amount: 500,
      date: '15 Jul 2026',
      status: 'Pending'
    },
    {
      customer: 'Ananya Roy',
      packageName: 'Basic Pack',
      amount: 350,
      date: '15 Jul 2026',
      status: 'Paid'
    }
  ];
}