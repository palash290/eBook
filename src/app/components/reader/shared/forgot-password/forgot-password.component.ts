import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../../../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

   constructor(private router: Router, private srevice: SharedService, private toster: NzMessageService) { }

  logout() {
    localStorage.removeItem('userRole')
    this.router.navigateByUrl('/')
    //window.location.href = 'https://creativethoughtsinfo.com/CT01/ebook/';
  }

}
