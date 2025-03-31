import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../../../services/shared.service';
import { ModalService } from '../../../services/modal.service';
import { Book, Category, User } from '../../../modals/shared.modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { LoaderComponent } from "../shared/loader/loader.component";
@Component({
  selector: 'app-explore-books',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NzSelectModule, LoaderComponent],
  templateUrl: './explore-books.component.html',
  styleUrl: './explore-books.component.css'
})
export class ExploreBooksComponent {
  authors: User[] = [];
  books: Book[] = [];
  selectedCategories: any[] = [];
  selectedAuthors: any[] = [];
  categories: Category[] = [];
  searchQuery: string = '';
  allBooks: Book[] = [];
  priceRanges = [
    { label: 'Below $50', min: 0, max: 50 },
    { label: '$51-$100', min: 51, max: 100 },
    { label: '$101-$200', min: 101, max: 200 },
    { label: '$201-$300', min: 201, max: 300 },
    { label: '$301-$400', min: 301, max: 400 }
  ];
  categoryId: number | undefined
  categoryName: string | undefined
  selectedPrices: { min: number; max: number }[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  loading: boolean = false
  constructor(private router: Router, private service: SharedService, private modalService: ModalService, private toastr: NzMessageService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['category']
      if (this.categoryId) {
        this.selectedCategories.push(Number(this.categoryId))
      }
    })
  }


  ngOnInit(): void {
    this.loading = true
    this.getAuthors();
    this.getBooks()
    this.getCategory()
    this.getAllBooks()
  }

  getAuthors() {
    let apiUrl = ''
    if (this.service.isLogedIn('user')) {
      apiUrl = 'users/getAllAuthor'
    } else {
      apiUrl = 'users/getAllAnonymousAuthor'
    }

    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.authors = resp.authors.filter((author: any) => author.books.length > 0);
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getBooks() {
    // this.loading = true
    // http://localhost:4005/api/users/getAllBooks?search=&price=&categories=
    let apiUrl = ''
    if (this.service.isLogedIn('user')) {
      apiUrl = `users/getAllBooks?search=${this.searchQuery.trim()}&categories=${this.selectedCategories.join(',')}`;
      if (this.minPrice !== null && this.maxPrice !== null) {
        apiUrl += `&minPrice=${this.minPrice}&maxPrice=${this.maxPrice}`;
      }
    } else {
      apiUrl = `users/getAllAnonymousBook?search=${this.searchQuery.trim()}&categories=${this.selectedCategories.join(',')}`
      if (this.minPrice !== null && this.maxPrice !== null) {
        apiUrl += `& minPrice=${this.minPrice}& maxPrice=${this.maxPrice} `;
      }
    }

    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.books = resp.books;
        this.loading = false
      },
      error: error => {
        console.log(error.message);
        this.loading = false
      }
    });
  }

  getCategory() {
    let apiUrl = ''
    if (this.service.isLogedIn('user')) {
      apiUrl = 'users/getAllCategories'
    } else {
      apiUrl = 'users/getAllAnonymousCategories'
    }

    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.categories = resp.categories;
        if (this.categoryId) {
          this.categoryName = this.categories.find(category => category.id == this.categoryId)?.name
        }
      },
      error: error => {
        console.log(error.message);
      }
    });
  }
  getAllBooks() {
    let apiUrl = ''
    if (this.service.isLogedIn('user')) {
      apiUrl = `users/getAllBooks`
    } else {
      apiUrl = `users/getAllAnonymousBook`
    }

    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.allBooks = resp.books;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  updatePriceRange(range: { min: number; max: number }, event: any) {
    if (event.target.checked) {
      this.selectedPrices.push(range);
    } else {
      this.selectedPrices = this.selectedPrices.filter(
        (r) => r.min !== range.min && r.max !== range.max
      );
    }

    if (this.selectedPrices.length > 0) {
      this.minPrice = Math.min(...this.selectedPrices.map(r => r.min));
      this.maxPrice = Math.max(...this.selectedPrices.map(r => r.max));
    } else {
      this.minPrice = null;
      this.maxPrice = null;
    }
    this.getBooks()
  }

  clearFilter() {
    this.selectedCategories = []
    this.selectedPrices = []
    this.minPrice = null;
    this.maxPrice = null;
    this.searchQuery = ''
    this.getBooks()
  }
}
