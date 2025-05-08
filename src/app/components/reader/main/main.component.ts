import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Book, Category, User } from '../../../modals/shared.modal';
import { LoaderComponent } from "../shared/loader/loader.component";
declare var Swiper: any;
declare var $: any;
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterLink, CommonModule, LoaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  loading: boolean = false;
  ngAfterViewInit(): void {
    this.loading = true;
    setTimeout(() => {
      const swiper = new Swiper(".mySwiper", {
        spaceBetween: 15,
        slidesPerView: 5,
        loop: true,
        autoplay: {
          delay: 10,
          disableOnInteraction: false,
        },
        allowTouchMove: false,
        speed: 30,

        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          320: { slidesPerView: 1, spaceBetween: 10 },
          480: { slidesPerView: 2, spaceBetween: 10 },
          768: { slidesPerView: 3, spaceBetween: 15 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1300: { slidesPerView: 4, spaceBetween: 20 },
          1500: { slidesPerView: 5, spaceBetween: 20 },
        },
      });

      $(".ct_top_categories_slider").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1356: {
            items: 3,
          },
        },
      });

      $(".ct_top_selling_book_slider").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        center: true,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 5,
          },
        },
      });

      $(".ct_top_author_slider").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1356: {
            items: 3,
          },
        },
      });
      this.loading = false
    }, 1500);
  }

  allBooks: Book[] = [];
  topAuthors: User[] = [];
  categories: Category[] = [];

  constructor(private router: Router, public service: SharedService) { }


  ngOnInit(): void {
    //localStorage.setItem('userRole', 'author');
    this.getAllBooks();
    this.getTopAuthors();
    this.getCategory()
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
        console.log('books');
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


  getTopAuthors() {
    let apiUrl = ''
    if (this.service.isLogedIn('user')) {
      apiUrl = 'users/getTopAuthor'
    } else {
      apiUrl = 'users/getAnonymousTopAuthor'
    }

    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.topAuthors = resp.topAuthors;
      },
      error: error => {
        console.log(error.message);
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
        this.categories = resp.categories.filter((cat: any) => cat.books.length > 0);
        console.log('cate');
      },
      error: error => {
        console.log(error.message);
      }
    });
  }
}
