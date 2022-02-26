import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let token = localStorage.getItem('token');
    let id = localStorage.getItem('id');
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      if (tokenDecode.id === id && !this._tokenExpired(tokenDecode.exp)) {
        return true;
      }
    }
    this.router.navigate(['/home']);

    return false;
  }

  private _tokenExpired(exp: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= exp;
  }
}
