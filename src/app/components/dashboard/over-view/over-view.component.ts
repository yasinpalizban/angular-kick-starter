import { Component, OnInit } from '@angular/core';
import {faList} from "@fortawesome/free-solid-svg-icons";
import {Subscription} from "rxjs";
import { OverViewService } from 'src/app/services/over.view.service';
import {IOverView} from "../../../interfaces/over.view.interface";

@Component({
  selector: 'app-over-view',
  templateUrl: './over-view .component.html',
  styleUrls: ['./over-view.component.scss']
})
export class OverViewComponent implements OnInit {
  faIcon={faList};
  overViewRows!: IOverView;
  subscription: Subscription;

  constructor(private overViewService: OverViewService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.overViewService.query();
    this.subscription = this.overViewService.getDataObservable().subscribe((data: IOverView) => {
      this.overViewRows = data;
    });
  }

  ngOnDestroy(): void {
    this.overViewService.unsubscribe();
    this.subscription.unsubscribe();
  }

}
