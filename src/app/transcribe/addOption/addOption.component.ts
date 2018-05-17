import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-addOption',
  templateUrl: './addOption.component.html',
  styleUrls: ['../transcribe.component.css', './addOption.component.css'],
  inputs: ['title']
})
export class AddOptionComponent implements OnInit {

  @Input() title: string;
  @Output() onAddOptionInteraction = new EventEmitter<{useNewOption: boolean, newOption: string}>();


  useNewOption = false;
  newOption = '';

  constructor() {}

  ngOnInit() {}

  onSelectionChange(useNewOption: boolean) {
    this.useNewOption = useNewOption;
    this.onAddOptionInteraction.emit({useNewOption: this.useNewOption, newOption: this.newOption});
    //console.log(useNewOption);
  }

  onInputChange(event: Event) {
    this.newOption = (<HTMLInputElement>event.target).value;
    this.onAddOptionInteraction.emit({useNewOption: this.useNewOption, newOption: this.newOption});
    //console.log(this.newOption);
  }
}
