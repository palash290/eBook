import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auther-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auther-dashboard.component.html',
  styleUrl: './auther-dashboard.component.css'
})
export class AutherDashboardComponent {
  data: any

  constructor(private service: SharedService) { }

  ngOnInit(): void {
    this.getData();
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
