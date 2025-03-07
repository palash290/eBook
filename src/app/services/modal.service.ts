import { Injectable } from '@angular/core';
declare var bootstrap: any;

@Injectable({
      providedIn: 'root'
})
export class ModalService {
      private modalInstance!: any;

      setModal(modalElement: HTMLElement) {
            this.modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
      }

      openModal() {
            if (this.modalInstance) {
                  this.modalInstance.show();
            }
      }

      closeModal() {
            if (this.modalInstance) {
                  this.modalInstance.hide();
            }
      }
}
