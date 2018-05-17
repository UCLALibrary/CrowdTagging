import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css'],
  inputs: ['title']
})
export class TitleComponent implements AfterViewInit {

  constructor() {}

  ngAfterViewInit() {
    this.showTipsOnQuestionHover();
  }

  /* Hide and Show tip when user hovers over a question mark */
  showTipsOnQuestionHover() {
    let questionIcons = document.querySelectorAll('.glyphicon-question-sign');

    Array.from(questionIcons).forEach(item => {
      ['mouseover', 'mouseout'].forEach(event => {
        item.addEventListener(event, function(item){
          item.srcElement.previousElementSibling.classList.toggle('hidden');
        });
      });
    });
  }

  @Input() title: string;
}
