import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
})
export class GroupDetailsComponent implements OnInit {
  constructor() {}

  @Input() userId = '';
  @Input() chatId = '';
  @Input() group: any = {};

  editName = false;

  ngOnInit(): void {}
}
