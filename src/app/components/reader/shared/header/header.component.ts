import { Component } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  eBookToken: any = null;

  constructor(private modalService: ModalService, private service: SharedService, private router: Router) { }

  ngOnInit(): void {
    this.eBookToken = localStorage.getItem('eBookToken');
  }

  openLoginModal() {
    this.modalService.openModal();
  }

  logout() {
    location.reload();
    this.service.logout();
  }


}
