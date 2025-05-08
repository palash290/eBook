import { Component, computed, Signal } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { User } from '../../../../modals/auth.modal';
import { CartService } from '../../../../services/cart.service';
import { MyCartComponent } from '../../my-cart/my-cart.component';
import { WishlistComponent } from '../../wishlist/wishlist.component';
import { NotificationService } from '../../../../services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [MyCartComponent, WishlistComponent]
})
export class HeaderComponent {
  userInfo: User | null = null;
  eBookToken: any = null;
  cartCount: Signal<number>;
  favCount: Signal<number>;
  notifications: any[] = []
  constructor(private modalService: ModalService, private service: SharedService, private router: Router, private cartService: CartService, private myCartComponent: MyCartComponent, private wishlistComponent: WishlistComponent, private notification: NotificationService, private toastr: NzMessageService) {
    this.cartCount = computed(() => this.cartService.cartCount());
    this.favCount = computed(() => this.service.FavCount());
  }

  ngOnInit(): void {
    this.eBookToken = localStorage.getItem('eBookToken_user');
    this.service.getProfile('users/myProfile', 'user')
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    });
    this.myCartComponent.getData()
    if (this.service.isLogedIn('user')) {
      this.getNotification()
      this.wishlistComponent.getFavBooks()
    }

    this.notification.message$.subscribe((msg) => {
      if (msg && this.service.isLogedIn('user')) {
        this.getNotification()
      }
    });
  }

  openLoginModal() {
    this.modalService.openModal();
    this.close()
  }

  logout() {
    this.router.navigate(['/reader-login'])
    this.service.logout();
  }
  close() {
    const element = document.getElementsByClassName('ct_nav_menu_list');
    Array.from(element).forEach(el => el.classList.remove('ct_menu_show'));
  }


  getNotification() {
    this.service.get('users/getAllUserNotification').subscribe({
      next: (resp: any) => {
        this.notifications = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  // http://localhost:4005/api/author/delete/6%27

  deleteNotification(id: number) {
    this.service.delete(`users/delete/${id}`).subscribe({
      next: (res: any) => {
        this.notifications = this.notifications.filter((item: any) => item.id !== id);
      },
      error: (error) => {
        // this.toastr.error(error);
      }
    })
  }

  clearNotification() {
    this.service.delete(`users/deleteAll`).subscribe({
      next: (res: any) => {
        this.notifications = [];
      },
      error: (error) => {
        this.toastr.error(error);
      }
    })
  }
}
