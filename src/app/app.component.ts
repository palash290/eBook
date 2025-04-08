import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LogInAlertComponent } from './components/reader/shared/log-in-alert/log-in-alert.component';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LogInAlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'e-book';
  constructor(private router: Router, private notificationService: NotificationService) {
    if (localStorage.getItem('userRole') == 'author') {
      this.router.navigate(['/author/auther-dashboard']);
    } else if (localStorage.getItem('userRole') == 'reader') {
      // this.router.navigate(['/']);
    }
  }
  ngOnInit() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        this.notificationService.requestPermission()
      }
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.notificationService.listenForMessages();
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
