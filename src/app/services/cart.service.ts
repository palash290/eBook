import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
      providedIn: 'root'
})
export class CartService {
      cartItems = signal<any[]>([]);
      cartCount = computed(() => this.cartItems().length);

      constructor(private http: HttpClient, private toster: NzMessageService) {
            this.loadCartFromLocalStorage();
      }

      addToCart(bookData: any, quantity: number, isLoggedIn: boolean) {
            if (isLoggedIn) {
                  const formData = { bookId: bookData.id, quantity };

                  this.http.post(environment.baseUrl + 'users/addToCart', formData).subscribe({
                        next: (resp: any) => {
                              this.updateCartFromAPI();
                              this.toster.success(resp.message);
                        },
                        error: error => this.toster.error(error)
                  });
            } else {
                  let cartData = [...this.cartItems()];
                  const index = cartData.findIndex((item) => item.id === bookData.id);

                  if (index !== -1) {
                        cartData[index].quantity += quantity;
                  } else {
                        cartData.push({ ...bookData, quantity });
                  }

                  localStorage.setItem('cart', JSON.stringify(cartData));
                  this.cartItems.set(cartData);
                  this.toster.success('Book added to cart successfully');
            }
      }

      updateCartFromAPI() {
            this.http.get<any[]>(environment.baseUrl + 'users/getAllCart').subscribe({
                  next: (cartData: any) => {
                        this.cartItems.set(cartData.cart);
                  },
                  error: (error) => console.error('Error fetching cart:', error)
            });
      }

      private loadCartFromLocalStorage() {
            const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            this.cartItems.set(storedCart);
      }
}
