import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AfService } from '../providers/af.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private af: AfService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.af.user$.pipe(
        take(1),
        map(user => user && user.roles.user ? true : false),
        tap(isAdmin => {
          if(!isAdmin) {
            console.error("Access Denied");
          }
        })
      );
  }
}
