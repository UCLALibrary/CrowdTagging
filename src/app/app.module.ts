import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TranscribeComponent } from './transcribe/transcribe.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TranscribeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
