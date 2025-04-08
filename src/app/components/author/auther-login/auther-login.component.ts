import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../reader/shared/footer/footer.component';
import { LoaderComponent } from "../../reader/shared/loader/loader.component";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auther-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, FooterComponent, LoaderComponent],
  templateUrl: './auther-login.component.html',
  styleUrl: './auther-login.component.css'
})
export class AutherLoginComponent {

  loginForm!: FormGroup;
  isPasswordVisible: boolean = false;
  loading: boolean = false;

  constructor(private router: Router, private srevice: SharedService, private toster: NzMessageService, private authService: AuthService) { }

  logout() {
    localStorage.removeItem('userRole')
    this.router.navigateByUrl('/')
    //window.location.href = 'https://creativethoughtsinfo.com/CT01/ebook/';
  }


  ngOnInit(): void {
    this.initForm();
    //localStorage.setItem('userRole', 'author');
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(localStorage.getItem('AutherSavedEmail') || '', [Validators.required, Validators.email]),
      password: new FormControl(localStorage.getItem('AutherSavedPassword') || '', Validators.required),
      rememberMe: new FormControl(localStorage.getItem('AutherRememberMe') === 'true' || false)
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
      this.srevice.postAPI('author/login', formURlData.toString()).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.router.navigateByUrl('/author/auther-dashboard');
            this.srevice.setToken(res.token, 'author');
            this.toster.success(res.message)
            localStorage.setItem('userRole', 'author')
            localStorage.setItem('userInfo', JSON.stringify(res.authorData));
            if (this.loginForm.value.rememberMe) {
              localStorage.setItem('AutherSavedEmail', this.loginForm.value.email);
              localStorage.setItem('AutherSavedPassword', this.loginForm.value.password);
              localStorage.setItem('AutherRememberMe', 'true');
            } else {
              localStorage.removeItem('AutherSavedEmail');
              localStorage.removeItem('AutherSavedPassword');
              localStorage.removeItem('AutherRememberMe');
            }
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

      this.srevice.postAPI('author/social-login', formData).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.srevice.setToken(resp.token, 'author');
            localStorage.setItem('userRole', 'author')
            localStorage.setItem('userInfo', JSON.stringify(resp.user));
            this.router.navigateByUrl('/author/auther-dashboard');
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
}
