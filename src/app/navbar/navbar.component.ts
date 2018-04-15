import { Component, OnInit } from '@angular/core';
import { AfService } from '../providers/af.service';
import { User } from '../providers/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User;

  constructor(public AfService: AfService) { }

  login() {
    this.AfService.loginWithGoogle();
  }

  logout() {
    this.AfService.logout();
  }

  ngOnInit() {
    this.AfService.user$.subscribe(user => this.user = user);
  }

}
