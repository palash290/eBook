import { Component } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../shared/loader/loader.component";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reader-login',
  standalone: true,
  imports: [FooterComponent, RouterLink, CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './reader-login.component.html',
  styleUrl: './reader-login.component.css'
})
export class ReaderLoginComponent {

  loginForm!: FormGroup;
  isPasswordVisible: boolean = false;
  loading: boolean = false;

  constructor(private router: Router, private srevice: SharedService, private toster: NzMessageService, private authService: AuthService) {

  }

  logout() {
    localStorage.removeItem('userRole')
    this.router.navigateByUrl('/')
    //window.location.href = 'https://creativethoughtsinfo.com/CT01/ebook/';
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(localStorage.getItem('ReaderSavedEmail') || '', [Validators.required, Validators.email]),
      password: new FormControl(localStorage.getItem('ReaderSavedPassword') || '', Validators.required),
      rememberMe: new FormControl(localStorage.getItem('ReaderRememberMe') === 'true' || false)
    })
  }

  login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.loginForm.value.email);
      formURlData.set('password', this.loginForm.value.password);
      formURlData.set('fcm_token', localStorage.getItem('fcm_token') || '');
      this.srevice.postAPI('users/login', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.srevice.setToken(resp.token, 'user');
            this.toster.success(resp.message)
            this.router.navigateByUrl('/');
            localStorage.setItem('userRole', 'reader')
            localStorage.setItem('userInfo', JSON.stringify(resp.user));
            if (this.loginForm.value.rememberMe) {
              localStorage.setItem('ReaderSavedEmail', this.loginForm.value.email);
              localStorage.setItem('ReaderSavedPassword', this.loginForm.value.password);
              localStorage.setItem('ReaderRememberMe', 'true');
            } else {
              localStorage.removeItem('ReaderSavedEmail');
              localStorage.removeItem('ReaderSavedPassword');
              localStorage.removeItem('ReaderRememberMe');
            }
            this.loading = false;
          } else {
            this.loading = false;
            this.toster.warning(resp.message)
          }
        },
        error: (error) => {
          this.loading = false;
          this.toster.error(error);
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  loginWithGoogle() {
    this.authService.googleLogin().then(res => {

      const formData = {
        email: res.user.email,
        fullName: res.user.displayName,
        fcm_token: localStorage.getItem('fcm_token') || ''
      }

      this.srevice.postAPI('users/social-login', formData).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.srevice.setToken(resp.token, 'user');
            localStorage.setItem('userRole', 'reader')
            localStorage.setItem('userInfo', JSON.stringify(resp.user));
            this.router.navigateByUrl('/');
            this.toster.success(resp.message)
            this.loading = false;
          } else {
            this.loading = false;
            this.toster.warning(resp.message)
          }
        },
        error: (error) => {
          this.loading = false;
          this.toster.error(error);
        }
      });
    });
  }

  // loginWithFacebook() {
  //   this.authService.facebookLogin().then(res => console.log('Facebook Login Success:', res));
  // }
}
