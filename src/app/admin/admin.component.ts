import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let selectAllBtn = document.querySelector("#selectAll");
    let checkboxes = Array.from(document.querySelectorAll('.chkbox-input:not(#selectAll)'));

    selectAllBtn.addEventListener("click", function(){
      checkboxes.forEach(function(item){
        (item.attributes[1].ownerElement as HTMLInputElement).checked = (selectAllBtn.attributes[1].ownerElement as HTMLInputElement).checked;
      });
    });

  }

}
