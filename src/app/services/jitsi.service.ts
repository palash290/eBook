// jitsi.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';

declare var JitsiMeetExternalAPI: any;

@Injectable({ providedIn: 'root' })
export class JitsiService {
      domain: string = '8x8.vc';
      api: any;
      appID = 'vpaas-magic-cookie-ac4bf583f094448683be178052e5faaa'; // Your AppID

      constructor(private router: Router, private service: SharedService) { }
      startMeeting(room: string, token: string, displayName: string, sessionId: string) {
            const options = {
                  roomName: `${this.appID}/${room}`,
                  jwt: token,
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



      JoinMeeting(room: string, displayName: string, sessionId: string) {
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
                  this.service.postAPI('users/joinSession', { sessionId: sessionId }).subscribe()
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
