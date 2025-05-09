import { Component, ElementRef, ViewChild } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { SharedService } from '../../../services/shared.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-auther-chatrooms',
  standalone: true,
  imports: [CommonModule, FormsModule, NzImageModule, ReactiveFormsModule, NzSelectModule],
  templateUrl: './auther-chatrooms.component.html',
  styleUrl: './auther-chatrooms.component.css',
  providers: [DatePipe]
})
export class AutherChatroomsComponent {
  messages: string[] = [];
  newMessage: string = '';
  authorDetail: any
  loading: boolean = false;
  participantList: any[] = [];
  originalChatList: any[] = [];
  allMessages: any[] = [];
  userDetail: any;
  userInfo: any;
  @ViewChild('submitModalClose') submitModalClose!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeDelete') closeDelete!: ElementRef<HTMLButtonElement>;
  readers: any[] = [];
  AllReaders: any[] = [];
  Form: FormGroup;
  selectedReaders: any[] = [];
  profilePreview: string | undefined
  profileImage: any
  groupChatId: any
  constructor(private socketService: SocketService, private apiService: SharedService, private datePipe: DatePipe, private toastService: NzMessageService, private fb: FormBuilder) {
    this.Form = this.fb.group({
      chatName: ['', [Validators.required, NoWhitespaceDirective.validate]],
      description: ['', [Validators.required, NoWhitespaceDirective.validate, Validators.maxLength(150)]],
      receiverIds: [[], [Validators.required, NoWhitespaceDirective.validate]],
    });
  }

