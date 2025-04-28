import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatComponent } from "../chat/chat.component";
import { SharedService } from '../../../services/shared.service';

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
  originalChatList: any[] = []
  constructor(private service: SharedService) { }

  ngOnInit(): void {
    this.getSessions()
    this.getAllChatList()
  }

  getAllChatList() {
    this.loading = true
    this.service.get(`chat/getAllChats`).subscribe({
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
}
