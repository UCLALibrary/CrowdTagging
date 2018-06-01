import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Book, Author, Publisher, Title, Page, Genre, Romanization } from '../book';
import 'rxjs/add/operator/take';
import * as panzoom from './panzoom/dist/panzoom.js';
import { User } from '../providers/user';
import { AfService } from '../providers/af.service';

@Component({
  encapsulation: ViewEncapsulation.None, /* External CSS will not be applied without this */
  selector: 'app-transcribe',
  templateUrl: './transcribe.component.html',
  styleUrls: ['./transcribe.component.css']
})
export class TranscribeComponent implements OnInit, AfterViewInit {
  user: User;

  /* Book object */
  book: Observable<Book>;
  bookDoc: AngularFirestoreDocument<Book>;

  /* Author */
  authorsCollection: AngularFirestoreCollection<Author>;
  authors: Observable<Author[]>

  /* Publisher */
  publishers: Observable<Publisher[]>

  /* Title */
  titlesCollection: AngularFirestoreCollection<Title>;
  titles: Observable<Title[]>

  /* Page */
  pagesCollection: AngularFirestoreCollection<Page>;
  pages: Observable<Page[]>

  /* Genre */
  genresCollection: AngularFirestoreCollection<Genre>;
  genres: Observable<Genre[]>

  /* Romanizations */
  romansCollection: AngularFirestoreCollection<Title>;
  romans: Observable<Romanization[]>

  selectedTitle: string;
  newTitle: string;

  selectedAuthor: string;
  newAuthor: string;

  selectedRoman: string;
  newRoman: string;

  selectedPages: string;
  newPages: string;

  selectedGenre: string;
  newGenre: string;

  NA_STRING = 'NA';

  getOrderedBooks() {
    return this.afs.collection(`books`, ref => ref.orderBy('submissions')).valueChanges();
  }

  getUserBooks() {
    return this.afs.collection(`progress/${this.user.uid}/books`).valueChanges();
  }

  getBookId() {
    return new Promise(resolve => {
      this.getOrderedBooks().subscribe(orderedBooks => {
        console.log(orderedBooks);
        this.getUserBooks().subscribe(userBooks =>{
            console.log(userBooks);
            var i = 0;
            var book: any = orderedBooks[i];
            while (userBooks.includes(book.image_key)){
              i++;
            }
            resolve(book.image_key);
            // breaks if user has done all the books
        });
      });
    });
  }

  constructor(private afs: AngularFirestore, public AfService: AfService) {
    this.getBookId().then(bookid => {
      console.log(bookid);
      this.bookDoc = this.afs.doc<Book>('books/' + bookid);

      this.authorsCollection = this.bookDoc.collection<Author>('authors');
      this.authors = this.authorsCollection.valueChanges();

      this.titlesCollection = this.bookDoc.collection<Title>('titles');
      this.titles = this.titlesCollection.valueChanges();

      this.publishers = this.bookDoc.collection<Publisher>('publishers').valueChanges();

      this.pagesCollection = this.bookDoc.collection<Page>('pages')
      this.pages = this.pagesCollection.valueChanges();

      this.genresCollection = this.bookDoc.collection<Genre>('genres')
      this.genres = this.genresCollection.valueChanges();

      this.romansCollection = this.bookDoc.collection<Romanization>('romanization');
      this.romans = this.romansCollection.valueChanges();
    });
  }
  

  isAdmin() {
      return this.user.roles.admin;
  }

  isUser() {
      return this.user.roles.user;
  }

  // maybe we could change database to have several docs instead of fields,
  // so that we can delete them without having to monitor null states?
  delete(collection, id, field?){
    // need to also remove from progress?
    // or do we want users to have record of their exact transcriptions?

    var col = this.bookDoc.collection(collection).doc(id);

    if(field){ // tells us that document has other values we might care about
        return col.ref.get().then(doc => {
            const data = doc.data();
            data[field] = null;

            // if any field still has a value, maintain entry
            // otherwise get rid of entire doc (entire doc basically null)
            for (let key in data)
                if(data[key]){
                    col.set(data, {merge: true});
                    return;
                }
        });
    }

    this.bookDoc.collection(collection).doc(id).delete();
  }

  set(collection, id, field, value){
    // need to also set in progress?
    // or do we want users to have record of their exact transcriptions?

    var col = this.bookDoc.collection(collection).doc(id);

    col.ref.get().then(doc => {
        const data = doc.data();
        data[field] = value;

        col.set(data, {merge: true});
    });
}

