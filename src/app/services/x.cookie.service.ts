import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {filter} from "rxjs/operators";
import {XCookieServiceInterface} from "../interfaces/x.cookie.service.interface";
import {CookieService} from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class XCookieService   implements XCookieServiceInterface {
  private shoppingListLength: BehaviorSubject<number>;

  constructor(private  myCookieService: CookieService) {

    this.shoppingListLength = new BehaviorSubject<number>(0);
    if (this.getCookie().length) {
      this.shoppingListLength = new BehaviorSubject<number>(this.getCookie().length);
    } else {
      this.shoppingListLength = new BehaviorSubject<number>(0);
    }
  }


  addToCookie(id: number): void {

    let box: number[] = [];

    if (!this.myCookieService.check('userCookie')) {

      box[0] = id;
      this.myCookieService.set('userCookie', JSON.stringify(box), {expires: 2, sameSite: 'Lax'});
    } else {
      box = JSON.parse(this.myCookieService.get('userCookie'));
      let flag: boolean = false;
      box.find(num => {
        if (num == id) {
          flag = true;
        }
      });
      if (!flag) {
        box.push(id);
        this.myCookieService.set('userCookie', JSON.stringify(box), {expires: 2, sameSite: 'Lax'});

      }

    }

    this.shoppingListLength.next(box.length);
  }

  isCooke(): boolean {
    return this.myCookieService.check('userCookie');
  }

  getCookie(): number[] {
    let box: number[] = [];
    if (this.myCookieService.check('userCookie')) {
      box = JSON.parse(this.myCookieService.get('userCookie'));

    }

    return box;

  }

  deleteToCookie(id: number): void {
    let box: number[];

    box = JSON.parse(this.myCookieService.get('userCookie'));
    box = box.filter(idd => idd !== id);

    this.myCookieService.set('userCookie', JSON.stringify(box), {expires: 2, sameSite: 'Lax'});


  }
  deleteAllCookie(): void {
    this.myCookieService.deleteAll();
  }

  getShoppingListLengthObservable(): Observable<number> {
    return this.shoppingListLength.asObservable().pipe(filter(result => !!result));
  }


}
