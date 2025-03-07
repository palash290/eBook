import { Routes } from '@angular/router';
import { RoleGuard } from '../../guards/roleGuard';

export const authorRoutes: Routes = [
      {
            path: '',
            loadComponent: () =>
                  import('./auther-home/auther-home.component').then(m => m.AutherHomeComponent),
            children: [
                  {
                        path: 'auther-dashboard',
                        loadComponent: () => import('./auther-dashboard/auther-dashboard.component').then(m => m.AutherDashboardComponent)
                  },
                  {
                        path: 'book-management',
                        loadComponent: () => import('./auther-book-management/auther-book-management.component').then(m => m.AutherBookManagementComponent)
                  },
                  {
                        path: 'add-book',
                        loadComponent: () => import('./auther-book-management/add-book/add-book.component').then(m => m.AddBookComponent)
                  },
                  {
                        path: 'book-details',
                        loadComponent: () => import('./auther-book-management/book-details/book-details.component').then(m => m.BookDetailsComponent)
                  },
                  {
                        path: 'profile-customization',
                        loadComponent: () => import('./auther-profile-customization/auther-profile-customization.component').then(m => m.AutherProfileCustomizationComponent)
                  },
                  {
                        path: 'manage-chatrooms',
                        loadComponent: () => import('./auther-chatrooms/auther-chatrooms.component').then(m => m.AutherChatroomsComponent)
                  },
                  {
                        path: 'sales-earnings',
                        loadComponent: () => import('./auther-sales-earnings/auther-sales-earnings.component').then(m => m.AutherSalesEarningsComponent)
                  },
                  {
                        path: 'change-password',
                        loadComponent: () => import('./change-password/change-password.component').then(m => m.ChangePasswordComponent)
                  },
            ],
            //canActivate: [RoleGuard], data: { roles: ['author'] }
      },

];
