import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { ModalService } from '../../../services/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Book } from '../../../modals/shared.modal';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../shared/loader/loader.component";
import { CartService } from '../../../services/cart.service';
declare var $: any;
@Component({
  selector: 'app-book-overview',
  standalone: true,
  imports: [RouterLink, CommonModule, LoaderComponent],
  templateUrl: './book-overview.component.html',
  styleUrl: './book-overview.component.css'
})
export class BookOverviewComponent {
  bookData!: Book;
  relatedBooks: Book[] = [];
  bookId!: number
  loading: boolean = false
  quantity: number = 1
  constructor(private router: Router, private service: SharedService, private modalService: ModalService, private toastr: NzMessageService, private route: ActivatedRoute, private cartService: CartService) {
    this.route.queryParams.subscribe(params => {
      this.bookId = params['id'];
      this.getBookById()
    })
  }

  ngOnInit(): void {
    // this.getBookById()
  }

  getBookById() {
    this.loading = true
    let apiUrl = ''
    if (this.service.isLogedIn()) {
      apiUrl = `users/getAllBook/${this.bookId}`
    } else {
      apiUrl = `users/getAllAnonymousBook/${this.bookId}`
    }
    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.bookData = resp.book;
        if (this.bookData?.bookMedia && Array.isArray(this.bookData.bookMedia)) {
          if (this.bookData.coverImage) {
            this.bookData.bookMedia.unshift({
              id: 0,
              bookId: this.bookData.id,
              mediaUrl: this.bookData.coverImage,
              type: "image",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
        let categories = this.bookData.books.map((e: any) => e.category.id);
        this.getBooks(categories)
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
      }
    });
  }

  getBooks(categories: any) {
    this.loading = true
    let apiUrl = ''
    if (this.service.isLogedIn()) {
      apiUrl = `users/getAllBooks?categories=${categories.join(',')}`;
    } else {
      apiUrl = `users/getAllAnonymousBook?categories=${categories.join(',')}`
    }

    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.relatedBooks = resp.books;
        this.loading = false
      },
      error: error => {
        console.log(error.message);
        this.loading = false
      }
    });
  }

  activeSlide = 0;
  ngAfterViewInit(): void {
    this.loading = true
    $(".ct_dot").eq(0).addClass("active");
    var owl = $(".ct_product_detail_slider");
    owl.owlCarousel({
      items: 1,
      loop: true,
      autoplay: false,
      autoplayTimeout: 3000,
      dots: false,
      nav: false,
    });
    owl.on("changed.owl.carousel", (event: any) => {
      var currentIndex = event.item.index - event.relatedTarget._clones.length / 2;
      $(".ct_dot").removeClass("active");
      $(".ct_dot").eq(currentIndex).addClass("active");
      this.loading = false
    });
    // this.loading = false
  }

  slide(index: any) {
    $(".ct_product_detail_slider").trigger("to.owl.carousel", [index, 300]);
  }

  read(url: string, title: string) {
    if (url.endsWith('.epub')) {
      this.router.navigate(['/epub-reader'], { queryParams: { url: url, title: title } });
    } else {
      this.router.navigate(['/pdf'], { queryParams: { url: url, title: title } });
    }
  }

  decreaseValue() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  increaseValue() {
    if (this.bookData.stock > this.quantity) {
      this.quantity++;
    } else {
      this.toastr.error('Stock not available');
    }
  }

  addToCart(book: any) {
    const isLoggedIn = this.service.isLogedIn();
    let data = {
      id: book.id,
      title: book.title,
      price: book.price,
      coverImage: book.coverImage,
      stock: book.stock
    }
    this.cartService.addToCart(data, this.quantity, isLoggedIn);
    this.toastr.success('Book added to cart successfully');
  }
}

