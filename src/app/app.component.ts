import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { JwtService } from './core/services/jwt.service';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'New stack';
  isSidenavOpened = true;
  menuItems: MenuItem[] = [];

  constructor(
    public router: Router,
    private jwtService: JwtService
  ) { }

  ngOnInit() {
    // Update menu items when navigation ends
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateMenuItems();
    });

    // Initial menu items update
    this.updateMenuItems();
  }

  private updateMenuItems() {
    const userType = this.jwtService.getUserType();

    switch (userType) {
      case 'company':
        this.menuItems = [
          { path: '/plan/select', label: 'Selección Plan', icon: 'assignment' },
          { path: '/incident/dashboard', label: 'Dashboard', icon: 'dashboard' }
        ];
        break;
      case 'manager':
        this.menuItems = [
          { path: '/incident/create', label: 'Crear Nuevo Incidente', icon: 'add_circle' },
          { path: '/incident/list', label: 'Consultar Incidente', icon: 'search' },
          { path: '/incident/dashboard-manager', label: 'Dashboard', icon: 'dashboard' }
        ];
        break;
      case 'user':
        this.menuItems = [
          { path: '/incident/create', label: 'Crear Nuevo Incidente', icon: 'add_circle' },
          { path: '/incident/list', label: 'Consultar Incidente', icon: 'search' }
        ];
        break;
      default:
        this.menuItems = [];
    }
  }

  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login' || this.router.url === '/signup';
  }
}
