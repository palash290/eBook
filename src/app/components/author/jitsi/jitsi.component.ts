import { Component } from '@angular/core';
import { JitsiService } from '../../../services/jitsi.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-jitsi',
  standalone: true,
  imports: [],
  templateUrl: './jitsi.component.html',
  styleUrl: './jitsi.component.css'
})
export class JitsiComponent {
  userInfo: any;
  loading: boolean = false;
  roomName = 'stream-' + Math.random().toString(36).substring(2, 10);

  constructor(private jitsiService: JitsiService, private router: Router, private service: SharedService, private toastr: NzMessageService) { }


  startStream() {
    this.jitsiService.startMeeting(this.roomName, 'Author');
  }

  ngOnInit(): void {
    this.getProfile()
  }


  getProfile() {
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    });
  }
}
