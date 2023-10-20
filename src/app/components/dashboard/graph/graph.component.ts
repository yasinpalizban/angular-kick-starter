import {Component, OnDestroy, OnInit} from '@angular/core';
import {faAsterisk, faCalendar, faChartArea, faList} from '@fortawesome/free-solid-svg-icons';
import {GraphService} from "../../../services/graph.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {AlertService} from "../../../services/alert.service";
import {Subscription, takeUntil} from "rxjs";
import {Graph} from "../../../models/graph.model";
import {getDateByName} from "../../../utils/get.date.by.name";
import {IGraph} from "../../../interfaces/graph.interface";
import {Color} from "@swimlane/ngx-charts/lib/utils/color-sets";
import {ScaleType} from "@swimlane/ngx-charts";
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {BasicForm} from "../../../abstracts/basic.form";
import {Router} from "@angular/router";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent extends BasicForm implements OnInit, OnDestroy {
  graphData!: ResponseObject<IGraph>;
  faIcon = {faChartArea, faList, faAsterisk, faCalendar};
  view: number[] = [600, 400];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Sales';
  timeline = true;

  colorScheme: Color = {
    name: 'x',
    selectable: false,
    group: ScaleType.Linear,
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };
  //pie
  showLabels = true;

  constructor(protected graphService: GraphService,
              private formBuilder: FormBuilder,
              private translate: TranslateService,
              private alertService: AlertService,
              protected override router: Router) {
    super(router);
  }

  ngOnInit(): void {

    this.formGroup = this.formBuilder.group({
      _type: new FormControl('', [
        Validators.required,
      ]),
      date: new FormControl(''),
      fromDate: new FormControl('',),
      toDate: new FormControl(''),

    });

    this.graphService.query().pipe(takeUntil(this.subscription$)).subscribe((data) => {
      this.graphData = data;
    });

  }


  onSubmit(): void {
    if ((!this.formGroup.value.date || this.formGroup.value.date == 'none') &&
      !this.formGroup.value.fromDate &&
      !this.formGroup.value.toDate) {
      this.alertService.error(this.translate.instant(['error.selectDate']), this.alertService.alertOption);
      return;
    }

    if (this.formGroup.invalid) {
      return;
    }

    const fromDate: string = this.formGroup.value.fromDate.length > 0 ? this.formGroup.value.fromDate : getDateByName(this.formGroup.value.date);
    const toDate: string = this.formGroup.value.toDate.length > 0 ? this.formGroup.value.toDate : getDateByName('today');

    this.submitted = true;
    const graph = new Graph({
      type: this.formGroup.value._type,
      toDate: toDate.replace("\//", "-"),
      fromDate: fromDate.replace("\//", "-")
    });



    this.graphService.save(graph).pipe(takeUntil(this.subscription$)).subscribe((data) => {
      this.graphData = data;
    });
  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.graphService.unsubscribe();
  }

}
