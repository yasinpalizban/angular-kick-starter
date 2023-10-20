import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {faTrash} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  faIcon = {faTrash};
  deleteItem?: string;
  constructor(public bsModalRef: BsModalRef
  ) {

  }

  onModalHide(): void {
    this.bsModalRef.hide();
    this.bsModalRef.content.onClose.next(false);
  }

  onModalConfirm(): void {
    this.bsModalRef.hide();
    this.bsModalRef.content.onClose.next(true);
  }


}
