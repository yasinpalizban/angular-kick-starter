import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';


import {ActivatedRoute, Params, Router} from '@angular/router';
import {IQuery} from '../../../interfaces/query.interface';

import {LocationChangeListener} from "@angular/common";

import {IPermissionUser} from "../../../interfaces/permission.user.interface";
import {PermissionUserService} from "../../../services/permission.user.service";

@Component({
  selector: 'app-permission-group-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  id: number;
  subscription$: Subscription[];
  permissionGroupDetail!: IPermissionUser;

  @HostListener('window:popstate', ['$event'])
  onPopState(event: LocationChangeListener): void {

    let params: IQuery = {};


    this.subscription$.push(this.userPermissionService.getQueryArgumentObservable().subscribe((qParams: IQuery) => {

      params = qParams;


    }));

    this.userPermissionService.setQueryArgument(params);
    this.router.navigate(['./admin/user-permission/list'], {
      queryParams: params,

    });
  }

  constructor(
    private userPermissionService: PermissionUserService,
    private aRoute: ActivatedRoute, private router: Router) {
    this.id = 0;
    this.subscription$ = [];

  }

  ngOnInit(): void {

    this.subscription$.push(
      this.aRoute.params.pipe().subscribe((params: Params) => {

        this.id = +params['id'];

      }));
    this.userPermissionService.query(this.id);
    this.subscription$.push(
      this.userPermissionService.getDataObservable().subscribe((permission: IPermissionUser ) => {
        this.permissionGroupDetail = permission;
      }));
  }

  ngOnDestroy(): void {

    this.subscription$.forEach(sub => sub.unsubscribe());

  }
}
