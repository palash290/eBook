import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reader-forget-password',
  standalone: true,
  imports: [FooterComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reader-forget-password.component.html',
  styleUrl: './reader-forget-password.component.css'
})
export class ReaderForgetPasswordComponent {
  Form!: FormGroup;
  loading: boolean = false;

  constructor(private router: Router, private srevice: SharedService, private toster: NzMessageService) { }

  logout() {
    localStorage.removeItem('userRole')
    this.router.navigateByUrl('/')
    //window.location.href = 'https://creativethoughtsinfo.com/CT01/ebook/';
  }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.Form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  onSubmit() {
    this.Form.markAllAsTouched();
    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.Form.value.email);
      this.srevice.postAPI('users/forgetPassword', formURlData.toString()).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toster.success(res.message);
            sessionStorage.setItem('email', this.Form.value.email);
            this.router.navigateByUrl('/reader-otp-verification');
            this.loading = false;
          } else {
            this.loading = false;
            this.toster.warning(res.message)
          }
        },
        error: (error) => {
          this.loading = false;
          this.toster.error(error);
        }
      });
    }
  }
}
