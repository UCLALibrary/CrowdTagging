import { Component, OnInit } from '@angular/core';
import { AfService } from '../providers/af.service';
import { User } from '../providers/user';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from '@firebase/util';
import { Book } from '../book';
import { Transcription } from '../transcription';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  books;

  constructor(private afs: AngularFirestore, public AfService: AfService) {}

  ngOnInit() { 
    this.AfService.user$.subscribe(user => {
      this.user = user;

      if(user) // prevent triggering error when logging out from profile page
        this.books = this.afs.collection(`progress/${user.uid}/books`).valueChanges();
    });
  }

  toggle(event){
    event.target.classList.toggle("rot");

    var data = Array.from(event.target.parentElement.parentElement.querySelectorAll('.data'));

    data.forEach(function(item){
      (item as any).classList.toggle("hidden"); 
  });
  }
}
