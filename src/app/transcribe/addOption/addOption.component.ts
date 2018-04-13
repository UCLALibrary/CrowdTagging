import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-addOption',
  templateUrl: './addOption.component.html',
  styleUrls: ['../transcribe.component.css'],
  inputs: ['title']
})
export class AddOptionComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  @Input() title: string;
}
