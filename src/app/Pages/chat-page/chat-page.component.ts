import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/Services/chat.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
})
export class ChatPageComponent implements OnInit {
  chats: any[] = [];

  constructor(private chatService: ChatService) {}

  selectedChat = '';
  ngOnInit(): void {
    this.chatService.selectedChatSubject.subscribe((chatId: string) => {
      this.selectedChat = chatId;
    });
  }
}
