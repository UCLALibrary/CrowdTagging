import { Component, OnInit, AfterViewInit, style } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Book, Author, AuthorFirstName, AuthorLastName, Publisher, PublisherCity, PublisherCompany,
  PublisherCountry, PublisherYear, Title, Page, Genre, Romanization, Language } from '../book';
import 'rxjs/add/operator/take';
import * as panzoom from './panzoom/dist/panzoom.js';
import { User } from '../providers/user';
import { AfService } from '../providers/af.service';
import { resolve } from 'url';

@Component({
  encapsulation: ViewEncapsulation.None, /* External CSS will not be applied without this */
  selector: 'app-transcribe',
  templateUrl: './transcribe.component.html',
  styleUrls: ['./transcribe.component.css']
})
export class TranscribeComponent implements OnInit, AfterViewInit {
  user: User;
  numCategories: Number;

  /* Book object */
  book: Observable<Book>;
  bookDoc: AngularFirestoreDocument<Book>;

  /* Author */
  authorsCollection: AngularFirestoreCollection<Author>;
  authors: Observable<Author[]>

  /* Language */
  languagesCollection: AngularFirestoreCollection<Language>;
  languages: Observable<Language[]>

  /* Author First Name */
  authorsFirstNamesCollection: AngularFirestoreCollection<AuthorFirstName>;
  authorsFirstNames: Observable<AuthorFirstName[]>

  /* Author Last Name */
  authorsLastNamesCollection: AngularFirestoreCollection<AuthorLastName>;
  authorsLastNames: Observable<AuthorLastName[]>

  /* Publisher */
  publishers: Observable<Publisher[]>

  /* Publisher City */
  publishersCitiesCollection: AngularFirestoreCollection<PublisherCity>;
  publishersCities: Observable<PublisherCity[]>;

  /* Publisher Company */
  publishersCompaniesCollection: AngularFirestoreCollection<PublisherCompany>;
  publishersCompanies: Observable<PublisherCompany[]>;

  /* Publisher Name */
  publisherCountriesCollection: AngularFirestoreCollection<PublisherCountry>;
  publishersCountries: Observable<PublisherCountry[]>;

  /* Publisher Year */
  publishersYearsCollection: AngularFirestoreCollection<PublisherYear>;
  publishersYears: Observable<PublisherYear[]>;

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

  imageKey: string;

  constructor(private afs: AngularFirestore, public AfService: AfService) {
    this.renderWithNewBook();
  }
  

  isAdmin() {
      return this.user.roles.admin;
  }

  isUser() {
      return this.user.roles.user;
  }

  delete(collection, id){
    this.bookDoc.collection(collection).doc(id).delete();
  }

  set(collection, id, value){
    if(value == "")
       return;

    var col = this.bookDoc.collection(collection).doc(id);

    col.ref.get().then(doc => {
        const data = doc.data();
        data.value = value;

        col.set(data, {merge: true});
    });
  }

  createEntry(event, collection) {
    let value = event.target.previousElementSibling.childNodes[2].value;

    if (value == "")
      return;

    let newData = {id: this.afs.createId(), value: null, votes: 1};
    newData.value = value;
    
    this.bookDoc.collection(collection).doc(newData.id).set(newData);

    document.querySelector("form").reset();
    event.srcElement.classList.add('hidden');
  }

  ngOnInit() {
    this.AfService.user$.subscribe(user => this.user = user);
  }

