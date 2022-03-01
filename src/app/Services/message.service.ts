import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.baseUrl + '/api/message';

  constructor(private http: HttpClient) {}

  sendMessage(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  getAllChatMessages(chatId: string) {
    return this.http.get(`${this.baseUrl}/${chatId}`);
  }
}
