import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {Book} from '../book'
import * as panzoom from '../../../node_modules/panzoom/dist/panzoom.js';

@Component({
  encapsulation: ViewEncapsulation.None, /* External CSS will not be applied without this */
  selector: 'app-transcribe',
  templateUrl: './transcribe.component.html',
  styleUrls: ['./transcribe.component.css']
})
export class TranscribeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
 
    /* Select reusable HTML elements */
    var triangles    = Array.from(document.querySelectorAll('.triangle')),
        imgContainer = document.getElementById("viewContainer"),
        imgConParent = imgContainer.parentElement,
        galleryImg   = document.getElementById("galleryImage"),
        prevArrow    = imgConParent.querySelector("#prev") as any,
        nextArrow    = imgConParent.querySelector("#next") as any;

    /* Collapse on click for each data set */
    triangles.forEach(function(item){ 
        item.addEventListener('click', function() { 
            var data = Array.from(this.parentElement.parentElement.getElementsByClassName('data'));

            data.forEach(function(item){
                (item as any).classList.toggle("hidden"); 
            });

            this.classList.toggle('rot'); 
        });
    });

    var images = [
                    "../../assets/pup1.jpg", 
                    "../../assets/pup2.jpg", 
                    "../../assets/pup3.jpg", 
                    "../../assets/pup4.jpg"
                 ]

    var index = 0;

    /* Update current image in gallery */
    function renderImage(){
        galleryImg.setAttribute("src", images[index]);
        galleryImg.removeAttribute("style");
    }

    /* Display previous/next arrows on hover */
    imgContainer.addEventListener("mouseover", function(){
        prevArrow.style.transform = "translate(0)";
        nextArrow.style.transform = "translate(0)";
    });

    /* Hide previous/next arrows on hover */
    imgContainer.addEventListener("mouseout", function(){
        prevArrow.style.transform = "translate(-160%)";
        nextArrow.style.transform = "translate(160%)";
    });

    /* Handle lower-bound of gallery */
    prevArrow.addEventListener("click", function(){
        if(index > 0)
            index -= 1;

        renderImage();
    });

    /* Handle upper-bound of gallery */
    nextArrow.addEventListener("click", function(){
        if(index < images.length - 1)
            index += 1;

        renderImage();
    });

    /* Allow for zoom/pan functionality on gallery */
    panzoom(galleryImg, {
        maxZoom: 1.5,
        minZoom: 0.5
    });
  }
}
