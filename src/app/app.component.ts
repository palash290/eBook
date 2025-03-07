import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LogInAlertComponent } from './components/reader/shared/log-in-alert/log-in-alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LogInAlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'e-book';
  constructor(private router: Router) { 
    
  }
  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const existingScript = document.querySelector('script[src="assets/js/main.js"]');
        if (existingScript) {
          existingScript.remove();
        }
        const scriptElement = document.createElement('script');
        scriptElement.src = 'assets/js/main.js';
        scriptElement.async = true;
        document.body.appendChild(scriptElement);
      }
    });
  }
}
