import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatComponent } from "../chat/chat.component";
import { SharedService } from '../../../services/shared.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [RouterLink, ChatComponent],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent {
  sessions: any
  loading: boolean = false
  originalChatList: any[] = [];
  userInfo: any
  @ViewChild('messageTab') messageTab: any
  @ViewChild('chatComponent') chatComponent!: ChatComponent;
  selectedChatId?: number
  constructor(private service: SharedService, private modalService: ModalService) {
    if (!this.service.isLogedIn('user')) {
      this.modalService.openModal()
      return
    }
  }

  ngOnInit(): void {
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    });
    if (this.service.isLogedIn('user')) {
      this.getSessions()
      this.getAllChatList()
      return
    }
  }

  getAllChatList() {
    this.loading = true
    this.service.get(`chat/getAllGroupChats`).subscribe({
      next: (resp: any) => {
        this.loading = false
        this.originalChatList = resp.data
      },
      error: error => {
        this.loading = false
      }
    });
  }

  getSessions() {
    this.service.get('users/getQASession').subscribe({
      next: (resp: any) => {
        this.sessions = resp.QaSession;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  viewChat(id: number) {
    this.selectedChatId = id;
    this.messageTab.nativeElement.click();

    setTimeout(() => {
      this.chatComponent.getAllmessages(id);
    });
  }

  idAdded(item: any) {
    return item.participants.some((p: any) => p?.userId === this.userInfo.id);
  }
}
