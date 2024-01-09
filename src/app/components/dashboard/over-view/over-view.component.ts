import {Component, OnInit} from '@angular/core';
import {faList} from "@fortawesome/free-solid-svg-icons";
import {takeUntil} from "rxjs";
import {OverViewService} from 'src/app/services/over.view.service';
import {IOverView} from "../../../interfaces/iover.view";
import {MainAbstract} from "../../../abstracts/main.abstract";

@Component({
  selector: 'app-over-view',
  templateUrl: './over-view .component.html',
  styleUrls: ['./over-view.component.scss']
})
export class OverViewComponent extends MainAbstract implements OnInit {
  faIcon = {faList};
  overView!: IOverView;

  constructor(private overViewService: OverViewService) {
    super();
  }

  ngOnInit(): void {
     this.overViewService.retrieve().pipe(takeUntil(this.subscription$)).subscribe((value) => {
      this.overView = value.data;
    });
  }

  override ngOnDestroy(): void {
  this.unSubscription();
  }

}
