import { Component, ElementRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [NzSelectModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.css'
})
export class GroupChatComponent {
  @ViewChild('submitModalClose') submitModalClose!: ElementRef<HTMLButtonElement>;
  loading: boolean = false
  readers: any;
  Form: FormGroup;
  selectedReaders: any[] = [];
  constructor(private router: Router, private service: SharedService, private toastr: NzMessageService, private fb: FormBuilder) {

    this.Form = this.fb.group({
      chatName: ['', [Validators.required, NoWhitespaceDirective.validate]],
      receiverIds: [[], [Validators.required, NoWhitespaceDirective.validate]],
    });
  }


  ngOnInit(): void {
    this.getReaders()
  }

  getReaders() {
    this.service.get('author/getAllFollwedUser').subscribe({
      next: (resp: any) => {
        this.readers = resp.users;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  onSubmit(): void {

    if (this.Form.invalid) {
      this.Form.markAllAsTouched()
      return
    }

    this.loading = true;

    let formData = {
      chatName: this.Form.value.chatName,
      receiverIds: this.Form.value.receiverIds
    }

    this.service.postAPI('author/createGroupChat', formData).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success(res.message);
          this.submitModalClose.nativeElement.click();
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
    const value = control.value;

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { required: true };
    }
    return null;
  }
}