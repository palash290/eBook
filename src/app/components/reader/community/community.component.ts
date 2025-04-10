import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [RouterLink, ChatComponent],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent {

}
