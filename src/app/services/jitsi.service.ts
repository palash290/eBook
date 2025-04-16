// jitsi.service.ts
import { Injectable } from '@angular/core';

declare var JitsiMeetExternalAPI: any;

@Injectable({ providedIn: 'root' })
export class JitsiService {
      domain: string = 'meet.jit.si';
      api: any;

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
                        TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup'],
                        SHOW_CHROME_EXTENSION_BANNER: false,
                  },
                  configOverwrite: {
                        startWithAudioMuted: false,
                        startWithVideoMuted: false
                  }
            };
            this.api = new JitsiMeetExternalAPI(this.domain, options);

            this.api.addEventListeners({
                  readyToClose: this.handleVideoConferenceLeft,
            });
      }
      handleVideoConferenceLeft = () => {
            console.log('handleVideoConferenceLeft hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
      };
      endMeeting() {
            if (this.api) {
                  this.api.dispose();
            }
      }
}
