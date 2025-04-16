import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
      providedIn: 'root',
})
export class SocketService {
      private socket!: Socket;

      constructor() {
      }

      connect() {
            const userRole = localStorage.getItem('userRole');
            const effectiveRole = userRole === 'reader' ? 'user' : userRole;
            const authToken = localStorage.getItem(`eBookToken_${effectiveRole}`);

            this.socket = io(environment.socketUrl, {
                  query: {
                        isUser: userRole === 'reader' ? 1 : 0
                  },
                  extraHeaders: {
                        Authorization: `Bearer ${authToken}`
                  }
            });
      }


      sendMessage(data: any): Promise<any> {
            return new Promise((resolve, reject) => {
                  this.socket.emit('sendMessage', {
                        data: {
                              ...data
                        }
                  }, (response: any) => {
                        if (response.success) {
                              resolve(response);
                        } else {
                              reject(response.error);
                        }
                  });
            });
      };

      getMessage(): Observable<any> {
            return new Observable((observer) => {
                  this.socket.on('messageReceived', (data) => {
                        observer.next(data);
                  });
            });
      };

      sendUserLogin(userId: number): void {
            this.socket.emit('user_login', userId);
      }

      disconnect() {
            if (this.socket) {
                  this.socket.disconnect();
            }
      }

      reconnect() {
            if (this.socket) {
                  this.socket.connect();
            }
      }
}
