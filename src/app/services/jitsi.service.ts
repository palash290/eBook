// jitsi.service.ts
import { Injectable } from '@angular/core';

declare var JitsiMeetExternalAPI: any;

@Injectable({ providedIn: 'root' })
export class JitsiService {
      domain: string = 'meet.jit.si';
      api: any;
      private isMeetingJoined = false;
      startMeeting(room: string, displayName: string, containerId: string = 'jitsi-container') {
            const options = {
                  roomName: room,
                  width: '100%',
                  height: 600,
                  parentNode: document.getElementById(containerId),
                  userInfo: {
                        displayName: displayName
                  },
                  interfaceConfigOverwrite: {
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_BRAND_WATERMARK: false,
                        // TOOLBAR_BUTTONS: [],
                        SHOW_CHROME_EXTENSION_BANNER: false,
                  },
                  configOverwrite: {
                        startWithAudioMuted: false,
                        startWithVideoMuted: false
                  }
            };
            this.api = new JitsiMeetExternalAPI(this.domain, options);

            

            this.api.on('videoConferenceJoined', () => {
                  console.log(36666666666666666666,'Successfully joined meeting');
                  this.isMeetingJoined = true; // Mark as joined
                });
              
                this.api.on('videoConferenceLeft', () => {
                  if (this.isMeetingJoined) { // Critical check!
                    console.log(4222222222222222222222,'User intentionally left meeting');
                    this.handleMeetingEnd();
                  }
                });
      }

      handleMeetingEnd = () => {
            console.log('Meeting ended - navigating away');
            // Add your navigation logic here
            // this.router.navigate(['/post-meeting-route']);
      }
      endMeeting() {
            if (this.api) {
                  this.api.dispose();
            }
      }

}
