import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { User } from './user';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from '@angular/router';

@Injectable()
export class AfService {
  user$: Observable<User>;

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore, private router: Router) { 
    this.user$ = afAuth.authState.switchMap(user => {
      if(user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    });
  }

  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then((credential) =>  {
      this.updateUser(credential.user);

      if(this.user$) {
        this.router.navigate(['transcribe']);
        // Do all users land here? What are the landing pages for user/admin?
      }
    });
  }

  updateUser(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      roles: {
        user: true,
        admin: false
      }
    }

    return userRef.set(data,{merge: true});
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
