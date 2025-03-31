import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Category } from '../../../modals/shared.modal';
import { SharedService } from '../../../services/shared.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutherHeaderComponent } from '../auther-header/auther-header.component';

@Component({
  selector: 'app-auther-profile-customization',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './auther-profile-customization.component.html',
  styleUrl: './auther-profile-customization.component.css',
  providers: [AutherHeaderComponent]
})
export class AutherProfileCustomizationComponent {
  loading: boolean = false
  categories: Category[] = [];
  userInfo: any;
  editProfileForm: FormGroup;
  profilePreview: string | undefined
  profileImage: File | null = null
  constructor(private router: Router, private service: SharedService, private toastr: NzMessageService, private route: ActivatedRoute, private fb: FormBuilder, private autherHeader: AutherHeaderComponent) {
    this.editProfileForm = this.fb.group({
      fullName: ['', [Validators.required, NoWhitespaceDirective.validate]],
      email: ['', [Validators.required, Validators.email]],
      tagline: ['', Validators.maxLength(100)],
      instagram: [''],
      facebook: [''],
      genres: [''],
    });
  }

  ngOnInit(): void {
    this.getCategory()
    this.getProfile()
    // const data = localStorage.getItem('userInfo');
    // if (data) {
    //   this.userInfo = JSON.parse(data);
    // }
  }

  getCategory() {
    this.service.get('author/getAllCategories').subscribe({
      next: (resp: any) => {
        this.categories = resp.categories;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getProfile() {
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
        this.editProfileForm.patchValue({
          fullName: this.userInfo.fullName,
          email: this.userInfo.email,
          tagline: this.userInfo.tagline !== 'null' ? this.userInfo.tagline : '',
          instagram: this.userInfo.instagram !== 'null' ? this.userInfo.instagram : '',
          facebook: this.userInfo.facebook !== 'null' ? this.userInfo.facebook : '',
        })
        this.selectedCategories = this.userInfo.AuthorCategory.map((item: { categoryId: number; }) =>
          item.categoryId
        )
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
    formData.append('tagline', this.editProfileForm.value.tagline ? this.editProfileForm.value.tagline : '')
    formData.append('instagram', this.editProfileForm.value.instagram ? this.editProfileForm.value.instagram : '')
    formData.append('facebook', this.editProfileForm.value.facebook ? this.editProfileForm.value.facebook : '')
    if (this.profileImage) {
      formData.append('avatar_url', this.profileImage)
      formData.append('coverImage', this.profileImage)
    }
    formData.append('categoryIds', this.selectedCategories.join(','))

    this.service.update('author/editProfile', formData).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.service.getProfile('author/myProfile', 'author')
          // this.router.navigate(['/author/auther-dashboard'])
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

  selectedCategories: number[] = [];

  toggleCategory(categoryId: number): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryId);
    }
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