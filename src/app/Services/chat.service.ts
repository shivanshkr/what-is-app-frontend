import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Chat } from '../Models/Model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  selectedChatSubject = new Subject<string>();
  selectedChat = '';

  selectedFullChatSubject = new Subject<Chat | null>();
  selectedFullChat: Chat | null = null;

  baseUrl = environment.baseUrl + '/api/chat';

  constructor(private http: HttpClient) {}

  changeSelectedChat(id: string, chat: Chat | null) {
    this.selectedChat = id;
    this.selectedChatSubject.next(id);
    this.selectedFullChat = chat;
    this.selectedFullChatSubject.next(chat);
  }

  getChat(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.baseUrl}`);
  }

  createGroupChat(data: any) {
    return this.http.post(`${this.baseUrl}/group`, data);
  }

  accessChat(data: any) {
    return this.http.post(`${this.baseUrl}`, data);
  }

  addToChat(data: any) {
    return this.http.put(`${this.baseUrl}/group/add`, data);
  }
  removeToChat(data: any) {
    return this.http.put(`${this.baseUrl}/group/remove`, data);
  }
  renameChat(data: any) {
    return this.http.put(`${this.baseUrl}/group/rename`, data);
  }
  deleteChat(data: any) {
    return this.http.delete(`${this.baseUrl}/group`, data);
  }
}
