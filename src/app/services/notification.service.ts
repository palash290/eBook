import { Injectable, inject } from '@angular/core';
import { Messaging, getMessaging, getToken, onMessage } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
      providedIn: 'root'
})
export class NotificationService {
      private messaging = inject(Messaging);
      currentToken = new BehaviorSubject<string | null>(null);
      private messageSource = new BehaviorSubject<any>(null);
      message$ = this.messageSource.asObservable();

      constructor() {
            // this.listenForMessages();
      }

      async requestPermission() {
            try {
                  const token = await getToken(this.messaging, {
                        vapidKey: environment.firebaseConfig.vapidKey
                  });

                  if (token) {
                        this.currentToken.next(token);
                        localStorage.setItem('fcm_token', token);
                  } else {
                        console.warn("No token received. Request permission again.");
                  }
            } catch (error) {
                  console.error("Permission denied for notifications", error);
            }
      }

      listenForMessages() {
            const messaging = getMessaging();
            onMessage(messaging, (payload) => {
                  console.log(" noticiation payload componet", payload);
                  this.setMessage(payload)

                  const title = payload.notification?.title || 'Notification';
                  const body = payload.notification?.body || '';
                  new Notification(title, {
                        body: body,
                        icon: 'assets/img/logo.svg',
                  });
            });
      }

      setMessage(value: any) {
            this.messageSource.next(value);
      }

}
