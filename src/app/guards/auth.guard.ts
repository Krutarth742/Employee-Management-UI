import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('jwt_token');

  if (!token) {
    router.navigate(['/sign-in']);
    return false;
  }

  return true;
};
