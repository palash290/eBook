// jitsi.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';

declare var JitsiMeetExternalAPI: any;

@Injectable({ providedIn: 'root' })
export class JitsiService {
      domain: string = '8x8.vc';
      api: any;
      appID = 'vpaas-magic-cookie-646cfb8847104798bde0488274ec44d9'; // Your AppID

      constructor(private router: Router, private service: SharedService) { }
      startMeeting(room: string, token: string, displayName: string, sessionId: string) {
            const options = {
                  roomName: `${this.appID}/${room}`,
                  jwt: 'eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtNjQ2Y2ZiODg0NzEwNDc5OGJkZTA0ODgyNzRlYzQ0ZDkvMGE3NTc1LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDU5OTg4MTMsImV4cCI6MTc0NjAwNjAxMywibmJmIjoxNzQ1OTk4ODA4LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtNjQ2Y2ZiODg0NzEwNDc5OGJkZTA0ODgyNzRlYzQ0ZDkiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImdhZ2FuLmN0aW5mb3RlY2giLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTA0NjQ4MDI4MjUxNzc3OTQxODY0IiwiYXZhdGFyIjoiIiwiZW1haWwiOiJnYWdhbi5jdGluZm90ZWNoQGdtYWlsLmNvbSJ9fSwicm9vbSI6IioifQ.hSe5soMtTTobWRlLzawN3sMnuVLYa9ezijzyKQa5tAmxfQ3JSgEAKheXRWQyHcV86HCqkOeuuVeHqZRFbD3LOnFeiY2CmOP-PEB9MGm6JISrxfioJj3imvnOlmrdPkvAJGtD34VzSj1PMtZaPMQOL7Iv1fq2nLzzowZudxCnITc0J1E9TNWDv79ZZMLWJO4V7HY9mLS7nsTYUjpV3CxiYDXvzb2m9ufFpEqdycsLfo9gx93oTvQ2uHq1AejpBr_lGPqkUfvm8kVoFUZR5xDTtvjs1MtOGT06NVcpOATEWgzYiKcgBx7H7IL4-ACqENEbT1dEHjHzdyQF_i_-_LkYew',
                  width: '100%',
                  height: '90vh',
                  parentNode: document.getElementById('jitsi-container'),
                  userInfo: {
                        displayName
                  },
                  interfaceConfigOverwrite: {
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_BRAND_WATERMARK: false,
                        SHOW_CHROME_EXTENSION_BANNER: false,
                        DEFAULT_LOCAL_DISPLAY_NAME: '',
                        DEFAULT_REMOTE_DISPLAY_NAME: '',
                        FILM_STRIP_ONLY: false,
                        TOOLBAR_BUTTONS: ['microphone', 'camera', 'chat', 'hangup']
                  },
                  configOverwrite: {
                        prejoinPageEnabled: false,
                        requireDisplayName: false,
                        startWithAudioMuted: false,
                        startWithVideoMuted: false
                  }
            };

            this.api = new JitsiMeetExternalAPI(this.domain, options);

            this.api.executeCommand('setFollowMe', true);

            this.api.addEventListener('videoConferenceJoined', () => {
                  this.pinModerator();
            });

            this.api.addEventListener('participantJoined', () => {
                  this.pinModerator();
            });

            this.api.addListener('readyToClose', () => {
                  this.service.delete(`author/endQASession/${sessionId}`).subscribe((resp: any) => {
                        if (resp.success) {
                              this.api.dispose();
                              this.router.navigate(['author/session']);
                        }
                  });
            });
      }



      JoinMeeting(room: string, displayName: string) {
            const options = {
                  roomName: `${this.appID}/${room}`,
                  width: '100%',
                  height: '90vh',
                  parentNode: document.getElementById('jitsi-container-xyz'),
                  userInfo: {
                        displayName
                  },
                  interfaceConfigOverwrite: {
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_BRAND_WATERMARK: false,
                        SHOW_CHROME_EXTENSION_BANNER: false,
                        DEFAULT_LOCAL_DISPLAY_NAME: '',
                        DEFAULT_REMOTE_DISPLAY_NAME: '',
                        FILM_STRIP_ONLY: false,
                        TOOLBAR_BUTTONS: ['chat', 'hangup']
                  },
                  configOverwrite: {
                        prejoinPageEnabled: false,
                        requireDisplayName: false,
                        startWithAudioMuted: true,
                        startWithVideoMuted: true
                  }
            };

            this.api = new JitsiMeetExternalAPI(this.domain, options);

            this.api.addEventListener('videoConferenceJoined', () => {
                  this.pinModerator();
            });

            this.api.addEventListener('participantJoined', () => {
                  this.pinModerator();
            });

            this.api.addListener('readyToClose', () => {
                  this.api.dispose();
                  this.router.navigate(['/community']);

            });
      }


      pinModerator() {
            const participants = this.api.getParticipantsInfo();
            this.api.executeCommand('pinParticipant', participants[0].participantId);
      }
}
