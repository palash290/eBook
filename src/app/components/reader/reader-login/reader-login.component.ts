import { Component } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reader-login',
  standalone: true,
  imports: [FooterComponent, RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reader-login.component.html',
  styleUrl: './reader-login.component.css'
})
export class ReaderLoginComponent {

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
    localStorage.setItem('userRole', 'author');
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
      this.srevice.loginUser('users/login', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.srevice.setToken(resp.token);
            this.loading = false;
            this.router.navigateByUrl('/');
            localStorage.setItem('role', 'reader')
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
