import { Component, ViewChild, ElementRef } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-log-in-alert',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './log-in-alert.component.html',
  styleUrl: './log-in-alert.component.css'
})
export class LogInAlertComponent {
  @ViewChild('loginModal') loginModal!: ElementRef;

  constructor(private modalService: ModalService) { }

  ngAfterViewInit() {
    this.modalService.setModal(this.loginModal.nativeElement);
  }

  saveuserRole(){
    localStorage.setItem('userRole', 'author');
  }
}
