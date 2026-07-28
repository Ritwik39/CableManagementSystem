import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidebar } from './sidebar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {}
