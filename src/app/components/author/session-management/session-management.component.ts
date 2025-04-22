import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-management',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './session-management.component.html',
  styleUrl: './session-management.component.css'
})
export class SessionManagementComponent {
  data: any

  constructor(private service: SharedService) { }

  ngOnInit(): void {
    // this.getData();
  }

  getData() {
    this.service.get('author/getdashboard').subscribe({
      next: (resp: any) => {
        this.data = resp;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }
}
