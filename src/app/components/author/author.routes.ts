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
                        loadComponent: () => import('./auther-dashboard/auther-dashboard.component').then(m => m.AutherDashboardComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'book-management',
                        loadComponent: () => import('./auther-book-management/auther-book-management.component').then(m => m.AutherBookManagementComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'add-book',
                        loadComponent: () => import('./auther-book-management/add-book/add-book.component').then(m => m.AddBookComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'book-details',
                        loadComponent: () => import('./auther-book-management/book-details/book-details.component').then(m => m.BookDetailsComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'profile-customization',
                        loadComponent: () => import('./auther-profile-customization/auther-profile-customization.component').then(m => m.AutherProfileCustomizationComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'manage-chatrooms',
                        loadComponent: () => import('./auther-chatrooms/auther-chatrooms.component').then(m => m.AutherChatroomsComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'sales-earnings',
                        loadComponent: () => import('./auther-sales-earnings/auther-sales-earnings.component').then(m => m.AutherSalesEarningsComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'change-password',
                        loadComponent: () => import('./change-password/change-password.component').then(m => m.ChangePasswordComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'jitsi',
                        loadComponent: () => import('./jitsi/jitsi.component').then(m => m.JitsiComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'group-chat',
                        loadComponent: () => import('./group-chat/group-chat.component').then(m => m.GroupChatComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'session',
                        loadComponent: () => import('./session-management/session-management.component').then(m => m.SessionManagementComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'add-session',
                        loadComponent: () => import('./session-management/add-session/add-session.component').then(m => m.AddSessionComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'live-session',
                        loadComponent: () => import('./session-management/live-session/live-session.component').then(m => m.LiveSessionComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'my-plan',
                        loadComponent: () => import('./my-plan/my-plan.component').then(m => m.MyPlanComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'reviews',
                        loadComponent: () => import('./rating-reviews/rating-reviews.component').then(m => m.RatingReviewsComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'subscription-plan',
                        loadComponent: () => import('./subscription-plan/subscription-plan.component').then(m => m.SubscriptionPlanComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'payment-success',
                        loadComponent: () => import('./payment-success/payment-success.component').then(m => m.PaymentSuccessComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
                  {
                        path: 'payment-failed',
                        loadComponent: () => import('./payment-failed/payment-failed.component').then(m => m.PaymentFailedComponent),
                        canActivate: [RoleGuard], data: { roles: ['author'] }
                  },
            ],
            //canActivate: [RoleGuard], data: { roles: ['author'] }
      },

];
