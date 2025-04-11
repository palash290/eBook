import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { User } from '../../../modals/auth.modal';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-auther-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './auther-header.component.html',
  styleUrl: './auther-header.component.css'
})
export class AutherHeaderComponent {
  userInfo: User | null = null;
  notifications: any[] = []

  constructor(private router: Router, private service: SharedService, private cdr: ChangeDetectorRef, private notification: NotificationService, private toastr: NzMessageService) { }

  ngOnInit(): void {
    this.service.getProfile('author/myProfile', 'author')
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    });
    this.getNotification()
    this.notification.message$.subscribe((msg) => {
      if (msg) {
        this.getNotification()
      }
    });
  }

  logout() {
    this.router.navigate(['/author-login'])
    this.service.logout();
  }

  getNotification() {
    this.service.get('author/getAllAuthorNotification').subscribe({
      next: (resp: any) => {
        this.notifications = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  // http://localhost:4005/api/author/delete/6%27

  deleteNotification(id: number) {
    this.service.delete(`author/delete/${id}`).subscribe({
      next: (res: any) => {
        this.notifications = this.notifications.filter((item: any) => item.id !== id);
      },
      error: (error) => {
        // this.toastr.error(error);
      }
    })
  }

  clearNotification() {
    this.service.delete(`author/deleteAll`).subscribe({
      next: (res: any) => {
        this.notifications = [];
      },
      error: (error) => {
        // this.toastr.error(error);
      }
    })
  }
}
