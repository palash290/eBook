import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {
    if (localStorage.getItem('userRole') == 'author') {
      this.router.navigate(['/author/auther-dashboard']);
    }
  }
  // ngOnInit() {
  //   this.router.events.subscribe((event: any) => {
  //     if (event instanceof NavigationEnd) {
  //       const existingScript = document.querySelector('script[src="assets/js/main.js"]');
  //       if (existingScript) {
  //         existingScript.remove();
  //       }
  //       const scriptElement = document.createElement('script');
  //       scriptElement.src = 'assets/js/main.js';
  //       scriptElement.async = true;
  //       document.body.appendChild(scriptElement);
  //     }
  //   });
  // }
}

