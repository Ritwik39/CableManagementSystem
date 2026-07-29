import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Customer } from '../../../core/models/customer';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList implements OnInit {
  private customerService = inject(CustomerService);

  customers: Customer[] = [];

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
  console.log('Calling API...');

  this.customerService.getCustomers().subscribe({
    next: (data) => {
      console.log('API Success:', data);
      console.log('Total Records:', data.length);

      this.customers = data;
    },
    error: (err) => {
      console.error('API Error:', err);
    },
  });
}
    
  
}
