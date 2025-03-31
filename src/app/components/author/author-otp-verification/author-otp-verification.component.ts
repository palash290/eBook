import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../../../services/shared.service';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzInputOtpComponent } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../reader/shared/footer/footer.component';

@Component({
  selector: 'app-author-otp-verification',
  standalone: true,
  imports: [NzFlexDirective, NzTypographyComponent, NzInputOtpComponent, FormsModule, ReactiveFormsModule, CommonModule, FooterComponent],
  templateUrl: './author-otp-verification.component.html',
  styleUrl: './author-otp-verification.component.css'
})
export class AuthorOtpVerificationComponent {
  email!: string;
  Form!: FormGroup;
  loading: boolean = false;
  isResendDisabled: boolean = false;
  countdown: number = 60;
  interval: any;

  constructor(private router: Router, private srevice: SharedService, private toster: NzMessageService) { }

  ngOnInit() {
    const email = sessionStorage.getItem('email');
    if (email) {
      this.email = email
    }
    this.initForm()
    this.startCountdown();
  }

  initForm() {
    this.Form = new FormGroup({
      otp: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    })
  }
  get otp() {
    return this.Form.get('otp');
  }

  onSubmit() {
    this.Form.markAllAsTouched();
    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.email);
      formURlData.set('otp', this.Form.value.otp);
      this.srevice.postAPI('author/verifyForgetPasswordOtp', formURlData.toString()).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toster.success(res.message);
            this.router.navigateByUrl('/author-reset-password');
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

  logout() {
    localStorage.removeItem('userRole')
    this.router.navigateByUrl('/')
    //window.location.href = 'https://creativethoughtsinfo.com/CT01/ebook/';
  }
  restrictToNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }


  startCountdown() {
    this.isResendDisabled = true; // Disable button
    this.countdown = 60;

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.isResendDisabled = false; // Enable button when countdown reaches 0
        clearInterval(this.interval);
      }
    }, 1000);
  }

  resendOtp() {
    if (!this.isResendDisabled) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.email);
      this.srevice.postAPI('author/forgetPassword', formURlData.toString()).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.srevice.setToken(res.token);
            this.loading = false;
            this.toster.success('OTP resent successfully.');
            this.startCountdown();
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
