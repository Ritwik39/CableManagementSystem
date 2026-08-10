import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PackageService } from '../../../core/services/package.service';
import { Package } from '../../../core/models/package';

@Component({
  selector: 'app-package-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './package-edit.html',
  styleUrl: './package-edit.css',
})
export class PackageEdit implements OnInit {
  private packageService = inject(PackageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  package: Package = {
    packageId: 0,
    packageName: '',
    price: 0,
    speedMbps: 0,
  };

  loading = false;
  saving = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    console.log('Editing package ID:', id);

    if (!id) {
      alert('Invalid package ID.');
      this.router.navigate(['/packages']);
      return;
    }

    this.loadPackage(id);
  }

  loadPackage(id: number): void {
    this.loading = true;

    console.log('Loading package:', id);

    this.packageService.getPackage(id).subscribe({
      next: (response: Package) => {
        console.log('Package details:', response);

        this.package = response;

        this.loading = false;
      },

      error: (error) => {
        console.error('Failed to load package:', error);

        this.loading = false;

        alert('Failed to load package.');

        this.router.navigate(['/packages']);
      },
    });
  }

  updatePackage(): void {
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

    this.saving = true;

    console.log('Updating package:', this.package);

    this.packageService.updatePackage(this.package).subscribe({
      next: (response) => {
        console.log('Package updated successfully:', response);

        this.saving = false;

        alert('Package updated successfully.');

        this.router.navigate(['/packages']);
      },

      error: (error) => {
        console.error('Failed to update package:', error);

        this.saving = false;

        alert('Failed to update package.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/packages']);
  }
}
