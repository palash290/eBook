import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalService } from '../services/modal.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private toastr: NzMessageService, private modalService: ModalService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userRole = localStorage.getItem('userRole');
    const effectiveRole = userRole === 'reader' ? 'user' : userRole;
    const authToken = localStorage.getItem(`eBookToken_${effectiveRole}`);

    let modifiedRequest: HttpRequest<any>;
    if (req.body instanceof FormData) {
      modifiedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });

    } else if (typeof req.body === 'object' && req.body !== null) {
      modifiedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });

    } else {
      modifiedRequest = req.clone({
        setHeaders: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(modifiedRequest).pipe(
      catchError(error => {
        let errorMessage = 'An unknown error occurred!';
        if (error.status === 401) {
          errorMessage = error.error.message
          // this.modalService.openModal();
        } else if (error.status === 403) {
          this.toastr.error('Unauthorized! Please log in again.');
          this.modalService.openModal();
        } else if (error.status === 400) {
          errorMessage = error.error.message || 'Bad request. Please try again.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.status === 0) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = error.message || 'An error occurred.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

