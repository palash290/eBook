import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userRole: string = 'guest';

  constructor(private router: Router) { }

  setUserRole(role: string) {
    this.userRole = role;
    localStorage.setItem('userRole', role);
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') || 'guest';
  }

  isAuthorized(allowedRoles: string[]): boolean {
    return allowedRoles.includes(this.getUserRole());
  }
}
