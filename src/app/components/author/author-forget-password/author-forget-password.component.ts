import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FooterComponent } from '../../reader/shared/footer/footer.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../reader/shared/loader/loader.component";

@Component({
  selector: 'app-author-forget-password',
  standalone: true,
  imports: [FooterComponent, CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './author-forget-password.component.html',
  styleUrl: './author-forget-password.component.css'
})
export class AuthorForgetPasswordComponent {
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
      this.srevice.postAPI('author/forgetPassword', formURlData.toString()).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.srevice.setToken(res.token);
            this.loading = false;
            this.toster.success(res.message);
            sessionStorage.setItem('email', this.Form.value.email);
            this.router.navigateByUrl('/author-otp-verification');
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
