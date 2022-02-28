import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Chat, defaultUser, User } from 'src/app/Models/Model';
import { AuthService } from 'src/app/Services/auth.service';
import { ChatService } from 'src/app/Services/chat.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
  constructor(private chatService: ChatService, private AS: AuthService) {}
  items: MenuItem[] = [];
  defaultImage =
    'https://res.cloudinary.com/what-is-app/image/upload/v1646062233/profilePic_uigcf8.png';

  selectedImg = '';
  display = false;
  selectedChat = '';
  selectFullChat: any = {};
  user: User = defaultUser;

  ngOnInit(): void {
    this.chatService.selectedChatSubject.subscribe((chatId: string) => {
      this.selectedChat = chatId;
    });
    this.chatService.selectedFullChatSubject.subscribe((chat: any) => {
      this.selectFullChat = chat;
      if (this.selectFullChat?.isGroupChat) {
        this.items = [
          {
            label: 'Group Info',
            icon: 'pi pi-fw pi-info-circle',
            command: () => {
              this.showGroupInfo();
            },
          },
        ];
      } else {
        this.items = [];
      }
    });
    this.AS.getMyProfile().subscribe((res: User) => {
      console.log(res);
      this.user = res;
    });
  }

  showChatList() {
    console.log('back');
    this.chatService.changeSelectedChat('', null);
  }

  getChatImage(option: boolean = true) {
    let chat = this.selectFullChat;
    let imgUrl = '';
    if (chat.isGroupChat) {
      imgUrl = chat?.groupPic || this.defaultImage;
    } else {
      let user = chat.users.filter((user: User) => user._id !== this.user._id);
      imgUrl = user[0].pic;
    }

    let imgUrlOptimize = imgUrl;
    if (option) {
      imgUrlOptimize = this.getOptimizedImgUrl(imgUrl);
    }
    return imgUrlOptimize;
  }
  getOptimizedImgUrl(imgUrl: string): string {
    let imgUrlOptimize = imgUrl;
    if (
      imgUrl.startsWith('https://res.cloudinary.com/what-is-app/image/upload/')
    ) {
      imgUrlOptimize =
        'https://res.cloudinary.com/what-is-app/image/upload/w_100,h_100,c_thumb/' +
        imgUrl.replace(
          'https://res.cloudinary.com/what-is-app/image/upload/',
          ''
        );
    }
    return imgUrlOptimize;
  }

  getChatName() {
    let chat = this.selectFullChat;

    if (chat.isGroupChat) {
      return chat.chatName;
    }
    let user = chat.users.filter((user: User) => user._id !== this.user._id);
    return user[0].name;
  }
  displayGroupInfo = false;
  showGroupInfo() {
    this.displayGroupInfo = true;
  }
}
