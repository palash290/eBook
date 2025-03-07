import { Routes } from '@angular/router';

export const readerRoutes: Routes = [
      {
            path: '',
            loadComponent: () =>
                  import('./home/home.component').then(m => m.HomeComponent),
            children: [
                  {
                        path: '',
                        loadComponent: () => import('./main/main.component').then(m => m.MainComponent)
                  },
                  {
                        path: 'explore-books',
                        loadComponent: () => import('./explore-books/explore-books.component').then(m => m.ExploreBooksComponent)
                  },
                  {
                        path: 'authors-and-publishers',
                        loadComponent: () => import('./authors-and-publishers/authors-and-publishers.component').then(m => m.AuthorsAndPublishersComponent)
                  },
                  {
                        path: 'community',
                        loadComponent: () => import('./community/community.component').then(m => m.CommunityComponent)
                  },
                  {
                        path: 'wishlist',
                        loadComponent: () => import('./wishlist/wishlist.component').then(m => m.WishlistComponent)
                  },
                  {
                        path: 'my-cart',
                        loadComponent: () => import('./my-cart/my-cart.component').then(m => m.MyCartComponent)
                  },
                  {
                        path: 'checkout',
                        loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent)
                  },
                  {
                        path: 'book-overview',
                        loadComponent: () => import('./book-overview/book-overview.component').then(m => m.BookOverviewComponent)
                  },
                  {
                        path: 'chat',
                        loadComponent: () => import('./chat/chat.component').then(m => m.ChatComponent)
                  },

                  {
                        path: 'edit-reader',
                        loadComponent: () => import('./edit-reader/edit-reader.component').then(m => m.EditReaderComponent)
                  },
                  {
                        path: 'reader-order-history',
                        loadComponent: () => import('./reader-order-history/reader-order-history.component').then(m => m.ReaderOrderHistoryComponent)
                  },
                  {
                        path: 'purchased-books',
                        loadComponent: () => import('./purchased-books/purchased-books.component').then(m => m.PurchasedBooksComponent)
                  },
                  {
                        path: 'followed-authors',
                        loadComponent: () => import('./followed-authors/followed-authors.component').then(m => m.FollowedAuthorsComponent)
                  },
                  {
                        path: 'favourite-books',
                        loadComponent: () => import('./favourite-books/favourite-books.component').then(m => m.FavouriteBooksComponent)
                  },
                  {
                        path: 'pdf',
                        loadComponent: () => import('./shared/pdf/pdf.component').then(m => m.PdfComponent)
                  },
                  {
                        path: 'reader-change-password',
                        loadComponent: () => import('./reader-change-password/reader-change-password.component').then(m => m.ReaderChangePasswordComponent)
                  },
            ]
      },

];
