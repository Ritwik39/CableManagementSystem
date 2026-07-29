import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  loginRequest: LoginRequest = {
    userName: '',
    password: ''
  };

  login(): void {

    console.log(this.loginRequest);

    this.authService.login(this.loginRequest).subscribe({

      next: (response) => {

        console.log(response);

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

}