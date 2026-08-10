import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PackageService } from '../../../core/services/package.service';
import { Package } from '../../../core/models/package';

@Component({
  selector: 'app-package-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './package-add.html',
  styleUrl: './package-add.css',
})
export class PackageAdd {
  private packageService = inject(PackageService);
  private router = inject(Router);

  package: Package = {
    packageId: 0,
    packageName: '',
    price: 0,
    speedMbps: 0,
  };

  loading = false;

  addPackage(): void {
    if (!this.package.packageName.trim()) {
      alert('Please enter package name.');
      return;
    }

    if (this.package.price <= 0) {
      alert('Please enter a valid price.');
      return;
    }

    if (this.package.speedMbps <= 0) {
      alert('Please enter a valid speed.');
      return;
    }

    this.loading = true;

    console.log('Creating package:', this.package);

    this.packageService.addPackage(this.package).subscribe({
      next: (response) => {
        console.log('Package created successfully:', response);

        this.loading = false;

        alert('Package created successfully.');

        this.router.navigate(['/packages']);
      },

      error: (error) => {
        console.error('Failed to create package:', error);

        this.loading = false;

        alert('Failed to create package.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/packages']);
  }
}
