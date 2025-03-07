import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
declare var Swiper: any;
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  ngAfterViewInit(): void {
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
  }

  allBooks: any;
  topAuthors: any;

  constructor(private router: Router, private service: SharedService) { }


  ngOnInit(): void {
    //localStorage.setItem('userRole', 'author');
    // this.getAllBooks();
    // this.getTopAuthors();
  }



  getAllBooks() {
    this.service.getApi(`users/getAllAnonymousBook?lowLimit=5`).subscribe({
      next: resp => {
        this.allBooks = resp.books;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getTopAuthors() {
    this.service.getApi(`users/getAnonymousTopAuthor`).subscribe({
      next: resp => {
        this.topAuthors = resp.topAuthors;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }




}
