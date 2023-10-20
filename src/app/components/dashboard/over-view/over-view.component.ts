import {Component, OnInit} from '@angular/core';
import {faList} from "@fortawesome/free-solid-svg-icons";
import {Subscription, takeUntil} from "rxjs";
import {OverViewService} from 'src/app/services/over.view.service';
import {IOverView} from "../../../interfaces/over.view.interface";
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {MainAbstract} from "../../../abstracts/main.abstract";

@Component({
  selector: 'app-over-view',
  templateUrl: './over-view .component.html',
  styleUrls: ['./over-view.component.scss']
})
export class OverViewComponent extends MainAbstract implements OnInit {
  faIcon = {faList};
  overViewRows!: ResponseObject<IOverView>;

  constructor(private overViewService: OverViewService) {
    super();
  }

  ngOnInit(): void {

     this.overViewService.query().pipe(takeUntil(this.subscription$)).subscribe((data) => {
      this.overViewRows = data;
    });
  }

  override ngOnDestroy(): void {
  this.unSubscription();
  }

}
