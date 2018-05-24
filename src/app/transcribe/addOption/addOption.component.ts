import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-addOption',
  templateUrl: './addOption.component.html',
  styleUrls: ['../transcribe.component.css', './addOption.component.css'],
  inputs: ['title']
})
export class AddOptionComponent implements OnInit {
  
  @Input() title: string;

  constructor() {}

  ngOnInit() {}
}
