import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css'],
  inputs: ['title']
})
export class TitleComponent implements AfterViewInit {

  constructor() {}

  ngAfterViewInit() { }

  @Input() title: string;
}
