import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { User } from '../../../modals/auth.modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auther-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './auther-header.component.html',
  styleUrl: './auther-header.component.css'
})
export class AutherHeaderComponent {
  userInfo: User | null = null;

  constructor(private router: Router, private service: SharedService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.service.getProfile('author/myProfile', 'author')
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    });
  }

  logout() {
    this.router.navigate(['/author-login'])
    this.service.logout();
  }

}
