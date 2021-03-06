import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TranscribeComponent } from './transcribe/transcribe.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddOptionComponent } from './transcribe/addOption/addOption.component';
import { TitleComponent } from './transcribe/title/title.component';
import { AfService } from './providers/af.service';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { ProfileComponent } from './profile/profile.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'transcribe', component: TranscribeComponent, canActivate: [UserGuard] },
  { path: 'transcribe/:bookID', component: TranscribeComponent, canActivate: [AdminGuard]},
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [UserGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,	
    TranscribeComponent,
    HomeComponent,
    AddOptionComponent,
    TitleComponent,
    AdminComponent,
    ProfileComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
  ],
  providers: [AngularFireDatabase, AfService, AdminGuard, UserGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
