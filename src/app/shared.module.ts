import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BootstrapModule} from './bootstrap.module';
import {AlertComponent} from './helpers/alert/alert.component';
import {NotFoundPageComponent} from './helpers/not-found-page/not-found-page.component';
import {RouterModule} from '@angular/router';

import {ClipboardModule} from 'ngx-clipboard';
import {CKEditorModule} from 'ckeditor4-angular';
import {ForbiddenPageComponent} from './helpers/forbidden-page/forbidden-page.component';
import {NgSelect2Module} from 'ng-select2';

import {NgxSpinnerModule} from 'ngx-spinner';
import {SpinnerComponent} from './helpers/spinner/spinner.component';
import {ConvertDatePipe} from './pipes/convert.date.pipe';
import {TranslateModule} from "@ngx-translate/core";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {SearchingFiledComponent} from "./helpers/searching-filed/searching.filed .component";
import {ModalComponent} from "./helpers/modal/modal.component";
import {ToastComponent} from "./helpers/toast/toast.component";
@NgModule({
  declarations: [
    AlertComponent,
    NotFoundPageComponent,
    ForbiddenPageComponent,
    SpinnerComponent,
    ConvertDatePipe,
    SearchingFiledComponent,
    ModalComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BootstrapModule,
    RouterModule,
    CKEditorModule,
    ClipboardModule,
    NgSelect2Module,
    NgxSpinnerModule,
    TranslateModule,
    FontAwesomeModule,
    Ng2SearchPipeModule

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BootstrapModule,
    AlertComponent,
    NotFoundPageComponent,
    SearchingFiledComponent,
    ModalComponent,
    ToastComponent,
    RouterModule,
    CKEditorModule,
    ClipboardModule,
    NgSelect2Module,
    NgxSpinnerModule,
    ConvertDatePipe,
    TranslateModule,
    FontAwesomeModule,
    Ng2SearchPipeModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class SharedModule {
}

