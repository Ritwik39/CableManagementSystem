import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfileComponent implements OnInit {
  profile: any = null;

  loading = true;
  errorMessage = '';

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.customerService.getMyProfile().subscribe({
      next: (response) => {
        this.profile = response;

        this.loading = false;
      },

      error: (error) => {
        console.error('My Profile Error:', error);

        this.errorMessage = error.error?.message || 'Unable to load your profile.';

        this.loading = false;
      },
    });
  }
}
