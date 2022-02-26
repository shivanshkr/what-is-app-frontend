import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-my-chat',
  templateUrl: './my-chat.component.html',
  styleUrls: ['./my-chat.component.scss'],
})
export class MyChatComponent implements OnInit {
  constructor(private AS: AuthService) {}
  user: any;

  ngOnInit(): void {
    this.user = this.AS.getMyProfile().subscribe((res) => (this.user = res));
  }
}
