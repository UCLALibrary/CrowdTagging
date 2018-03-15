import { Component, AfterViewInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import * as panzoom from './panzoom/dist/panzoom.js';

@Component({
  encapsulation: ViewEncapsulation.None, /* External CSS will not be applied without this */
  selector: 'app-transcribe',
  templateUrl: './transcribe.component.html',
  styleUrls: ['./transcribe.component.css']
})
export class TranscribeComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {

    /* Select reusable HTML elements */
    var triangles    = Array.from(document.querySelectorAll('.triangle')),
        imgContainer = document.getElementById("viewContainer"),
        galleryImg   = document.getElementById("galleryImage"),
        prevArrow    = imgContainer.querySelector("#prev") as any,
        nextArrow    = imgContainer.querySelector("#next") as any,
        rotContainer = document.querySelector("#rotateContainer") as any,
        rotateLeft   = imgContainer.querySelector("#rotateLeft") as any,
        rotateRight  = imgContainer.querySelector("#rotateRight") as any,
        statusBar    = imgContainer.querySelector("#progress") as any,
        submitBtn    = document.getElementById("submit");

    /* Collapse on click for each data set */
    triangles.forEach(function(item){ 
        item.addEventListener('click', function() { 
            var data = Array.from(this.parentElement.parentElement.parentElement.querySelectorAll('app-data'));

            data.forEach(function(item){
                (item as any).classList.toggle("hidden"); 
            });

            this.classList.toggle('rot'); 
        });
    });

    var index = 1, 
        imageSetIndex = 1, // Depends on session value, so they can come back to same book, if they leave
        currSetLength = 10; // Depends on length of data structure in database

    /* Update gallery */
    function renderImage(){
        var currImagePath = determineImageName();

        rotContainer.removeAttribute("style");
        galleryImg.removeAttribute("style");
        galleryImg.style.backgroundImage = "url('" + currImagePath + "')";
        statusBar.innerHTML = index + "/" + currSetLength;
    }

    /* Produce name of the image within all50 directory */
    function determineImageName(){
        var directory = "../../assets/all50/";
        var imageSet = "EALJ00" + ((imageSetIndex < 10) ? (0 + "" + imageSetIndex) : imageSetIndex);
        var imageInSet = "_0" + ((index < 10) ? (0 + "" + index) : index);
        
        return (directory + imageSet + imageInSet + ".jpg");
    }

    /* Reset translate transforms on buttons inside gallery */
    function showThese(arr){
        arr.forEach(function(item){
            item.style.transform = "translate(0)";
        });
    }

    /* Display arrow and rotation buttons on hover */
    imgContainer.addEventListener("mouseover", function(){
        showThese([prevArrow, nextArrow, rotateLeft, rotateRight, statusBar]);
    });

    /* Hide previous/next arrows on hover */
    imgContainer.addEventListener("mouseout", function(){
        prevArrow.style.transform = "translate(-160%)";
        nextArrow.style.transform = "translate(160%)";
        rotateLeft.style.transform = "translate(-160%)";
        rotateRight.style.transform = "translate(160%)";
        statusBar.style.transform = "translateY(100%)";
    });

    /* Handle lower-bound of gallery */
    prevArrow.addEventListener("click", function(){
        if(index > 1)
            index--;

        pan.resetTransform();
        renderImage();
    });

    /* Handle upper-bound of gallery */
    nextArrow.addEventListener("click", function(){
        if(index < currSetLength)
            index++;

        pan.resetTransform();
        renderImage();
    });

    var degree = 0;

    /* Allow for left rotation */
    rotateLeft.addEventListener("click", function(){
        degree -= 90;
        if(degree === -90) degree = 270;
        rotContainer.style.transform = "rotate(" + degree + "deg)";
    });

    /* Allow for right rotation */
    rotateRight.addEventListener("click", function(){
        degree += 90;
        if(degree === 360) degree = 0;
        rotContainer.style.transform = "rotate(" + degree + "deg)";
    });

    /* Update current image and image set positions */
    submitBtn.addEventListener("click", function(){
        imageSetIndex++;
        index = 1;
        renderImage();
    })

    /* Allow for zoom/pan functionality on gallery */
    var pan = panzoom(galleryImg, {
        maxZoom: 4,
        minZoom: 0.5
    });

    renderImage();
  }
}
