import {RoleType} from "../enums/role.enum";

export class GlobalConstants {
  public static links: {
    newsCategory: string, newsSubCategory: string,
    newsMedia: string, newsComment: string, viewMedia: string,
    chatPrivate: string, chatRoom: string, requestCategory: string,
    fastFoodCategory: string,  fastFoodMedia: string,
    hotelCategory: string, hotelMedia:string
  } = {
    newsComment: '/admin/news-comment/list',
    newsMedia: '/admin/news-media/list',
    newsCategory: '/admin/news-category/list',
    newsSubCategory: '/admin/news-sub-category/list',
    viewMedia: '/admin/view-media/list',
    chatPrivate: '/admin/chat/private',
    chatRoom: '/admin/chat/room',
    requestCategory: '/admin/request-category/list',
    fastFoodCategory: '/admin/food-category/list',
    fastFoodMedia: '/admin/food-comment/list',
    hotelCategory: '/admin/hotel-category/list',
    hotelMedia: '/admin/hotel-comment/list',

  };

  public static limitUserMenu: {
    [key: string]: string[]
  } = {
    account: ['user','graph','user', 'permission','permissionUser','permissionGroup'],
    dashboard: ['overView','graph'],

  };

}
