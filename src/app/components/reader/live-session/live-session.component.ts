import { Component } from '@angular/core';
import { JitsiService } from '../../../services/jitsi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-live-session',
  standalone: true,
  imports: [],
  templateUrl: './live-session.component.html',
  styleUrl: './live-session.component.css'
})
export class LiveSessionComponent {
  userInfo: any;
  loading: boolean = false;
  sessionId: any
  roomName = 'stream-' + Math.random().toString(36).substring(2, 10);

  constructor(public jitsiService: JitsiService, private router: Router, private service: SharedService, private toastr: NzMessageService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.roomName = params['session'];
      this.sessionId = params['id'];
    })
  }


  ngOnInit(): void {
    this.getProfile()

    this.jitsiService.JoinMeeting(this.roomName, this.userInfo.fullName, this.sessionId);

  }


  getProfile() {
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    });
  }
}
