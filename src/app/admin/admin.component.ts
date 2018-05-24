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

  user: User;
  books;

  constructor(private afs: AngularFirestore, public AfService: AfService) { 
    this.books = this.afs.collection('books').valueChanges();
  }

  ngOnInit() { 
    this.AfService.user$.subscribe(user => this.user = user);
  }

}
