import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {Book, Author, Publisher, Title, Page, Genre} from '../book'
import * as panzoom from '../../../node_modules/panzoom/dist/panzoom.js';

@Component({
  encapsulation: ViewEncapsulation.None, /* External CSS will not be applied without this */
  selector: 'app-transcribe',
  templateUrl: './transcribe.component.html',
  styleUrls: ['./transcribe.component.css']
})
export class TranscribeComponent implements OnInit {
  
  /* Book object */
  book: Observable<Book>;
  bookDoc: AngularFirestoreDocument<Book>;
  
  /* Author */
  authors: Observable<Author[]>

  /* Publisher */
  publishers: Observable<Publisher[]>

  /* Title */
  titles: Observable<Title[]>

  /* Page */
  pages: Observable<Page[]>
  
  /* Genre */
  genres: Observable<Genre[]>

  constructor(private afs: AngularFirestore) {
    this.bookDoc = this.afs.doc<Book>('books/1');
    this.authors = this.bookDoc.collection<Author>('authors').valueChanges();
    this.titles = this.bookDoc.collection<Title>('titles').valueChanges();
    this.publishers = this.bookDoc.collection<Publisher>('publishers').valueChanges();
    this.pages = this.bookDoc.collection<Page>('pages').valueChanges();
    this.genres = this.bookDoc.collection<Genre>('genres').valueChanges();
  }

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
