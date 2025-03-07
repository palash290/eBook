import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auther-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auther-header.component.html',
  styleUrl: './auther-header.component.css'
})
export class AutherHeaderComponent {

  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('userRole')
    this.router.navigateByUrl('/')
    //window.location.href = 'https://creativethoughtsinfo.com/CT01/ebook/';
  }

}
