import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { User } from '../Models/Model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  apiUrl = environment.baseUrl + '/api/user';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http
      .post(`${this.apiUrl}/login`, data)
      .pipe(tap((res) => (this.user = res)));
  }
  signup(data: any) {
    return this.http
      .post(`${this.apiUrl}/register`, data)
      .pipe(tap((res) => (this.user = res)));
  }
  getMyProfile() {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  getSearchUser(searchTerm: string = '') {
    return this.http.get<User[]>(`${this.apiUrl}/?search=${searchTerm}`);
  }
}
