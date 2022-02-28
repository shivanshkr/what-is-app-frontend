import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';
import { Chat, defaultUser, User } from 'src/app/Models/Model';
import { AuthService } from 'src/app/Services/auth.service';
import { ChatService } from 'src/app/Services/chat.service';

@Component({
  selector: 'app-my-chat',
  templateUrl: './my-chat.component.html',
  styleUrls: ['./my-chat.component.scss'],
})
export class MyChatComponent implements OnInit {
  constructor(
    private AS: AuthService,
    private chatService: ChatService,
    private datePipe: DatePipe,
    private router: Router,
    private messageService: MessageService
  ) {}
  searchText: string | null = null;
  searchResults: User[] = [];
  allUsers: User[] = [];
  items: MenuItem[] = [];
  user: User = defaultUser;
  chats: Chat[] = [];
  defaultImage =
    'https://res.cloudinary.com/what-is-app/image/upload/v1646062233/profilePic_uigcf8.png';
  isProfileLoading = false;
  ngOnInit(): void {
    this.isProfileLoading = true;

    this.AS.getMyProfile().subscribe((res: User) => {
      console.log(res);
      this.user = res;
      this.isProfileLoading = false;
    });
    this.chatService.getChat().subscribe((res: Chat[]) => {
      console.log(res);
      this.chats = res;
    });
    this.items = [
      {
        label: 'LogOut',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
          this.logout();
        },
      },
    ];
    this.AS.getSearchUser()
      .pipe(take(1))
      .subscribe((res: User[]) => {
        this.searchResults = res;
        this.allUsers = res;
      });
    this.initGroupForm();
  }
  getChatImage(chat: Chat, option: boolean = true) {
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

  getChatName(chat: Chat) {
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    let user = chat.users.filter((user: User) => user._id !== this.user._id);
    return user[0].name;
  }

  getChatTime(chat: Chat) {
    let chatDate = new Date(chat.updatedAt);
    let today = new Date();
    if (
      chatDate.getMonth() == today.getMonth() &&
      chatDate.getFullYear() == today.getFullYear()
    ) {
      if (chatDate.getDate() == today.getDate()) {
        return this.datePipe.transform(chatDate, 'hh:mm aa');
      } else if (chatDate.getDate() + 1 == today.getDate()) {
        return 'Yesterday';
      }
    }
    return this.datePipe.transform(chatDate, 'dd/MM/YY');
  }

  //Search user
  timeOut: any;
  isSearchLoading = false;
  searchUsers(searchTerm: string = '') {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    this.timeOut = setTimeout(() => {
      this.isSearchLoading = true;
      if (this.searchText) {
        this.AS.getSearchUser(this.searchText)
          .pipe(take(1))
          .subscribe((res: User[]) => {
            console.log(res);
            this.searchResults = res;
            this.isSearchLoading = false;
          });
      } else {
        this.AS.getSearchUser(searchTerm)
          .pipe(take(1))
          .subscribe((res: User[]) => {
            console.log(res);
            this.searchResults = res;
            this.isSearchLoading = false;
          });
      }
    }, 300);
  }

  display: boolean = false;

  displayNew = false;
  selectedImg = '';
  selectedName = '';

  showDialog(chat: Chat) {
    this.display = true;
    this.selectedImg = this.getChatImage(chat, false);
    this.selectedName = this.getChatName(chat);
  }

  logout() {
    localStorage.removeItem('whatIsAppToken');
    localStorage.removeItem('id');
    this.router.navigate(['/home']);
  }

  groupChatForm = new FormGroup({});
  initGroupForm() {
    this.groupChatForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      users: new FormControl([], [this.customLengthValidator()]),
      // groupPic: new FormControl(
      //   'https://res.cloudinary.com/what-is-app/image/upload/v1645968551/group_nfacyi.jpg'
      // ),
    });
  }

  customLengthValidator(): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
      let value = control.value;
      if (value.length > 1) {
        return null;
      } else {
        return { required: true };
      }
    };
  }
  isUploading = false;
  onImageUpload(event: any) {
    console.log('in function');
    this.isUploading = true;
    console.log(event);

    const file = event.files[0];
    console.log(file);
    if (file) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'what-is-app');
      data.append('cloud_name', 'what-is-app');
      fetch('https://api.cloudinary.com/v1_1/what-is-app/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.secure_url);
          this.groupChatForm.addControl('groupPic', new FormControl(''));
          this.groupChatForm.controls.groupPic.setValue(data.secure_url);
          this.messageService.add({
            severity: 'success',
            summary: 'File uploaded successfully',
          });
          this.isUploading = false;
        })
        .catch((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'File not uploaded',
          });
        });
    } else this.isUploading = false;
  }

  createGroup() {
    this.chatService
      .createGroupChat({
        ...this.groupChatForm.value,
        users: JSON.stringify(this.groupChatForm.value.users),
      })
      .subscribe(
        (res: any) => {
          this.showChat(res._id, res);
          this.displayNew = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Group created successfully',
          });

          this.chatService.getChat().subscribe((res: Chat[]) => {
            this.chats = res;
          });
        },
        (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Group not created',
          });
        }
      );
  }

  showChat(id: string, chat: any) {
    console.log('id is : ', id);
    this.chatService.changeSelectedChat(id, chat);
  }

  accessChat(id: string) {
    this.chatService.accessChat({ userId: id }).subscribe(
      (res: any) => {
        if (res?._id) {
          this.showChat(res._id, res);
          this.displayNew = false;
          this.chatService.getChat().subscribe((res: Chat[]) => {
            this.chats = res;
          });
        }
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Chat can not be loaded ',
        });
      }
    );
  }
}
