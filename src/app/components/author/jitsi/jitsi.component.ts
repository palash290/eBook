import { Component } from '@angular/core';
import { JitsiService } from '../../../services/jitsi.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  sessionId: any
  roomName = 'stream-' + Math.random().toString(36).substring(2, 10);

  constructor(private jitsiService: JitsiService, private router: Router, private service: SharedService, private toastr: NzMessageService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['sessionId'];
    })
  }


  ngOnInit(): void {
    this.getProfile()

    let formData = {
      roomId: this.roomName,
    }

    this.service.postAPI(`author/startQASession/${this.sessionId}`, formData).subscribe((resp: any) => {
      if (resp.success) {
        this.toastr.success(resp.message);
        this.loading = false;
        this.router.navigateByUrl('author/live-session');
        this.jitsiService.startMeeting(this.roomName, this.userInfo.fullName);
      } else {
        this.loading = false;
        this.toastr.warning(resp.message);
      }
    });
  }


  getProfile() {
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    });
  }
}
