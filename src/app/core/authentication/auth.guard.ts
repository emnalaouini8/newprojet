import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { KeycloakInitService } from './keycloak-init.service';

export const authGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakInitService);
  const token = keycloakService.getToken();

  // ✅ Ne fait plus de login() ici
  return !!token;
};