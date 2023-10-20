import {Injectable, OnDestroy,} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export abstract class MainAbstract implements OnDestroy {
  title: string = '';
  component: string = '';
  controller: string = '';
  protected readonly subscription$: Subject<any> = new Subject<any>();

  ngOnDestroy(): void {
    this.unSubscription();
  }

  protected unSubscription() {
    this.subscription$.next(null);
    this.subscription$.complete();
  }

}
