import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { Book } from '../../../modals/shared.modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auther-book-management',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './auther-book-management.component.html',
  styleUrl: './auther-book-management.component.css'
})
export class AutherBookManagementComponent {
  books: Book[] = [];
  originalBooks: Book[] = [];

  constructor(private service: SharedService) { }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.service.get('author/getAllBook').subscribe({
      next: (resp: any) => {
        this.originalBooks = resp.books;
        this.books = [...this.originalBooks];
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  searchBook(event: any) {
    const searchValue = event.target.value.trim().toLowerCase();

    if (searchValue) {
      this.books = this.originalBooks.filter(book =>
        book.title.toLowerCase().includes(searchValue)
      );
    } else {
      this.books = [...this.originalBooks];
    }
  }
}
