import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AngularFireDatabase } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TranscribeComponent } from './transcribe/transcribe.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DataComponent } from './transcribe/data/data.component';
import { TitleComponent } from './transcribe/title/title.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'transcribe', component: TranscribeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TranscribeComponent,
    HomeComponent,
    DataComponent,
    TitleComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AngularFireDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }
