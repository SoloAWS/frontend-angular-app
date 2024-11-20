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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';  

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
    CommonModule,
    MatMenuModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'New stack';
  isSidenavOpened = true;
  menuItems: MenuItem[] = [];
  selectedLanguage = 'es';

  constructor(
    public router: Router,
    private jwtService: JwtService,
    private translate: TranslateService
  ) { 
    this.translate.use(this.selectedLanguage);
  }

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

  changeLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.translate.use(lang);
  }

  private updateMenuItems() {
    const userType = this.jwtService.getUserType();

    switch (userType) {
      case 'company':
        this.menuItems = [
          { path: '/plan/select', label: this.translate.instant('plan_selection'), icon: 'assignment' },
          { path: '/incident/dashboard', label: this.translate.instant('dashboard'), icon: 'dashboard' }
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
