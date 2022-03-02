import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Chat, defaultUser, User } from 'src/app/Models/Model';
import { AuthService } from 'src/app/Services/auth.service';
import { ChatService } from 'src/app/Services/chat.service';
import { MessageService } from 'src/app/Services/message.service';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
const SOCKET_ENDPOINT = environment.baseUrl;

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
  constructor(
    private chatService: ChatService,
    private AS: AuthService,
    private MS: MessageService
  ) {}
  items: MenuItem[] = [];
  defaultImage =
    'https://res.cloudinary.com/what-is-app/image/upload/v1646062233/profilePic_uigcf8.png';

  selectedImg = '';
  display = false;
  selectedChat = '';
  selectFullChat: any = {};
  user: User = defaultUser;
  isChatLoading = false;
  messages: any[] = [];
  selectedChatCompare = '';
  notification: any[] = [];
  itemsNotification: MenuItem[] = [];

  ngOnInit(): void {
    console.log('ngoninit');
    this.chatService.notification.subscribe((n) => {
      this.notification = n;
      this.itemsNotification = [];
      this.notification.forEach((noti: any) => {
        this.itemsNotification.push({
          label: noti.chat.isGroupChat
            ? noti.chat.chatName.substring(0, 15) +
              ' : ' +
              noti.content.substring(0, 15)
            : noti.sender.name.substring(0, 10) +
              ' : ' +
              noti.content.substring(0, 15),
          command: () => {
            this.chatService.selectedChatSubject.next(noti.chat._id);
            this.chatService.selectedFullChatSubject.next(noti.chat);
            let newNotification = this.notification.filter(
              (n) => n.chat._id !== noti.chat._id
            );
            this.chatService.notification.next(newNotification);
          },
        });
      });
    });
    this.setupSocketConnection();
    this.chatService.selectedChatSubject.subscribe((chatId: string) => {
      this.selectedChat = chatId;
      this.selectedChatCompare = this.selectedChat;
      if (this.selectedChat) {
        this.getAllChatMessages();
        this.socket.emit('join chat', this.selectedChat);
      }
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
      this.user = res;
      this.socket.emit('setup', this.user);
    });

    this.socket.on('message received', (newMessageReceived: any) => {
      if (
        !this.selectedChat ||
        this.selectedChat !== newMessageReceived.chat._id
      ) {
        //give Notification
        if (!this.notification.includes(newMessageReceived)) {
          this.chatService.notification.next([
            newMessageReceived,
            ...this.notification,
          ]);
        }
        this.chatService.gotNewMsg.next(true);
      } else {
        this.messages = [newMessageReceived, ...this.messages];
      }
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

  getAllChatMessages() {
    this.isChatLoading = true;
    this.MS.getAllChatMessages(this.selectedChat).subscribe((res: any) => {
      this.messages = res;
      this.isChatLoading = false;
    });
  }
  message = '';
  sendMessage() {
    let data = {
      content: this.message,
      chatId: this.selectedChat,
    };
    this.message = '';
    this.socket.emit('stop typing', this.selectedChat);

    this.MS.sendMessage(data).subscribe((res) => {
      console.log(res);
      this.socket.emit('new message', res);
      this.messages = [res, ...this.messages];
    });
  }
  socket: any;
  socketConnected = false;
  setupSocketConnection() {
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('connected', () => {
      this.socketConnected = true;
      console.log('connnected');
    });
    this.socket.on('typing', () => {
      this.isTyping = true;
    });
    this.socket.on('stop typing', () => {
      this.isTyping = false;
    });
  }

  showDate(msgDate: any, previousMsgDate: any = '1-1-1800') {
    msgDate = new Date(msgDate);
    previousMsgDate = new Date(previousMsgDate);
    if (
      msgDate.getDate() === previousMsgDate.getDate() &&
      msgDate.getMonth() === previousMsgDate.getMonth() &&
      msgDate.getFullYear() === previousMsgDate.getFullYear()
    ) {
      return false;
    }
    return true;
  }

  typing = false;
  isTyping = false;

  typingHandler() {
    if (!this.socketConnected) {
      return;
    }
    if (!this.typing) {
      this.typing = true;
      this.socket.emit('typing', this.selectedChat);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && this.typing) {
        this.socket.emit('stop typing', this.selectedChat);
        this.typing = false;
      }
    }, timerLength);
  }
}
