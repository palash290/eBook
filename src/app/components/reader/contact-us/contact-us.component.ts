import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  loading: boolean = false
  userInfo: any;
  contactUsForm: FormGroup;
  constructor(private router: Router, private service: SharedService, private toastr: NzMessageService, private fb: FormBuilder) {
    this.contactUsForm = this.fb.group({
      name: ['', [Validators.required, NoWhitespaceDirective.validate]],
      email: ['', [Validators.required, Validators.email]],
      description: ['', [Validators.required, NoWhitespaceDirective.validate, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.getProfile()
  }


  getProfile() {
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;

        this.contactUsForm.patchValue({
          name: data.fullName,
          email: data.email,
        });

        this.contactUsForm.get('name')?.disable();
        this.contactUsForm.get('email')?.disable();
      }
    });
  }

  onSubmit(): void {
    if (this.contactUsForm.invalid) {
      this.contactUsForm.markAllAsTouched()
      return
    }
    this.loading = true;
    let apiUrl = ''
    let formData = {}

    if (this.service.isLogedIn('user')) {
      apiUrl = 'users/ContactIssue'
      formData = {
        description: this.contactUsForm.value.description.trim(),
        userId: this.userInfo.id
      }
    } else {
      apiUrl = 'users/anonymousContactIssue'
      formData = {
        description: this.contactUsForm.value.description.trim(),
        fullName: this.contactUsForm.value.name.trim(),
        email: this.contactUsForm.value.email,
      }
    }

    this.service.postAPI(apiUrl, formData).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.contactUsForm.reset();
        } else {
          this.loading = false;
          this.toastr.warning(res.message);
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(error);
      }
    });
  }
}

export class NoWhitespaceDirective {
  static validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value || control.value.trim() == '') {
      return { required: true };
    }
    return null;
  }

}
