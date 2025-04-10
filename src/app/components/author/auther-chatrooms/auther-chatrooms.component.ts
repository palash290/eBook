import { Component } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auther-chatrooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auther-chatrooms.component.html',
  styleUrl: './auther-chatrooms.component.css',
  providers: [DatePipe]
})
export class AutherChatroomsComponent {
  messages: string[] = [];
  newMessage: string = '';
  authorDetail: any
  loading: boolean = false;
  participantList: any;
  allMessages: any[] = [];
  userDetail: any;
  userInfo: any;

  constructor(private socketService: SocketService, private apiService: SharedService, private datePipe: DatePipe) {

  }

  ngOnInit() {
    this.socketService.connect();
    this.socketService.getMessage().subscribe((message) => {
      this.messages.push(message);
    });
    this.getAllChatList();

    this.apiService.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    });
    this.socketService.getMessage().subscribe((chats) => {
      this.chatList.push(chats);
    });
  }

  activeChatId: any

  getAllChatList() {
    this.loading = true
    this.apiService.get(`author/getAllChats`).subscribe({
      next: (resp: any) => {
        //debugger

        this.loading = false
        this.participantList = resp.data;
        //this.activeChatId = this.chatList[0].id
        //this.getAllmessages(this.chatList[0].id)
      },
      error: error => {
        this.loading = false
      }
    });
  }

  userDet: any;

  getAllmessages(userId: number, userDetail: any) {
    this.apiService.get(`author/getAllMessages/${userId}`).subscribe({
      next: (resp: any) => {
        this.allMessages = resp.messages.reverse();
        this.activeChatId = userId;
        this.userDet = userDetail.User;
        this.getAllChatList();

        //this.userDetail = this.chatList.find((c: any) => c.id == chatId)?.participants[0].Author
      },
      error: error => {
        this.loading = false
      }
    });
  }

  chatList: any[] = []

  // sendMessage() {
  //   if (this.files.length > 0) {
  //     let formData = new FormData()
  //     if (this.files && this.files.length > 0) {
  //       for (let i = 0; i < this.files.length; i++) {
  //         formData.append('socket_image_message', this.files[i]);
  //       }
  //     }

  //     this.apiService.postAPI('user/socket-imagesend', formData).subscribe((res: any) => {
  //       if (res.success) {
  //         this.sendNormalMsg(res.data)
  //       }
  //     })
  //   } else {
  //     if (this.newMessage.trim().length == 0) {
  //       return
  //     }
  //     this.sendNormalMsg('')
  //   }
  // };
  sendMessage() {
    //debugger
    if (this.files.length > 0) {
      let formData = new FormData()
      if (this.files && this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
          formData.append('files', this.files[i]);
        }
      }

      this.apiService.postAPI('author/uploadImages', formData).subscribe((res: any) => {
        if (res.success) {
          this.sendNormalMsg(res.filenames);
          setTimeout(() => {
            this.getAllmessages(this.activeChatId, '');
          }, 100);
        }
      })
    } else {
      if (this.newMessage.trim().length == 0) {
        return
      }
      this.sendNormalMsg('');
      setTimeout(() => {
        this.getAllmessages(this.activeChatId, '');
      }, 100);
    }
  };

  // sendNormalMsg(img_path: string) {
  //   const msg = {
  //     message: this.newMessage?.trim(),
  //     image_path: img_path
  //   };
  //   this.socketService
  //     .sendMessage(msg)
  //     .then(() => {
  //       // this.chats.push(msg);
  //     })
  //     .catch((error) => {
  //     });
  //   this.newMessage = '';
  //   this.files = [],
  //     this.previewFiles = []
  // }
  sendNormalMsg(filenames?: any) {
    const msg = {
      chatId: this.activeChatId,
      content: this.newMessage?.trim(),
      isLink: 0,
      fileNames: filenames && filenames.length > 0 ? filenames.join(',') : null,
      isUser: 0
    };
    this.socketService.sendMessage(msg).then(() => {
      this.chatList.push(msg);
      setTimeout(() => {
        this.getAllmessages(this.activeChatId, '');
      }, 100);

    })
      .catch((error) => { });
    this.newMessage = '';
    this.files = [],
      this.previewFiles = []
  }

  onKeyDown(event: KeyboardEvent) {

    if (event.key === 'Enter' && this.newMessage.trim()) {
      this.sendMessage();
    }
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  files: any[] = [];
  previewFiles: { name: string; type: string; url: string }[] = [];

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        this.files.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewFiles.push({
            name: file.name,
            type: file.type,
            url: e.target?.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeFile(fileToRemove: any): void {
    const index = this.previewFiles.indexOf(fileToRemove);
    if (index > -1) {
      this.previewFiles.splice(index, 1);
      this.files.splice(index, 1);
    }
  }

  formatDate(timestamp: Date) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (timestamp > oneHourAgo) {
      return this.datePipe.transform(timestamp, 'shortTime');
    } else if (timestamp > oneDayAgo) {
      return this.datePipe.transform(timestamp, 'mediumTime');
    } else {
      return this.datePipe.transform(timestamp, 'medium');
    }
  }


}

