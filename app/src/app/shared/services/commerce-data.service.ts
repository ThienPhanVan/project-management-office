import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class CommerceDataService {
  private productDetailBus$ = new BehaviorSubject<any>({} as any);
  productDetail$ = this.productDetailBus$.asObservable();

  private productsBus$ = new BehaviorSubject<any[]>([{} as any]);
  products$ = this.productsBus$.asObservable();

  private filterBus$ = new BehaviorSubject<any>({});
  filter$ = this.filterBus$.asObservable();

  private myNewsCommentsBus$ = new BehaviorSubject<any>([]);
  myNewsComments$ = this.myNewsCommentsBus$.asObservable();

  private myOrdersBus$ = new BehaviorSubject<any>([]);
  myOrders$ = this.myOrdersBus$.asObservable();

  private myOrderDetailBus$ = new BehaviorSubject<any>({} as any);
  myOrderDetail$ = this.myOrderDetailBus$.asObservable();

  private myOrdersPreviewsBus$ = new BehaviorSubject<any>([]);
  myOrdersPreviews$ = this.myOrdersPreviewsBus$.asObservable();

  private cartItemsBus$ = new BehaviorSubject<any>([]);
  cartItems$ = this.cartItemsBus$.asObservable();

  private categoriesBus$ = new BehaviorSubject<any>([]);
  categories$ = this.categoriesBus$.asObservable();

  private addressShippingBus$ = new BehaviorSubject<any>([]);
  addressShipping$ = this.addressShippingBus$.asObservable();

  constructor() {}

  setProductDetail(newDetail: any) {
    this.productDetailBus$.next(newDetail);
  }

  setProducts(news: any[]) {
    this.productsBus$.next(news);
  }

  setFilter(options: any) {
    this.filterBus$.next(options);
  }

  setMyNewsComments(data: any) {
    this.myNewsCommentsBus$.next(data);
  }

  setMyOrders(data: any) {
    this.myOrdersBus$.next(data);
  }

  setMyOrderDetail(data: any) {
    this.myOrderDetailBus$.next(data);
  }

  setMyOrdersPreviews(data: any) {
    this.myOrdersPreviewsBus$.next(data);
  }

  setCartItems(data: any) {
    this.cartItemsBus$.next(data);
  }
  setCategories(data: any) {
    this.categoriesBus$.next(data);
  }
  setAddressShipping(data: any) {
    this.addressShippingBus$.next(data);
  }
}
