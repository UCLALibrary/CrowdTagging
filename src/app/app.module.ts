import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TranscribeComponent } from './transcribe/transcribe.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { HomeComponent } from './home/home.component';


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
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
