import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "./alert.service";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../environments/environment";
import {IGraph} from "../interfaces/igraph.interface";
import {Graph} from "../models/graph.model";
import {IResponseObject} from "../interfaces/iresponse.object.interface";
import {Observable} from "rxjs";
import {GRAPH_SERVICE} from "../configs/path.constants";

@Injectable({
  providedIn: 'root'
})
export class GraphService extends ApiService<IResponseObject<IGraph>> implements IApiCommonFunction {

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override  translate: TranslateService,
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl=     environment.baseUrl + GRAPH_SERVICE.base;
  }


  query(argument?: number | string | object): Observable<IResponseObject<IGraph>> {
 return  super.get(argument);
  }

  save(graph: Graph): Observable<IResponseObject<IGraph>> {
    return this.post(graph);
  }


}
