import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  const router: Router = inject(Router);

  if (Object.keys(authService.getCurrentUser()).length > 0) {
    return true
  } 
  router.navigateByUrl('login')
  return false;
};