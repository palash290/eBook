import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auther-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './auther-sidebar.component.html',
  styleUrl: './auther-sidebar.component.css'
})
export class AutherSidebarComponent {

  constructor(private router: Router) { }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

}
