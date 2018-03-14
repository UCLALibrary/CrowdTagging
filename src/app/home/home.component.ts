import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Book, Author } from '../book';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bookCollection: AngularFirestoreCollection<Book>;
  books: Observable<Book[]>;
  bookDoc: AngularFirestoreDocument<Book>;
  authorCollection: AngularFirestoreCollection<Author>;
  authors: Observable<Author[]>
  author: Observable<Author>
  title: string;
  constructor(private afs: AngularFirestore) {
    this.title = 'Crowd Tagging';
    this.bookCollection = this.afs.collection<Book>('books');
    this.books = this.bookCollection.valueChanges();
    this.bookDoc = this.afs.doc<Book>('books/UBFTlAJtxEK3daRYa543');
    this.authors = this.bookDoc.collection<Author>('authors').valueChanges();
    this.author = this.afs.doc<Author>('authors/1').valueChanges();
  }

  ngOnInit() {
  }

}
