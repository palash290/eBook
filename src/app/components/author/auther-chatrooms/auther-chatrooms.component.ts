import { Component } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auther-chatrooms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auther-chatrooms.component.html',
  styleUrl: './auther-chatrooms.component.css'
})
export class AutherChatroomsComponent {
  messages: string[] = [];
  newMessage: string = '';
  authorDetail: any
  constructor(private socketService: SocketService, private apiService: SharedService) {

  }

  ngOnInit() {
    this.socketService.connect();
    this.socketService.getMessage().subscribe((message) => {
      this.messages.push(message);
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
      message: this.newMessage?.trim(),
      image_path: img_path
    };
    this.socketService
      .sendMessage(msg)
      .then(() => {
        // this.chats.push(msg);
      })
      .catch((error) => {
      });
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
}

