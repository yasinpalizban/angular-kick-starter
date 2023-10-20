import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "./alert.service";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../environments/environment";
import {IGraph} from "../interfaces/graph.interface";
import {Graph} from "../models/graph.model";
import {ResponseObject} from "../interfaces/response.object.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GraphService extends ApiService<ResponseObject<IGraph>> implements IApiCommonFunction {

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override  translate: TranslateService,
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl=     environment.baseUrl + 'graph';
  }


  query(argument?: number | string | object): Observable<ResponseObject<IGraph>> {
 return  super.get(argument);
  }

  save(graph: Graph): Observable<ResponseObject<IGraph>> {
    return this.post(graph);
  }


}
