import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  inputs: ['title', 'labeledAs', 'highestVoted']
})
export class DataComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  @Input() title: string;
  @Input() labeledAs: string;
  @Input() highestVoted: string;
}
