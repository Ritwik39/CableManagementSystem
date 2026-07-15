import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerListComponent implements OnInit {

  customers: any[] = [];

  loading = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers() {

    this.loading = true;

    this.http.get<any[]>(
      'http://localhost:5229/api/customer'
    ).subscribe({

      next: (data) => {

        this.customers = data;

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

}