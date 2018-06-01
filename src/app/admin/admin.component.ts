import { Component, OnInit } from '@angular/core';
import { User } from '../providers/user';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AfService } from '../providers/af.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  books;
  compiledBookData; // array of dictionaries to access top book data
  availableFields; // names of all collections in a book document

  constructor(private afs: AngularFirestore, public AfService: AfService) { 
    this.books = this.afs.collection('books').valueChanges();
    this.compiledBookData = [];
    this.availableFields = [
      "author_firstname",
      "author_lastname",
      "genres",
      "pages",
      "publisher_city",
      "publisher_company",
      "publisher_country",
      "publisher_year",
      "romanization",
      "titles"
    ];

    this.compileBookData();
  }

  ngOnInit() { }

  // Creates an array of objects, where each object represents the
  // top voted data for each field of a given book
  compileBookData() {
    let dict = {};
    let promises = [];

    // Go through all book docs in books collection; for each field,
    // find the top voted doc, and add that field: value pair to dictionary
    // for that specific book; once all fields for that book are set,
    // save dictionary in array for HTML to access
    this.afs.collection('books').ref.get().then(allBooks => {
      allBooks.docs.forEach(book => {
        this.availableFields.forEach(field => {
          promises.push(new Promise((resolve, reject) => {
            this.afs.collection(`books/${book.id}/${field}`).ref.orderBy("votes", "desc").limit(1).get().then(doc => {
              doc.docs[0].ref.get().then(topVoted => {
                dict[field] = topVoted.data().value;
                resolve();
              });
            });
          }));
        });
      
        // Wait for dictionary for current book to be made
        Promise.all(promises).then(() => {
          this.compiledBookData.push(dict);
          dict = {};
          promises = [];
        });
      });
    });
  }

  // should call compileBookData() at start of this function, and then on completion, trigger download
  // keep it as is for now until I rewrite function that populates data on admin page, so that it's faster
  downloadJSON() {
    var bookData = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.compiledBookData, null, "   "));
    var downloader = document.createElement('a');

    downloader.setAttribute('href', bookData);
    downloader.setAttribute('download', 'Compiled-Book-Data.json');
    downloader.click();
  }
}
