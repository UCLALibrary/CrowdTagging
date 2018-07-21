import { Component, OnInit } from '@angular/core';
import { User } from '../providers/user';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AfService } from '../providers/af.service';
import { HttpClient } from '@angular/common/http';
import { codeLookUp } from '../../assets/LanguageCodes';

interface AWT{
  awt: string,
  week: string
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  books;
  engToCode;
  compiledBookData; // array of dictionaries to access top book data
  availableFields; // names of all collections in a book document
  awt;
  week;
  constructor(private afs: AngularFirestore, private http: HttpClient, public AfService: AfService) { 
    this.books = this.afs.collection('books').valueChanges();
    this.compiledBookData = [];
    this.availableFields = [
      "author_firstname",
      "author_firstname_rom",
      "author_lastname",
      "author_lastname_rom",
      "pages",
      "publisher_city",
      "publisher_company",
      "publisher_country",
      "publisher_year",
      "publisher_city_rom",
      "publisher_company_rom",
      "publisher_country_rom",
      "publisher_year_rom",
      "title_rom",
      "title",
      "translated_title",
      "language"
    ];

    this.engToCode = codeLookUp;
    this.compileBookData();
  }

  ngOnInit() {
      this.http.get<AWT>('http://us-central1-test-project-d9089.cloudfunctions.net/getAWT').subscribe(data=>{
         this.awt=data.awt;
         this.week=data.week;
         console.log(data.awt)
      });
  }

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
    // This creates a true copy instead of simply creating a pointer for the objects
    var downloadedBookData = JSON.parse(JSON.stringify(this.compiledBookData)); 

    for(var item of downloadedBookData) {
      item['language'] = this.engToCode[item['language']];
    }

    var bookData = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(downloadedBookData, null, "   "));
    var downloader = document.createElement('a');

    downloader.setAttribute('href', bookData);
    downloader.setAttribute('download', 'Compiled-Book-Data.json');
    downloader.click();
  }
}
