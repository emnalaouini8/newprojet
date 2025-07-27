import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakInitService {
  private keycloak!: Keycloak;

  constructor() { }
init(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'matero',
      clientId: 'matero-frontend'
    });

    this.keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256'
      })
      .then(authenticated => {
        console.log('[Keycloak] Authenticated:', authenticated);
        resolve(authenticated);
      })
      .catch(err => {
        console.error('[Keycloak] Init error:', err);
        reject(err);
      });
  });
}

  login() {
    this.keycloak.login();
  }

logout() {
  const logoutUrl = this.keycloak.createLogoutUrl({
    // Cette URL dit à Keycloak où rediriger une fois que l'utilisateur est déconnecté
    redirectUri: window.location.origin
  });

  // Rediriger manuellement vers l'URL de logout générée par Keycloak
  window.location.href = logoutUrl;
}

  getToken() {
    return this.keycloak.token;
  }

  getKeycloakInstance() {
    return this.keycloak;
  }

  private scheduleRefresh() {
    setInterval(() => {
      this.keycloak
        .updateToken(30)
        .then(refreshed => {
          if (refreshed) {
            console.log('[Keycloak] Token refreshed');
          }
        })
        .catch(() => {
          console.error('[Keycloak] Failed to refresh token');
        });
    }, 10000);
  }
}
