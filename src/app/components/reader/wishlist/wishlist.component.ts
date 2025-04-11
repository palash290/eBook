import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../../../services/shared.service';
import { Book } from '../../../modals/shared.modal';
import { LoaderComponent } from '../shared/loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, LoaderComponent, CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  favBooks: any[] = [];
  loading: boolean = false
  constructor(private router: Router, private service: SharedService, private toastr: NzMessageService) { }


  ngOnInit(): void {
    if (this.service.isLogedIn('user')) {
      this.getFavBooks();
    }
  }

  getFavBooks() {
    this.loading = true
    let apiUrl = 'users/getAllfavBook'
    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.favBooks = resp.favBooks;
        this.service.favItems.set(this.favBooks)
        this.loading = false
      },
      error: error => {
        console.log(error.message);
        this.loading = false
      }
    });
  }

  addToFav(bookId: number) {
    // this.loading = true
    this.service.postAPI('users/favBook', { bookId: bookId }).subscribe({
      next: (resp: any) => {
        this.toastr.success(resp.message);
        this.getFavBooks()
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  read(bookData: any) {
    if (bookData.pdfUrl.endsWith('.epub')) {
      this.router.navigate(['/epub-reader'], { queryParams: { url: bookData.pdfUrl, id: bookData.id, title: bookData.title } });
    } else {
      this.router.navigate(['/pdf'], { queryParams: { url: bookData.pdfUrl, id: bookData.id, title: bookData.title } });
    }
  }

  downloadFile(fileUrl: string, title: string) {
    if (!fileUrl) {
      console.error("No file URL found.");
      return;
    }

    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {
        const fileType = blob.type;
        let extension = 'pdf';

        if (fileType === 'application/epub+zip') {
          extension = 'epub';
        } else if (fileType === 'application/pdf') {
          extension = 'pdf';
        } else {
          console.warn('Unknown file type:', fileType);
        }

        const blobUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');

        anchor.href = blobUrl;
        anchor.download = `${title}.${extension}`;
        anchor.click();

        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => console.error('Error downloading file:', error));
  }
}