  ngAfterViewInit() {
    this.showTipsOnQuestionHover();

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
        submitBtn    = document.getElementById("submit"),
        addOptions   = Array.from(document.querySelectorAll(".option"));

    // Number of separate fields that require a selection from the user
    this.numCategories = document.querySelectorAll(".data").length;

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
    var imageKey = this.imageKey; // gives access to this.imageKey inside ngAfterViewInit

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
        var imageSet = imageKey;
        var imageInSet = "_0" + ((index < 10) ? (0 + "" + index) : index);

        return (directory + imageSet + imageInSet + ".jpg");
    }

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
      // not sure how you'll be handling image display for user
        imageSetIndex++; // Kristie, this should only happen if updateDatabase() is successful
        index = 1; // Kristie, this should only happen if updateDatabase() is successful
        this.updateDatabase( () => this.renderWithNewBook() );
    });

    /* Tick option checkbox automatically when user tries to add an option */
    addOptions.forEach(element => {
      element.addEventListener("click", function(item){
        (item.srcElement.previousElementSibling.childNodes[1] as HTMLInputElement).checked = true;
      });
    });


    /* Allow for zoom/pan functionality on gallery */
    var pan = panzoom(galleryImg, {
        maxZoom: 4,
        minZoom: 0.5
    });

    renderImage();
  }

  getOrderedBooks() {
    return this.afs.collection<Book>(`books`, ref => ref.orderBy('submissions')).valueChanges();
  }

  getUserInfo() {
    return this.afs.doc<User>(`users/${this.user.uid}`).valueChanges();
  }

  /* Gets the book id of the book with the least number of submissions that the user
    has not yet completed. */
  getBookId() {
    return new Promise(resolve => {
      this.getOrderedBooks().subscribe(orderedBooks => {
        this.getUserInfo().subscribe(userInfo =>{
            var userBooks = userInfo.booksTagged;
            var i = 0;
            // Checks if user has already done the book
            while (userBooks.includes(orderedBooks[i].image_key)){
              i++;
            }
            // Note that book id and image key are the same
            
            resolve(orderedBooks[i].image_key);
            // Breaks if user has done all the books
        });
      });
    });
  }

  /* Set the bookDoc based on a new book id. Rerender the page. */
  renderWithNewBook() {
    this.getBookId().then(bookid => {
      this.imageKey = <string>bookid;

      this.bookDoc = this.afs.doc<Book>('books/' + bookid);

      this.authorsFirstNamesCollection = this.bookDoc.collection<AuthorFirstName>('author_firstname');
      this.authorsFirstNames = this.authorsFirstNamesCollection.valueChanges();

      this.authorsLastNamesCollection = this.bookDoc.collection<AuthorLastName>('author_lastname');
      this.authorsLastNames = this.authorsLastNamesCollection.valueChanges();

      this.titlesCollection = this.bookDoc.collection<Title>('titles');
      this.titles = this.titlesCollection.valueChanges();

      this.publishersCitiesCollection = this.bookDoc.collection<PublisherCity>('publisher_city');
      this.publishersCities = this.publishersCitiesCollection.valueChanges();

      this.publishersCompaniesCollection = this.bookDoc.collection<PublisherCompany>('publisher_company');
      this.publishersCompanies = this.publishersCompaniesCollection.valueChanges();

      this.publisherCountriesCollection = this.bookDoc.collection<PublisherCountry>('publisher_country');
      this.publishersCountries = this.publisherCountriesCollection.valueChanges();

      this.publishersYearsCollection = this.bookDoc.collection<PublisherYear>('publisher_year');
      this.publishersYears = this.publishersYearsCollection.valueChanges();

      this.pagesCollection = this.bookDoc.collection<Page>('pages');
      this.pages = this.pagesCollection.valueChanges();

      this.genresCollection = this.bookDoc.collection<Genre>('genres');
      this.genres = this.genresCollection.valueChanges();

      this.romansCollection = this.bookDoc.collection<Romanization>('romanization');
      this.romans = this.romansCollection.valueChanges();

      this.languagesCollection = this.bookDoc.collection<Language>('languages');
      this.languages = this.languagesCollection.valueChanges();

      this.numCategories = 0;

      this.ngAfterViewInit();
    })
  }

  createNotificationWith(text, styleClass) {
    var div = document.createElement('div');
    div.classList.add(styleClass);
    div.innerText = text;
    document.querySelector("#viewer").appendChild(div);

    setTimeout(function(){
      document.querySelector('.' + styleClass).remove();
    }, 2000);
  }

  // TODO: also update submission field
  updateDatabase(doWhenUserIsUpdated) {
    let userSelectedInputs = Array.from(document.querySelectorAll("input:checked"));
    let userData = {};
    const len = userSelectedInputs.length;
    let year = (document.querySelector("#otherpublisher_year").parentElement.childNodes[1].parentElement.nextElementSibling as any).value;

    if(!parseInt(year) && year != ""){
      this.createNotificationWith("Year must be an integer.", "warnings");
      return;
    }

    // user had addOption selected at submission, but there was a blank entry
    for(var item of userSelectedInputs)
      if(item.id.substring(0,5) === "other")
        if((item.parentElement.nextElementSibling as HTMLInputElement).value === ""){
          this.createNotificationWith("You forgot to define the new option!", "warnings");
          return;
        }

    // user forgot to choose an option for at least one field
    if(len < this.numCategories){
      this.createNotificationWith("You left a field blank!", "warnings");
      return;
    }

    let promises = [];

    userSelectedInputs.forEach((item, index) => {
      let input = item as HTMLInputElement;

      if(input.id.substring(0,5) !== "other"){ // if preexisting option was selected, update existing entry in DB
        if(index == len - 1) { // oclc is not a voted option, so N/A option not in DB; record value and proceed
          userData[input.name] = item.nextElementSibling.textContent;
          return;
        }

        const docToUpdate = this.bookDoc.collection(`${input.name}`).doc(input.id);

        promises.push(new Promise((resolve, reject) => {
          docToUpdate.ref.get().then(val => {
            let value = val.data();
            userData[input.name] = value.value; // save user field transcription in JSON
            value.votes = value.votes + 1;
            docToUpdate.update(value);
            resolve();
          });
        }));
      } else { // if user typed in a new option, create new entry
        const newData = {id: this.afs.createId(), value: null, votes: 1};
        newData.value = (input.parentElement.nextElementSibling as HTMLInputElement).value;
        userData[input.name] = newData.value; // save user field transcription in JSON
        this.bookDoc.collection(`${input.name}`).doc(newData.id).set(newData);
      }
    }); 

    Promise.all(promises).then(() => { // once we finish creating JSON, add it to DB and clear form
      let newID = this.imageKey;//this.afs.createId();

      // Try/catch will initialize user progress doc if it doesn't exist to avoid Firebase
      // "This document does not exist, it will not appear in queries or snapshots" issue
      // Will ensure that user progress is query-able later in profile page
      // Without this, you end up creating a virtual doc

      try {
        let a = this.afs.doc(`progress/${this.user.uid}`).update(null);
      } catch{
        this.afs.doc(`progress/${this.user.uid}`).set({}, { merge: true });
      }

      this.afs.collection(`progress/${this.user.uid}/books`).doc(`${newID}`).set(userData).then(() => {
        document.querySelector("form").reset();
      });

      // increment number of submissions field on book
      this.bookDoc.ref.get().then(obj => {
        let object = obj.data();
        object.submissions += 1;
        this.bookDoc.update(object);
      })

      const userInfoDoc = this.afs.doc(`users/${this.user.uid}`);

      userInfoDoc.ref.get().then(obj => {
        let object = obj.data();
        object.booksTagged.push(newID);
        object.numTagged += 1;
        userInfoDoc.update(object).then(res => {
          document.querySelector("form").reset();
          doWhenUserIsUpdated();
        });
      });

    });
  }

  showCheck(event) {
    try { // try ensures that checkmark is shown only if they click inside the text area
      event.target.parentElement.nextElementSibling.classList.remove("hidden");
    } catch {}
  }

  /* Hide and Show tip when user hovers over a question mark */
  showTipsOnQuestionHover() {
    let questionIcons = document.querySelectorAll('.glyphicon-question-sign');

    Array.from(questionIcons).forEach(item => {
      ['mouseover', 'mouseout'].forEach(event => {
        item.addEventListener(event, function(item){
          item.srcElement.previousElementSibling.classList.toggle('hiding');
        });
      });
    });
  }
}
