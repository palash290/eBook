import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-reader-signup',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule,FooterComponent],
  templateUrl: './reader-signup.component.html',
  styleUrl: './reader-signup.component.css'
})
export class ReaderSignupComponent {

  signupForm!: FormGroup;
  isPasswordVisible: boolean = false;
  isPasswordVisible1: boolean = false;
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
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      full_name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      // password: new FormControl('', Validators.required),
    })
  }

  login() {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();

      formURlData.set('email', this.signupForm.value.email);
      formURlData.set('fullName', this.signupForm.value.full_name);
      formURlData.set('password', this.signupForm.value.password);
      this.srevice.loginUser('users/signupByEmail', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.loading = false;
            this.toster.success(resp.message);
            this.router.navigateByUrl(`/reader-login`);
          } else {
            this.toster.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.error.message) {
            this.toster.error(error.error.message);
          } else {
            this.toster.error('Something went wrong!');
          }
          console.error('Login error:', error);
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  togglePasswordVisibility1() {
    this.isPasswordVisible1 = !this.isPasswordVisible1;
  }


}
