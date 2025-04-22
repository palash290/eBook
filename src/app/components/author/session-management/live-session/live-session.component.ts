import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../../../../services/shared.service';
import { Router } from '@angular/router';
import { JitsiComponent } from "../../jitsi/jitsi.component";

@Component({
  selector: 'app-live-session',
  standalone: true,
  imports: [JitsiComponent],
  templateUrl: './live-session.component.html',
  styleUrl: './live-session.component.css'
})
export class LiveSessionComponent {

}
