import { Component, OnInit } from '@angular/core';
import { AfService } from '../providers/af.service';
import { User } from '../providers/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User;

  constructor(public AfService: AfService, private router: Router) { }

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
