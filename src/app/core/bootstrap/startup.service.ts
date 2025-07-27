import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { tap } from 'rxjs/operators';
import { Menu, MenuService } from './menu.service';
import { AuthService, User } from '@core/authentication';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  private readonly http = inject(HttpClient);
  private readonly menuService = inject(MenuService);
  private readonly permissonsService = inject(NgxPermissionsService);
  private readonly rolesService = inject(NgxRolesService);
  private readonly authService = inject(AuthService);

  load() {
    return new Promise<void>((resolve, reject) => {
      this.authService.change().pipe(
        tap(user => this.setPermissions(user)),
        // Charger menu.json depuis /data/menu.json
        tap(() => {
          this.http.get<{ menu: Menu[] }>('data/menu.json').subscribe({
            next: data => {
              this.setMenu(data.menu);
              resolve();
            },
            error: err => {
              console.error('[StartupService] Erreur de chargement menu.json', err);
              resolve(); // continue même si échec
            },
          });
        })
      ).subscribe();
    });
  }

  private setMenu(menu: Menu[]) {
    this.menuService.addNamespace(menu, 'menu');
    this.menuService.set(menu);
  }

  private setPermissions(user: User) {
    const permissions = ['canAdd', 'canDelete', 'canEdit', 'canRead'];
    this.permissonsService.loadPermissions(permissions);
    this.rolesService.flushRoles();
    this.rolesService.addRoles({ ADMIN: permissions });
  }
}
