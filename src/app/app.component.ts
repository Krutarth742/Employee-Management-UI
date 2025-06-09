import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { Observable } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthWrapperService } from './service/auth-wrapper.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, RouterLink,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Employee-Management';
  isAuthenticated$: Observable<boolean>;

  constructor(private authWrapper: AuthWrapperService, private router: Router) {
    this.isAuthenticated$ = this.authWrapper.isLoggedIn$;
  }

  ngOnInit(): void {
    // Refresh auth status on component initialization
    this.authWrapper.checkAuthStatus();
  }

  signOut(): void {
    this.authWrapper.signOut();
  }
}
