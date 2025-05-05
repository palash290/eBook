import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
      constructor(private router: Router) { }

      canActivate(): boolean {
            const user = localStorage.getItem('userRole');
            if (user) {
                  if (user === 'author') {
                        this.router.navigate(['/author/auther-dashboard']);
                  } else if (user === 'reader') {
                        this.router.navigate(['/']);
                  } else {
                        this.router.navigate(['/']);
                  }
                  return false;
            }
            return true;
      }
}
