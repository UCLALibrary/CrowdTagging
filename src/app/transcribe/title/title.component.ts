import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css'],
  inputs: ['title']
})
export class TitleComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  @Input() title: string;
}
