import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showFooter = true;
  constructor(private router: Router) {
    if (localStorage.getItem('userRole') == 'author') {
      this.router.navigate(['/author/auther-dashboard']);
    }
  }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const hiddenFooterRoutes = ['/chat'];
        const url = event.urlAfterRedirects.split('?')[0];
        this.showFooter = !hiddenFooterRoutes.includes(url);
      }
    });
  }
}

