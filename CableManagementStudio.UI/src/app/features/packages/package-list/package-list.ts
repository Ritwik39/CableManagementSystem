import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PackageService } from '../../../core/services/package.service';
import { Package } from '../../../core/models/package';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-list.html',
  styleUrl: './package-list.css',
})
export class PackageList implements OnInit {
  private packageService = inject(PackageService);
  private router = inject(Router);

  packages: Package[] = [];

  loading = false;

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    console.log('Loading packages...');

    this.loading = true;

    this.packageService.getPackages().subscribe({
      next: (response: Package[]) => {
        console.log('Package API response:', response);

        this.packages = response;

        this.loading = false;
      },

      error: (error) => {
        console.error('Failed to load packages:', error);

        this.loading = false;
      },
    });
  }

  editPackage(id: number): void {
    console.log('Edit package:', id);

    this.router.navigate(['/packages/edit', id]);
  }

  deletePackage(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this package?');

    if (!confirmed) {
      return;
    }

    console.log('Deleting package:', id);

    this.packageService.deletePackage(id).subscribe({
      next: (response) => {
        console.log('Package deleted successfully:', response);

        this.loadPackages();
      },

      error: (error) => {
        console.error('Failed to delete package:', error);
      },
    });
  }
  addPackage(): void {
    this.router.navigate(['/packages/add']);
  }
}
