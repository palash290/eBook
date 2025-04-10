import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { ModalService } from '../../../services/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Book, BookMedia, User } from '../../../modals/shared.modal';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../shared/loader/loader.component";
import { CartService } from '../../../services/cart.service';
import { WishlistComponent } from '../wishlist/wishlist.component';
declare var $: any;
@Component({
  selector: 'app-book-overview',
  standalone: true,
  imports: [RouterLink, CommonModule, LoaderComponent],
  templateUrl: './book-overview.component.html',
  styleUrl: './book-overview.component.css',
  providers: [WishlistComponent]
})
export class BookOverviewComponent {
  bookData!: Book;
  relatedBooks: Book[] = [];
  bookId!: number
  loading: boolean = false
  quantity: number = 1
  categoryNames: any
  userInfo: User | null = null
  constructor(private router: Router, private service: SharedService, private modalService: ModalService, private toastr: NzMessageService, private route: ActivatedRoute, private cartService: CartService, private wishlist: WishlistComponent) {
    this.route.queryParams.subscribe(params => {
      this.bookId = params['id'];
      this.getBookById()
    })
  }

  ngOnInit(): void {
    // this.getBookById()
    const data = localStorage.getItem('userInfo');
    if (data) {
      this.userInfo = JSON.parse(data);
    }
  }

  getBookById() {
    this.loading = true
    let apiUrl = ''
    if (this.service.isLogedIn('user')) {
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
          if (this.bookData?.books?.length > 0) {
            this.categoryNames = this.bookData.books
              .map((c: any) => c.category?.name)
              .filter(name => name)
              .join(' | ');
          } else {
            this.categoryNames = 'No Categories';
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
    if (this.service.isLogedIn('user')) {
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

  read(bookData: any) {
    if (bookData.pdfUrl.endsWith('.epub')) {
      this.router.navigate(['/epub-reader'], { queryParams: { url: bookData.pdfUrl, id: bookData.id, title: bookData.title } });
    } else {
      this.router.navigate(['/pdf'], { queryParams: { url: bookData.pdfUrl, id: bookData.id, title: bookData.title } });
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
    const isLoggedIn = this.service.isLogedIn('user');
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

  addToFav(bookId: number) {
    if (this.service.isLogedIn('user')) {
      // this.loading = true
      this.service.postAPI('users/favBook', { bookId: bookId }).subscribe({
        next: (resp: any) => {
          // this.toastr.success(resp.message);
          this.loading = false
          this.bookData.isFavorite = !this.bookData.isFavorite
          this.wishlist.getFavBooks()
        },
        error: error => {
          console.log(error.message);
          this.loading = false
        }
      });
    } else {
      this.modalService.openModal()
    }
  }

  reloadComponent(item: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/book-overview'], { queryParams: { id: item.id } });
    });
  }

  isFav(item: any) {
    return item.following?.some((_e: any) => _e.followerId === this.userInfo?.id);
  }
}
