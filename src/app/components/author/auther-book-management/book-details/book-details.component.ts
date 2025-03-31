import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Book } from '../../../../modals/shared.modal';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../reader/shared/loader/loader.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RouterLink, CommonModule, LoaderComponent, NzModalModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  bookData!: Book;
  bookId!: number
  loading: boolean = false
  constructor(private router: Router, private service: SharedService, private toastr: NzMessageService, private route: ActivatedRoute, private modalService: NzModalService) {
    this.route.queryParams.subscribe(params => {
      this.bookId = params['id'];
    })
  }

  ngOnInit(): void {
    this.getBookById()
  }

  getBookById() {
    this.loading = true
    let apiUrl = `author/getAllBook/${this.bookId}`
    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.bookData = resp.book;
        this.loading = false
      },
      error: error => {
        console.log(error.message);
        this.loading = false
      }
    });
  }

  deleteBook(bookId: number) {
    this.modalService.confirm({
      nzTitle: 'Are you sure want to delete this book?',
      nzContent: '<b style="color: red;">You will not be able to recover this book!</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        this.service.delete(`author/deleteBook/${bookId}`).subscribe({
          next: (res: any) => {
            if (res.success == true) {
              this.toastr.success(res.message);
              this.router.navigateByUrl('/author/book-management');
            } else {
              this.loading = false;
              this.toastr.warning(res.message)
            }
          },
          error: (error) => {
            this.loading = false;
            this.toastr.error(error);
          }
        }),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }
}
