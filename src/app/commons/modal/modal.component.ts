import { Component,} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {ModalType} from "../../enums/modal.enum";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  {
  faIcon = {faTrash};
  deleteItem!: string;
  type:ModalType = ModalType.text;
  constructor(public bsModalRef: BsModalRef) {
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
