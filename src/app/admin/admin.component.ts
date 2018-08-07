import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AfService } from '../providers/af.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { codeLookUp } from '../../assets/LanguageCodes';
import { scriptLookUp } from '../../assets/ScriptCodes';

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
  scriptToCode;
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
      "language",
      "script"
    ];

    this.engToCode = codeLookUp;
    this.scriptToCode = scriptLookUp;

    this.compileBookData();
  }

  ngOnInit() {
      this.http.get<AWT>('http://us-central1-test-project-d9089.cloudfunctions.net/getAWT').subscribe(data=>{
         this.awt=data.awt;
         this.week=data.week;
      });
  }

  maintainCompletionColor(complete) {
    if(complete)
      return "complete";
    
    return "";
  }

  /*
    Marks a book as complete, at request of admin. 
  */
  completeBook(event, id) {
      event.target.classList.toggle("complete");

      this.afs.doc(`books/${id}`).ref.get().then(obj => {
        let object = obj.data();

        if(event.target.classList.length === 4){
          object.completed = true;
        } else {
          object.completed = false;
        }
        
        this.afs.doc(`books/${id}`).update(object);
      });
  }

  /* 
    Checks to see if there are new books to add to the database.

    Uses the previous checked book to determine where to begin. Sequentially,
    it will check to see if a bookset with the corresponding imageKey exists
    in the assets folder. If the image exists, it checks to see if a record 
    exists in the database. If not, it will create one, otherwise ignoring it.

    If it comes across a bookset with a given imageKey that doesn't exist, then we 
    can assume that no further books after that key will exist in the assets folder
    either, since we are going about this incrementally, and we can stop the algorithm.
  */
  async checkForNewBooks() {
    let promises = [];
    let lastBookChecked;
    
    await this.afs.doc('progress/checkForNewBooks').ref.get().then((data) => {
      lastBookChecked = data.data().lastBookChecked;
    });

    for(var i = lastBookChecked; i <= lastBookChecked * 100; i++){
      var imageKey = "EALJ" + ((i < 10) ? ("000" + i) : ((i >= 100) ? ("0" + i) : ("00" + i)));
      var imagePath = "/assets/all50/" + imageKey + "_001.jpg";

      const t = await this.http.get(imagePath).catch(err => Observable.of(err.status)).toPromise();

      if(t !== 404){
        promises.push(new Promise((resolve, reject) => {    
          this.afs.collection('books').doc(`${imageKey}`).ref.get().then(val => {
            if(!val.exists){
                this.afs.collection('books').doc(`${imageKey}`)
                .set({image_key: imageKey, submissions: 0}, { merge: true })
                .then(() => { resolve(); });
            } else { resolve(); }
          });
        }));
      } else {
        this.afs.doc('progress/checkForNewBooks').set({lastBookChecked: i-1});
        return;
      }

      await Promise.all(promises);
      this.afs.doc('progress/checkForNewBooks').set({lastBookChecked: i});
    }
      
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
        this.afs.doc(`books/${book.id}`).ref.get().then(docu => {
          var document = docu.data();

          if(document.submissions > 0){
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
              dict["id"] = book.id;
              dict["completed"] = document.completed;
              this.compiledBookData.push(dict);
              dict = {};
              promises = [];
            });
          }});
      });
    });

    this.checkForNewBooks();
  }

  // should call compileBookData() at start of this function, and then on completion, trigger download
  // keep it as is for now until I rewrite function that populates data on admin page, so that it's faster
  downloadJSON() {
    // This creates a true copy instead of simply creating a pointer for the objects
    var downloadedBookData = JSON.parse(JSON.stringify(this.compiledBookData)); 

    for(var item of downloadedBookData) {
      item['language'] = this.engToCode[item['language']];
      item['script'] = this.scriptToCode[item['script']];
      delete item["id"];
      delete item["completed"]
    }

    var bookData = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(downloadedBookData, null, "   "));
    var downloader = document.createElement('a');

    downloader.setAttribute('href', bookData);
    downloader.setAttribute('download', 'Compiled-Book-Data.json');
    downloader.click();
  }
}
