import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AfService } from '../providers/af.service';
import { User } from '../providers/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string;
  user: User;

  constructor(private afs: AngularFirestore, public AfService: AfService) {
    this.title = 'Crowd Tagging';
  }

  login() {
    this.AfService.loginWithGoogle();
  }

  ngOnInit() {
    this.AfService.user$.subscribe(user => this.user = user);
  }
}
