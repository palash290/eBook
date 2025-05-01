import { Component } from '@angular/core';
import { JitsiService } from '../../../services/jitsi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoaderComponent } from "../../reader/shared/loader/loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jitsi',
  standalone: true,
  imports: [LoaderComponent, CommonModule],
  templateUrl: './jitsi.component.html',
  styleUrl: './jitsi.component.css'
})
export class JitsiComponent {
  userInfo: any;
  loading: boolean = false;
  sessionId: any
  roomName = 'stream-' + Math.random().toString(36).substring(2, 10);

  constructor(public jitsiService: JitsiService, private router: Router, private service: SharedService, private toastr: NzMessageService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['sessionId'];
    })
  }


  ngOnInit(): void {
    this.getProfile()

    let formData = {
      roomId: this.roomName,
    }

    let formData2 = {
      roomName: this.roomName,
      userName: this.userInfo.fullName
    }

    this.service.postAPI(`author/startQASession/${this.sessionId}`, formData).subscribe((resp: any) => {
      if (resp.success) {
        this.service.postAPI(`author/generate-LiveStreamToken`, formData2).subscribe((resp: any) => {
          if (resp.success) {
            this.jitsiService.startMeeting(this.roomName, resp.token, this.userInfo.fullName, this.sessionId);
          } else {
            this.toastr.warning(resp.message);
          }
        });
      } else {
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
