import { Component } from '@angular/core';
import { JitsiService } from '../../../services/jitsi.service';

@Component({
  selector: 'app-jitsi',
  standalone: true,
  imports: [],
  templateUrl: './jitsi.component.html',
  styleUrl: './jitsi.component.css'
})
export class JitsiComponent {
  constructor(private jitsiService: JitsiService) { }

  roomName = 'stream-' + Math.random().toString(36).substring(2, 10);

  startStream() {
    this.jitsiService.startMeeting(this.roomName, 'Author');
  }
}
