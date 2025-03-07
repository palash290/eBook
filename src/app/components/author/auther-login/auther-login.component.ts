import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../reader/shared/footer/footer.component';

@Component({
  selector: 'app-auther-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './auther-login.component.html',
  styleUrl: './auther-login.component.css'
})
export class AutherLoginComponent {

  loginForm!: FormGroup;
  isPasswordVisible: boolean = false;
  loading: boolean = false;

  constructor(private router: Router, private srevice: SharedService, private toster: NzMessageService) { }


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
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.loginForm.value.email);
      formURlData.set('password', this.loginForm.value.password);

      this.srevice.loginUser('author/login', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.srevice.setToken(resp.token);
            this.loading = false;
            this.router.navigateByUrl('/author/auther-dashboard');
            localStorage.setItem('role', 'author')
          } else {
            this.loading = false;
            this.toster.warning(resp.message)
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.error.message) {
            this.toster.error(error.error.message);
          } else {
            this.toster.error('Something went wrong!');
          }
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


}
