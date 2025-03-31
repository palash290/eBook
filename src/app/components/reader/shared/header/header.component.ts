import { Component, computed, Signal } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { User } from '../../../../modals/auth.modal';
import { Book } from '../../../../modals/shared.modal';
import { CartService } from '../../../../services/cart.service';
import { MyCartComponent } from '../../my-cart/my-cart.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [MyCartComponent]
})
export class HeaderComponent {
  userInfo: User | null = null;
  eBookToken: any = null;
  cartCount: Signal<number>;

  constructor(private modalService: ModalService, private service: SharedService, private router: Router, private cartService: CartService, private myCartComponent: MyCartComponent) {
    this.cartCount = computed(() => this.cartService.cartCount());
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

}