  ngOnInit() {
    this.AfService.user$.subscribe(user => this.user = user);
  }

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
            var data = Array.from(this.parentElement.parentElement.parentElement.querySelectorAll('.data'));

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

        pan.resetTransform();
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

    var degree = 0;

    /* Handle lower-bound of gallery */
    prevArrow.addEventListener("click", function(){
        if(index > 1)
            index--;

        degree = 0;
        renderImage();
    });

    /* Handle upper-bound of gallery */
    nextArrow.addEventListener("click", function(){
        if(index < currSetLength)
            index++;

        degree = 0;
        renderImage();
    });

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
    submitBtn.addEventListener("click", () => {
        imageSetIndex++;
        index = 1;
        this.updateDatabaseForTranscription();
        renderImage();
    })

    /* Allow for zoom/pan functionality on gallery */
    var pan = panzoom(galleryImg, {
        maxZoom: 4,
        minZoom: 0.5
    });

    renderImage();
  }

  onSelectionChange(beingChanged: string, newVal: string) {
    switch (beingChanged) {
      case 'title':
        this.selectedTitle = newVal;
        break;
      case 'author':
        this.selectedAuthor = newVal;
        break;
      case 'roman':
        this.selectedRoman = newVal;
        break;
      case 'pages':
        this.selectedPages = newVal;
        break;
      case 'genre':
        this.selectedGenre = newVal;
        break;
    }
  }

  onAddOption(beingChanged: string, event: {useNewOption: boolean, newOption: string}) {
    switch (beingChanged) {
      case 'title':
        // If user doesn't check the box next to his new option, we will not use it.
        this.selectedTitle = event.useNewOption? this.NA_STRING : this.selectedTitle;
        this.newTitle = event.newOption;
        break;
      case 'author':
        this.selectedAuthor = event.useNewOption? this.NA_STRING : this.selectedAuthor;
        this.newAuthor = event.newOption;
        break;
      case 'roman':
        this.selectedRoman = event.useNewOption? this.NA_STRING : this.selectedRoman;
        this.newRoman = event.newOption;
        break;
      case 'pages':
        this.selectedPages = event.useNewOption? this.NA_STRING : this.selectedPages;
        this.newPages = event.newOption;
        break;
      case 'genre':
        this.selectedGenre = event.useNewOption? this.NA_STRING : this.selectedGenre;
        this.newGenre = event.newOption;
        break;
    }
  }

  updateDatabaseForTranscription() {

    // https://stackoverflow.com/questions/46654670/angularfire2-firestore-take1-on-doc-valuechanges

    /* Update title votes */
    if (this.selectedTitle === this.NA_STRING) {
      const newData: Title = {id: this.afs.createId(), name: this.newTitle, votes: 1};
      this.titlesCollection.doc<Title>(newData.id).set(newData);
    } else {
      const selectedTitle = this.titlesCollection.doc<Title>(this.selectedTitle);
      selectedTitle.valueChanges().take(1).subscribe(val => {
        val.votes = val.votes + 1;
        selectedTitle.update(val);
      });
    }

    /* Update romanisation votes */
    if (this.selectedRoman === this.NA_STRING) {
      const newData: Romanization = {id: this.afs.createId(), name: this.newRoman, votes: 1};
      this.romansCollection.doc<Romanization>(newData.id).set(newData);
    } else {
      const selectedRoman = this.romansCollection.doc<Romanization>(this.selectedRoman);
      selectedRoman.valueChanges().take(1).subscribe(val => {
        val.votes = val.votes + 1;
        selectedRoman.update(val);
      });
    }

    /* Update pages votes */
    if (this.selectedPages === this.NA_STRING) {
      const newData: Page = {id: this.afs.createId(), number: this.newPages, votes: 1};
      this.pagesCollection.doc<Page>(newData.id).set(newData);
    } else {
      const selectedPages = this.pagesCollection.doc<Page>(this.selectedPages);
      selectedPages.valueChanges().take(1).subscribe(val => {
        val.votes = val.votes + 1;
        selectedPages.update(val);
      });
    }

    /* Update genres votes */
    if (this.selectedGenre === this.NA_STRING) {
      const newData: Genre = {id: this.afs.createId(), name: this.newGenre, votes: 1};
      this.genresCollection.doc<Genre>(newData.id).set(newData);
    } else {
      const selectedGenre = this.genresCollection.doc<Genre>(this.selectedGenre);
      selectedGenre.valueChanges().take(1).subscribe(val => {
        val.votes = val.votes + 1;
        selectedGenre.update(val);
      });
    }
  }

}
