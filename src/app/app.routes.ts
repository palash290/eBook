import { Routes } from '@angular/router';

export const routes: Routes = [

      // {
      //       path: '',
      //       loadChildren: () => {
      //             if (localStorage.getItem('userRole') == 'author') {
      //                   return import('./components/author/author.routes').then(m => m.authorRoutes);
      //             } else {
      //                   return import('./components/reader/reader.routes').then(m => m.readerRoutes);
      //             }
      //       }
      // },
      {
            path: 'author',
            loadChildren: () => import('./components/author/author.routes').then(m => m.authorRoutes)
      },
      {
            path: '',
            loadChildren: () => import('./components/reader/reader.routes').then(m => m.readerRoutes)
      },
      {
            path: 'auther-login',
            loadComponent: () => import('./components/author/auther-login/auther-login.component').then(m => m.AutherLoginComponent)
      },
      {
            path: 'reader-login',
            loadComponent: () => import('./components/reader/reader-login/reader-login.component').then(m => m.ReaderLoginComponent)
      },
      {
            path: 'auther-signup',
            loadComponent: () => import('./components/author/auther-signup/auther-signup.component').then(m => m.AutherSignupComponent)
      },
      {
            path: 'reader-signup',
            loadComponent: () => import('./components/reader/reader-signup/reader-signup.component').then(m => m.ReaderSignupComponent)
      },
      {
            path: 'forgot-password',
            loadComponent: () => import('./components/reader/shared/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      }

      // { path: 'publish', component: PublisherComponent, canActivate: [RoleGuard], data: { roles: ['publisher'] } },
      // { path: 'library', component: UserLibraryComponent, canActivate: [RoleGuard], data: { roles: ['logged-in user', 'publisher'] } },
      // { path: 'browse', component: BrowseBooksComponent } 
];
