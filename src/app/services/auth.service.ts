import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userRole: string = 'guest';

  constructor(private router: Router, private auth: Auth) { }

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

  async googleLogin() {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(this.auth, provider);
  }
}
