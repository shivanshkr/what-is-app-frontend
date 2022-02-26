import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getChat() {
    return this.http.get(`${this.baseUrl}/all`);
  }
}
