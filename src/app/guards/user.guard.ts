import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AfService } from '../providers/af.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private af: AfService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.af.user$.pipe(
        take(1),
        map(user => user && user.roles.user ? true : false),
        tap(isUser => {
          if(!isUser) {
            console.error("Access Denied");
            this.router.navigate(['/']);
          }
        })
      );
  }
}
