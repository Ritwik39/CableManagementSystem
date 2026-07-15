import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

    this.loading = true;
    this.errorMessage = '';

    const request = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>(
      'http://localhost:5229/api/Auth/login',
      request
    ).subscribe({

      next: (response) => {

        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);

        this.loading = false;

        this.router.navigate(['/dashboard']);

      },

      error: () => {

        this.loading = false;
        this.errorMessage = 'Invalid username or password';

      }

    });

  }

}