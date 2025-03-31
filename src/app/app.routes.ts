import { Routes } from '@angular/router';
import { RoleGuard } from './guards/roleGuard';

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
            loadChildren: () => import('./components/author/author.routes').then(m => m.authorRoutes),
            canActivate: [RoleGuard], data: { roles: ['author'] }
      },
      {
            path: '',
            loadChildren: () => import('./components/reader/reader.routes').then(m => m.readerRoutes)
      },
      {
            path: 'author-login',
            loadComponent: () => import('./components/author/auther-login/auther-login.component').then(m => m.AutherLoginComponent)
      },
      {
            path: 'reader-login',
            loadComponent: () => import('./components/reader/reader-login/reader-login.component').then(m => m.ReaderLoginComponent)
      },
      {
            path: 'author-signup',
            loadComponent: () => import('./components/author/auther-signup/auther-signup.component').then(m => m.AutherSignupComponent)
      },
      {
            path: 'reader-signup',
            loadComponent: () => import('./components/reader/reader-signup/reader-signup.component').then(m => m.ReaderSignupComponent)
      },
      {
            path: 'reader-forgot-password',
            loadComponent: () => import('./components/reader/reader-forget-password/reader-forget-password.component').then(m => m.ReaderForgetPasswordComponent)
      },
      {
            path: 'reader-otp-verification',
            loadComponent: () => import('./components/reader/reader-otp-verification/reader-otp-verification.component').then(m => m.ReaderOtpVerificationComponent)
      },
      {
            path: 'reader-reset-password',
            loadComponent: () => import('./components/reader/reader-reset-password/reader-reset-password.component').then(m => m.ReaderResetPasswordComponent)
      },
      {
            path: 'reader-reset-success',
            loadComponent: () => import('./components/reader/reader-reset-success/reader-reset-success.component').then(m => m.ReaderResetSuccessComponent)
      },
      {
            path: 'author-forgot-password',
            loadComponent: () => import('./components/author/author-forget-password/author-forget-password.component').then(m => m.AuthorForgetPasswordComponent)
      },
      {
            path: 'author-otp-verification',
            loadComponent: () => import('./components/author/author-otp-verification/author-otp-verification.component').then(m => m.AuthorOtpVerificationComponent)
      },
      {
            path: 'author-reset-password',
            loadComponent: () => import('./components/author/author-reset-password/author-reset-password.component').then(m => m.AuthorResetPasswordComponent)
      },
      {
            path: 'author-reset-success',
            loadComponent: () => import('./components/author/author-reset-success/author-reset-success.component').then(m => m.AuthorResetSuccessComponent)
      },

      // { path: 'publish', component: PublisherComponent, canActivate: [RoleGuard], data: { roles: ['publisher'] } },
      // { path: 'library', component: UserLibraryComponent, canActivate: [RoleGuard], data: { roles: ['logged-in user', 'publisher'] } },
      // { path: 'browse', component: BrowseBooksComponent } 
];
