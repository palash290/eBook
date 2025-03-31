import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Book } from '../../../modals/shared.modal';
import { SharedService } from '../../../services/shared.service';
import { ModalService } from '../../../services/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-my-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './my-cart.component.html',
  styleUrl: './my-cart.component.css'
})
export class MyCartComponent {
  cartData: Book[] = [];
  originalCartData: Book[] = [];
  localCartData: Book[] = [];
  loading: boolean = false;
  disable: boolean = false;

  constructor(private router: Router, private service: SharedService, private modalService: ModalService, private toastr: NzMessageService, private cartservice: CartService) {

  }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    let data = localStorage.getItem('cart')
    if (data) {
      this.cartData = JSON.parse(data)
      this.localCartData = JSON.parse(data)
      this.cartservice.cartItems.set(this.cartData)
    }
    if (this.service.isLogedIn('user')) {
      this.getCartData()
    }
  }
  getCartData() {
    this.loading = true
    let apiUrl = 'users/getAllCart'

    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.originalCartData = resp.cart.length > 0 ? resp.cart : [];
        if (resp.cart.length > 0) {
          this.cartData = this.cartData.map(item => {
            const existingItem = resp.cart.find((c: any) => c.book.id === item.id);
            if (existingItem) {
              return {
                ...item,
                quantity: existingItem.quantity + item.quantity,
                cart_id: existingItem.id
              };
            }
            return item;
          });

          resp.cart.forEach((c: any) => {
            const existingItem = this.cartData.find(item => item.id === c.book.id);
            if (!existingItem) {
              this.cartData.push({
                ...c.book,
                quantity: c.quantity,
                cart_id: c.id
              });
            }
          });
        } else {
          this.cartData = []
        }
        this.cartservice.cartItems.set(this.cartData)
        this.loading = false
      },
      error: error => {
        console.log(error.message);
        this.loading = false
      }
    });
  }

  remove(id: number) {
    const existingItem = this.originalCartData.find((item: any) => item.bookId === id);
    if (existingItem) {
      if (this.service.isLogedIn('user')) {
        this.service.delete(`users/deleteCart/${existingItem.id}`).subscribe({
          next: (resp: any) => {
            this.getCartData()
            this.toastr.success('Item removed successfully');
          },
          error: error => {
            this.toastr.error(error);
          }
        });
      } else {
        this.cartData = this.localCartData.filter(item => item.id !== id);
        this.cartservice.cartItems.set(this.cartData);
        localStorage.setItem('cart', JSON.stringify(this.cartData))
        this.toastr.success('Item removed successfully');
      }
    } else {
      this.cartData = this.localCartData.filter(item => item.id !== id);
      this.cartservice.cartItems.set(this.cartData);
      localStorage.setItem('cart', JSON.stringify(this.cartData))
      this.toastr.success('Item removed successfully');
    }
  }

  increaseQuantity(item: any) {
    if (item.stock > item.quantity) {
      item.quantity += 1;
      if (this.service.isLogedIn('user')) {
        this.updateQuantity(item.cart_id, item.quantity)
      } else {
        this.cartservice.addToCart(item, 0, false)
        // this.toastr.success('Cart updated successfully');
      }
    } else {
      this.disable = true
      this.toastr.error('Stock not available');
    }
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.disable = false
      if (this.service.isLogedIn('user')) {
        this.updateQuantity(item.cart_id, item.quantity)
      } else {
        this.cartservice.addToCart(item, -0, false)
        // this.toastr.success('Cart updated successfully');
      }
    }
  }

  getSubtotal(): number {
    return this.cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTotal(): number {
    return this.getSubtotal();
  }

  updateQuantity(id: number, quantity: number) {
    const data = {
      id: id,
      quantity: quantity
    }

    this.service.update('users/updateCart', data).subscribe({
      next: (resp: any) => {
        // this.toastr.success(resp.message);
      },
      error: error => console.error('Error adding to cart:', error)
    });
  }
}
