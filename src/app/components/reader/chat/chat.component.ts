import { Component } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from "../shared/loader/loader.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  providers: [DatePipe]
})
export class ChatComponent {
  messages: string[] = [];
  newMessage: string = '';
  authorId: any;
  loading: boolean = false;
  chatList: any[] = []
  allMessages: any[] = []
  authorDetail: any
  userInfo: any;
  constructor(private socketService: SocketService, private apiService: SharedService, private route: ActivatedRoute, private datePipe: DatePipe) {
    this.route.queryParams.subscribe(params => {
      this.authorId = params['author'];
    })
  }

  ngOnInit() {
    this.socketService.connect();
    this.socketService.getMessage().subscribe((message) => {
      this.messages.push(message);
    });
    this.createChatRoom();
    this.apiService.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    });

    this.socketService.getMessage().subscribe((chats) => {
      this.chatList.push(chats);
    });
  }

  createChatRoom() {
    this.loading = true
    this.apiService.postAPI(`chat/chatOnetoOne/${this.authorId}`, {}).subscribe({
      next: (resp: any) => {
        this.loading = false
        this.getAllChatList()
      },
      error: error => {
        this.loading = false
      }
    });
  }

  getAllChatList() {
    this.loading = true
    this.apiService.get(`chat/getAllChats`).subscribe({
      next: (resp: any) => {
        this.loading = false
        this.chatList = resp.data
        this.getAllmessages(this.chatList[0].id)
      },
      error: error => {
        this.loading = false
      }
    });
  }

  getAllmessages(chatId: number) {
    this.apiService.get(`chat/getAllMessages/${chatId}`).subscribe({
      next: (resp: any) => {
        this.allMessages = resp.messages
        this.authorDetail = this.chatList.find((c: any) => c.id == 33)?.participants[0].Author
      },
      error: error => {
        this.loading = false
      }
    });
  }

  sendMessage() {
    if (this.files.length > 0) {
      let formData = new FormData()
      if (this.files && this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
          formData.append('socket_image_message', this.files[i]);
        }
      }

      this.apiService.postAPI('user/socket-imagesend', formData).subscribe((res: any) => {
        if (res.success) {
          this.sendNormalMsg(res.data)
        }
      })
    } else {
      if (this.newMessage.trim().length == 0) {
        return
      }
      this.sendNormalMsg('')
    }
  };

  sendNormalMsg(img_path: string) {
    const msg = {
      chatId: 30,
      content: this.newMessage?.trim(),
      isLink: 0,
      fileNames: null,
      isUser: 1
    };
    this.socketService.sendMessage(msg).then(() => {
      this.chatList.push(msg);
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
