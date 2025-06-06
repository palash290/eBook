import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from "../shared/loader/loader.component";
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, NzImageModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  providers: [DatePipe]
})
export class ChatComponent {
  @Input() GroupId?: number;
  messages: string[] = [];
  newMessage: string = '';
  authorId: any;
  loading: boolean = false;
  allMessages: any[] = []
  authorDetail: any
  userInfo: any;
  participantList: any[] = [];
  chatList: any[] = [];
  originalChatList: any[] = [];
  constructor(private socketService: SocketService, private apiService: SharedService, private route: ActivatedRoute, private datePipe: DatePipe, private toastService: NzMessageService) {
    this.route.queryParams.subscribe(params => {
      this.authorId = params['author'];
    })
  }

  ngOnInit() {
    this.socketService.connect();
    this.socketService.getMessage().subscribe((message) => {
      const index = this.chatList.findIndex((chat) => chat.id === message.chatId);
      if (index > -1) {
        const lastChat = this.chatList.splice(index, 1);
        this.chatList.unshift(lastChat[0])
        if (lastChat[0]) {
          lastChat[0].unreadCount += 1;
          if (!lastChat[0].lastMessage) {
            lastChat[0].lastMessage = {};
          }
          lastChat[0].lastMessage.content = message.content || 'Sent an attachment';
          // lastChat[0].lastMessage.content = message.content || 'Sent an attachment';
        } 
      }

      if (this.activeChatId === message.chatId) {
        this.allMessages.push(message);
      }
      // this.activeChatId = message.chatId;
    });
    if (this.apiService.isLogedIn('user')) {
      this.createChatRoom();
    }
    this.apiService.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    });
  }

  newParticipant: any;

  createChatRoom() {
    if (this.authorId) {
      this.loading = true
      this.apiService.postAPI(`chat/chatOnetoOne/${this.authorId}`, {}).subscribe({
        next: (resp: any) => {
          this.loading = false
          this.authorDetail = resp?.payload?.participants?.[0] || resp?.data?.participants?.[0]
          this.activeChatId = resp.payload?.id || resp.data?.id;
          this.getAllChatList()
          this.getAllmessages(this.activeChatId)
        },
        error: error => {
          this.loading = false
        }
      });
    } else {
      this.getAllChatList2()
    }
  }

  activeChatId: any

  getAllChatList() {
    this.loading = true
    this.apiService.get(`chat/getAllChats`).subscribe({
      next: (resp: any) => {
        this.loading = false
        this.originalChatList = resp.data
        this.chatList = [...this.originalChatList]
        // this.activeChatId = this.originalChatList[0]?.id
        // this.getAllmessages(this.originalChatList[0]?.id)
      },
      error: error => {
        this.loading = false
      }
    });
  }
  getAllChatList2() {
    this.loading = true
    this.apiService.get(`chat/getAllChats`).subscribe({
      next: (resp: any) => {
        this.loading = false
        this.originalChatList = resp.data
        this.chatList = [...this.originalChatList]
        this.activeChatId = this.originalChatList[0]?.id
        this.getAllmessages(this.originalChatList[0]?.id)
      },
      error: error => {
        this.loading = false
      }
    });
  }

  getAllmessages(chatId: number) {
    this.apiService.get(`chat/getAllMessages/${chatId}`).subscribe({
      next: (resp: any) => {
        this.allMessages = resp.messages.reverse()
        this.activeChatId = chatId
        this.chatList.map((c: any) => c.id == chatId ? c.unreadCount = 0 : c.unreadCount)
        this.authorDetail = this.chatList.find((c: any) => c.id == chatId)?.isGroupChat ? this.chatList.find((c: any) => c.id == chatId) : this.chatList.find((c: any) => c.id == chatId)?.participants[0]?.Author
      },
      error: error => {
        this.loading = false
      }
    });
  }

  uploading: boolean = false
  sendMessage() {

    if (this.files.length > 0) {
      let formData = new FormData()
      if (this.files && this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
          formData.append('files', this.files[i]);
        }
      }
      this.uploading = true
      this.apiService.postAPI('chat/uploadImages', formData).subscribe((res: any) => {
        if (res.success) {
          this.sendNormalMsg(res.filenames);
          setTimeout(() => {
            this.getAllmessages(this.activeChatId);
            this.uploading = false
          }, 100);
        } else {
          this.uploading = false
        }
      })
    } else {
      if (this.newMessage.trim().length == 0) {
        return
      }
      this.sendNormalMsg('');
      setTimeout(() => {
        this.getAllmessages(this.activeChatId);
        this.uploading = false
      }, 100);
    }
  };

  sendNormalMsg(filenames?: any) {
    const msg = {
      chatId: this.activeChatId,
      content: this.newMessage?.trim(),
      isLink: 0,
      fileNames: filenames && filenames.length > 0 ? filenames.join(',') : null,
      isUser: 1
    };
    this.socketService.sendMessage(msg).then(() => {
      this.allMessages.push(msg);
      setTimeout(() => {
        this.getAllmessages(this.activeChatId);
      }, 100);

    })
      .catch((error) => { });


    this.newMessage = '';
    this.files = [],
      this.previewFiles = []
  }


  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.newMessage.trim() && !event.shiftKey) {
      event.preventDefault();
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
      const maxFiles = 5;
      const selectedFiles = Array.from(input.files);
      if (selectedFiles.length > maxFiles) {
        this.toastService.error(`You can only select up to ${maxFiles} images.`);
        input.value = '';
        return;
      }

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

  search(event: any) {
    const searchValue = event.target.value.trim().toLowerCase();

    if (searchValue) {
      this.chatList = this.originalChatList.filter(list =>
        list.participants[0].Author?.fullName.toLowerCase().includes(searchValue) || list.name.toLowerCase().includes(searchValue)
      );
    } else {
      this.chatList = [...this.originalChatList];
    }
  }

  show() {
    const chatBox = document.querySelector('.chatbox');
    if (chatBox) {
      chatBox.classList.add('showbox');
    }
  }

  closeChatBox() {
    const chatBox = document.querySelector('.chatbox');
    if (chatBox) {
      chatBox.classList.remove('showbox');
    }
  }

  exitGroup() {

    let formData = {
      chatId: this.activeChatId,
      userId: this.userInfo.id
    }

    this.loading = true
    this.apiService.postAPI('chat/leaveGroup', formData).subscribe({
      next: (resp: any) => {
        this.loading = false
        this.getAllChatList2()
        this.toastService.success(resp.message)
      },
      error: error => {
        this.loading = false
      }
    });
  }
}
