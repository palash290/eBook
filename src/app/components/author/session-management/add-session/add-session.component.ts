import { Component } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '../../../reader/shared/loader/loader.component';

@Component({
  selector: 'app-add-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LoaderComponent],
  templateUrl: './add-session.component.html',
  styleUrl: './add-session.component.css',
  providers: [DatePipe]
})
export class AddSessionComponent {

  sessionForm!: FormGroup;
  loading: boolean = false;
  selectedFile!: File;
  previewImageAdd: string | ArrayBuffer | null = null;
  isEdit: boolean = false;
  sessionId: any = null;
  maxDate: any;
  seddiondata: any;

  constructor(private service: SharedService, private toastr: NzMessageService, private fb: FormBuilder, private route: ActivatedRoute, private datePipe: DatePipe, private router: Router) { }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['id'];
    })
    this.inItForm();
    this.setMaxDate();
  }

  inItForm() {
    this.sessionForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      image: [null]
    });

    if (this.sessionId) {
      this.isEdit = true;
      this.getData();
    }
  }

  setMaxDate() {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  onFileSelected(event: any, isEdit: boolean) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageAdd = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submitForm() {
    this.sessionForm.markAllAsTouched();

    if (this.sessionForm.invalid) {
      return
    }

    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('thumbnail', this.selectedFile);
    }

    formData.append('title', this.sessionForm.value.title);
    formData.append('date', this.sessionForm.value.date);
    formData.append('time', this.sessionForm.value.time);
    this.loading = true;
    if (this.isEdit && this.sessionId) {
      this.service.put(`author/editSession/${this.sessionId}`, formData).subscribe((resp: any) => {
        if (resp.success) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.router.navigateByUrl('author/session');
        } else {
          this.loading = false;
          this.toastr.warning(resp.message);
        }
      });
    } else {
      this.service.postAPI('author/scheduleLiveSession', formData).subscribe((resp: any) => {
        if (resp.success) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.router.navigateByUrl('author/session');
        } else {
          this.loading = false;
          this.toastr.warning(resp.message);
        }
      });
    }
  }

  goBack() {
    this.router.navigateByUrl('author/session');
  }

  getData() {
    this.service.get(`author/getQASession/${this.sessionId}`).subscribe({
      next: (resp: any) => {
        this.seddiondata = resp.Sessions;

        this.sessionForm.patchValue({
          title: this.seddiondata.title,
          date: this.datePipe.transform(this.seddiondata.date, 'yyyy-MM-dd'),
          time: this.seddiondata.time
        });

        // Set existing image preview for edit modal
        this.previewImageAdd = this.seddiondata.thumbnail;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


}
