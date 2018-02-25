import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TranscribeComponent } from './transcribe/transcribe.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'transcribe', component: TranscribeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'tutorial', component: TutorialComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TranscribeComponent,
    AboutUsComponent,
    TutorialComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
