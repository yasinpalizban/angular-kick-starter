import {BasicModel} from "./basic.model";

export class Graph  extends BasicModel{


  public type: string  | undefined;
  public fromDate: string | undefined;
  public toDate: string | undefined;


  constructor(init?: Partial<Graph>) {
    super();
    Object.assign(this, init);
  }
}
