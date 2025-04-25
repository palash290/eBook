import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoaderComponent } from '../../reader/shared/loader/loader.component';

@Component({
  selector: 'app-session-management',
  standalone: true,
  imports: [RouterLink, CommonModule, LoaderComponent],
  templateUrl: './session-management.component.html',
  styleUrl: './session-management.component.css'
})
export class SessionManagementComponent {

  upcomingSessions: any;
  completedSessions: any;
  loading: boolean = false;
  totalSessions: any;
  totalViewers: any;
  upcomingSessionsCount: any;
  completedSessionsCount: any;
  sessionId: any;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;

  constructor(private service: SharedService, private router: Router, private toastr: NzMessageService) { }


  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.service.get('author/getSessionDashboard').subscribe({
      next: (resp: any) => {
        this.totalSessions = resp.totalSessions
        this.totalViewers = resp.totalViewers
        this.upcomingSessionsCount = resp.upcomingSessionsCount
        this.completedSessionsCount = resp.completedSessionsCount
        this.upcomingSessions = resp.upcomingSessions;
        this.completedSessions = resp.completedSessions;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  edit(id: any) {
    this.router.navigate(['author/add-session'], { queryParams: { id: id } });
  }

  openDeleteModal(driver: any) {
    this.sessionId = driver.id;
  }

  deleteDriver() {
    this.loading = true;
    this.service.delete(`author/deleteSession/${this.sessionId}`).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.closeModalDelete.nativeElement.click();
          this.getData();
          this.loading = false;
        } else {
          this.toastr.warning('Something went wrong!');
          this.getData();
          this.loading = false;
          
        }
      },
    });
  }


}
