import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-reader',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-reader.component.html',
  styleUrl: './edit-reader.component.css'
})
export class EditReaderComponent {
  loading: boolean = false
  userInfo: any;
  editProfileForm: FormGroup;
  profilePreview: string | undefined
  profileImage: File | null = null
  constructor(private router: Router, private service: SharedService, private toastr: NzMessageService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.editProfileForm = this.fb.group({
      fullName: ['', [Validators.required, NoWhitespaceDirective.validate]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.getProfile()
  }


  getProfile() {
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
        this.editProfileForm.patchValue({
          fullName: this.userInfo.fullName,
          email: this.userInfo.email,
        })
        this.profilePreview = this.userInfo.avatar_url
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.profileImage = file
    }
  }

  onSubmit(): void {
    if (this.editProfileForm.invalid) {
      this.editProfileForm.markAllAsTouched()
      return
    }
    this.loading = true;
    let formData = new FormData()
    formData.append('fullName', this.editProfileForm.value.fullName)
    if (this.profileImage) {
      formData.append('avatar_url', this.profileImage)
      // formData.append('coverImage', this.profileImage)
    }

    this.service.update('users/editProfile', formData).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.service.getProfile('users/myProfile')
          this.router.navigate(['/'])
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