  ngOnInit() {
    this.socketService.connect();
    this.socketService.getMessage().subscribe((message) => {
      // this.allMessages.push(message);
      const index = this.participantList.findIndex((chat) => chat.id === message.chatId);
      if (index > -1) {
        const lastChat = this.participantList.splice(index, 1);
        this.participantList.unshift(lastChat[0])
        if (lastChat[0]) {
          lastChat[0].unreadCount += 1;
          if (!lastChat[0].lastMessage) {
            lastChat[0].lastMessage = {};
          }
          lastChat[0].lastMessage.content = message.content || 'Sent an attachment';
        }
      }

      if (this.activeChatId === message.chatId) {
        this.allMessages.push(message);
      }
      // this.activeChatId = message.chatId;
    });
    this.getAllChatList();

    this.apiService.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    });
    this.getReaders();
  }

  activeChatId: any

  getAllChatList() {
    this.loading = true
    this.apiService.get(`author/getAllChats`).subscribe({
      next: (resp: any) => {
        this.loading = false
        this.originalChatList = resp.data
        this.participantList = [...this.originalChatList];
        this.getAllmessages(this.originalChatList[0]?.participants[0]?.chatId, this.originalChatList[0]?.isGroupChat ? this.originalChatList[0] : this.originalChatList[0]?.participants[0])
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
        this.userDet = userDetail.User ? userDetail.User : userDetail;
        // this.getAllChatList();
        this.participantList.map((c: any) => c.id == userId ? c.unreadCount = 0 : c.unreadCount)
        const chatBox = document.querySelector('.chatbox');
        if (chatBox) {
          chatBox.classList.add('showbox');
        }
        //this.userDetail = this.chatList.find((c: any) => c.id == chatId)?.participants[0].Author
      },
      error: error => {
        this.loading = false
      }
    });
  }

  closeChatBox() {
    const chatBox = document.querySelector('.chatbox');
    if (chatBox) {
      chatBox.classList.remove('showbox');
    }
  }

  onProfileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.profileImage = file
    }
  }

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
      this.apiService.postAPI('author/uploadImages', formData).subscribe((res: any) => {
        if (res.success) {
          this.sendNormalMsg(res.filenames);
          setTimeout(() => {
            this.getAllmessages(this.activeChatId, this.userDet);
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
        this.getAllmessages(this.activeChatId, this.userDet);
        this.uploading = false
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
      this.allMessages.push(msg);
      setTimeout(() => {
        this.getAllmessages(this.activeChatId, this.userDet);
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
      this.participantList = this.originalChatList.filter(list =>
        list.participants[0].User?.fullName.toLowerCase().includes(searchValue) || list.name.toLowerCase().includes(searchValue)
      );
    } else {
      this.participantList = [...this.originalChatList];
    }
  }

  searchMember(event: any) {
    const searchValue = event.target.value.trim().toLowerCase();

    if (searchValue) {
      this.readers = this.AllReaders.filter(list =>
        list.fullName.toLowerCase().includes(searchValue)
      );
    } else {
      this.readers = [...this.AllReaders];
    }
  }

  getReaders() {
    this.apiService.get('author/getAllFollwedUser').subscribe({
      next: (resp: any) => {
        this.readers = resp.users;
        this.AllReaders = resp.users;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  onSubmit(): void {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched()
      return
    }

    this.loading = true;

    let formData = new FormData();

    formData.append('name', this.Form.value.chatName.trim());
    formData.append('description', this.Form.value.description.trim());
    if (this.profileImage) {
      formData.append('profilePic', this.profileImage);
    }

    // let formData = {
    //   chatName: this.Form.value.chatName,
    //   description: this.Form.value.description,
    //   receiverIds: this.Form.value.receiverIds,
    //   profilePic: this.profileImage
    // }

    if (this.groupChatId) {
      this.apiService.update(`author/editGroupChat/${this.groupChatId}`, formData).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toastService.success(res.message);
            this.submitModalClose.nativeElement.click();
            this.Form.reset();
            this.groupChatId = null;
            this.profilePreview = undefined
            this.getAllChatList();
          } else {
            this.loading = false;
            this.toastService.warning(res.message);
          }
        },
        error: (error) => {
          this.loading = false;
          this.toastService.error(error);
        }
      });
    } else {
      formData.append('receiverIds', this.Form.value.receiverIds);

      this.apiService.postAPI('author/createGroupChat', formData).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.toastService.success(res.message);
            this.submitModalClose.nativeElement.click();
            this.Form.reset();
            this.getAllChatList();
          } else {
            this.loading = false;
            this.toastService.warning(res.message);
          }
        },
        error: (error) => {
          this.loading = false;
          this.toastService.error(error);
        }
      });
    }
  }

  isAdded(id: any) {
    return this.userDet?.participants?.find((p: any) => p.userId == id)
  }

  editGroupChat(data: any) {
    this.groupChatId = data.id
    this.profilePreview = data.profilePic
    this.Form.patchValue({
      chatName: data.name,
      description: data.description,
      receiverIds: data.participants.map((p: any) => p.userId)
    })
  }

  removeMember(item: any) {
    this.apiService.delete(`author/members/${this.activeChatId}/${item.id}`).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastService.success(res.message);
          const exist = this.readers.find((p: any) => p.id == item.id);
          if (!exist) {
            this.readers.push(item);
          }
          this.userDet!.participants = this.userDet!.participants.filter((p: any) => p.User?.id != item.id);
        } else {
          this.loading = false;
          this.toastService.warning(res.message);
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastService.error(error);
      }
    });
  }


  AddMember(item: any) {
    let formData = {
      receiverIds: [item.id],
      chatId: this.activeChatId
    }

    this.apiService.postAPI(`author/members`, formData).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastService.success(res.message);
          this.readers = this.readers.filter((p: any) => p.id != item.id);
          const newParticipant = {
            User: item
          };
          return this.userDet?.participants.push(newParticipant)
        } else {
          this.loading = false;
          this.toastService.warning(res.message);
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastService.error(error);
      }
    });
  }

  deleteGroupChat() {
    this.apiService.delete(`author/deleteGroupChat/${this.activeChatId}`).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastService.success(res.message);
          this.getAllChatList();
          this.closeDelete.nativeElement.click();
        } else {
          this.loading = false;
          this.toastService.warning(res.message);
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastService.error(error);
      }
    });
  }
}

export class NoWhitespaceDirective {
  static validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { required: true };
    }
    return null;
  }


}


