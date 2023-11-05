import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {INotification} from '../interfaces/inotification.interface';
import {BehaviorSubject, Observable, Subject, Subscription, takeUntil} from 'rxjs';
import {filter} from 'rxjs/operators';

import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {NotificationType} from '../enums/notification.enum';
import {explodeUrl} from '../utils/explode-url';
// import Pusher from 'pusher-js';
import {urlPath} from '../utils/url-path';
import {HeaderServiceInterface} from "../interfaces/header.service.interface";


declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class HeaderService implements HeaderServiceInterface {
  pusher: any;
  notificationChannel: any;
  roomChannel: any;
  pvChannel: any;
  private newNotification: BehaviorSubject<INotification> = new BehaviorSubject<INotification>({});
  private explodeLink: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  protected readonly subscription$: Subject<any> = new Subject<any>();
  url: string='';
  private language: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public urlPath: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private  router: Router, private aRoute: ActivatedRoute) {
    try {
      this.pusher = new Pusher(environment.pusher.key, {
        cluster: environment.pusher.cluster,
        forceTLS: true
      });
      this.notificationChannel = this.pusher.pipe(takeUntil(this.subscription$)).subscribe('notification-channel');
      this.notificationChannel.bind('my-event', (notify: INotification) => {
        this.newNotification.next(notify);
      });
    } catch (e) {
    }


  }

  checkUrlParams(): void {
    this.aRoute.url.pipe(takeUntil(this.subscription$)).subscribe((n) => {
        this.url = this.router.url;
        const value = explodeUrl(this.router.url);
        this.explodeLink.next(value);
        const val = urlPath(this.router.url);
        this.urlPath.next(val);
      });

    this.router.events.pipe(takeUntil(this.subscription$)).subscribe((nav) => {
        if (nav instanceof NavigationEnd) {
          this.url = nav.url;
          const value = explodeUrl(nav.url);
          this.explodeLink.next(value);
          const val = urlPath(nav.url);
          this.urlPath.next(val);
        }

      });
  }


  checkNotification(): void {

    if (this.url.indexOf('chat') > 0) {
      return;
    }
    try {
      this.pvChannel = this.pusher.pipe(takeUntil(this.subscription$)).subscribe('pv-channel');
      this.pvChannel.bind('my-event', () => {
        const notify: INotification = {
          type: NotificationType.newChat,
          counter: 1,
          message: ' you got message  private chats',
          date: new Date('Y-m-d H:i:s')

        };
        this.newNotification.next(notify);
      });

      this.roomChannel = this.pusher.pipe(takeUntil(this.subscription$)).subscribe('room-channel');
      this.roomChannel.bind('my-event', () => {
        const notify: INotification = {
          type: NotificationType.newChatRoom,
          counter: 1,
          message: ' you got message  chatRoom',
          date: new Date('Y-m-d H:i:s')
        };
        this.newNotification.next(notify);
      });
    } catch (e) {

    }


  }

  getNewNotification(): Observable<INotification> {
    return this.newNotification.asObservable().pipe(filter(result => !!result));
  }

  getExplodeLink(): Observable<string[]> {
    return this.explodeLink.asObservable().pipe(filter(result => !!result));
  }

  getUrlPath(): Observable<string> {
    return this.urlPath.asObservable().pipe(filter(result => !!result));
  }

  setLanguage(language: string): void {
    this.language.next(language);
  }

  getLanguage(): Observable<string> {
    return this.language.asObservable().pipe(filter(result => !!result));
  }
  unsubscribe(): void {
    this.subscription$.next(null);
    this.subscription$.complete();
  }
}
