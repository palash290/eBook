import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  isShowOld: boolean = false;
  isShowNew: boolean = false;
  isShowConfirm: boolean = false;
  loading: boolean = false;
  Form!: FormGroup;
  email!: string

  constructor(private router: Router, private srevice: SharedService, private toster: NzMessageService) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.Form = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, strongPasswordValidator]),
      confPassword: new FormControl('', [Validators.required]),
    }, {
      validators: [
        passwordMatchValidator(),
        passwordMismatchValidator()
      ]
    })
  }

  onSubmit() {
    this.Form.markAllAsTouched();
    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('new_password', this.Form.value.confPassword);
      formURlData.set('current_password', this.Form.value.oldPassword);
      this.srevice.postAPI('author/changePassword', formURlData.toString()).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toster.success(res.message);
            this.router.navigate(['/author/auther-dashboard']);
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
}

export function strongPasswordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value || ''

  const hasUpperCase = /[A-Z]/.test(value)
  const hasLowerCase = /[a-z]/.test(value)
  const hasNumeric = /[0-9]/.test(value)
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value)
  const isValidLength = value.length >= 8

  const passwordValid =
    hasUpperCase &&
    hasLowerCase &&
    hasNumeric &&
    hasSpecialCharacter &&
    isValidLength

  // Return errors object or null
  if (!passwordValid) {
    return {
      strongPassword: {
        hasUpperCase: hasUpperCase,
        hasLowerCase: hasLowerCase,
        hasNumeric: hasNumeric,
        hasSpecialCharacter: hasSpecialCharacter,
        isValidLength: isValidLength
      }
    }
  }
  return null
}

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
  };
}

export function passwordMismatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentPassword = control.get('oldPassword')?.value;
    const newPassword = control.get('newPassword')?.value;
    if (!currentPassword || !newPassword) return null;

    return currentPassword === newPassword
      ? { sameAsCurrent: true }
      : null;
  };
}