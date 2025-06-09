import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthWrapperService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Check if token exists on initialization (only in browser)
    if (this.isBrowser) {
      this.checkAuthStatus();
    }
  }

  checkAuthStatus(): void {
    if (this.isBrowser) {
      try {
        const token = localStorage.getItem('jwt_token');
        this.isLoggedInSubject.next(!!token);
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        this.isLoggedInSubject.next(false);
      }
    }
  }

  signOut(): void {
    if (this.isBrowser) {
      try {
        // Remove token
        localStorage.removeItem('jwt_token');
      } catch (error) {
        console.error('Error removing token from localStorage:', error);
      }
    }
    
    // Update logged in status
    this.isLoggedInSubject.next(false);
    
    // Navigate to sign-in
    this.router.navigate(['/sign-in']);
  }

  // Safely get token
  getToken(): string | null {
    if (this.isBrowser) {
      try {
        return localStorage.getItem('jwt_token');
      } catch (error) {
        console.error('Error getting token from localStorage:', error);
        return null;
      }
    }
    return null;
  }
}
