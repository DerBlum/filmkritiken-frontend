import { Component } from '@angular/core';
import { UserService } from './shared/user/user.service';

@Component({
  selector: 'fk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'filmkritiken-frontend';
  isLoggedIn = false;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.refreshLoginState();
    this.userService.subscribeToLoginState({
      next: loginStateUpdated => this.isLoggedIn = loginStateUpdated
    })
  }

  loginPopup() {
    this.userService.loginViaPopup();
  }

  logout() {
    this.userService.logout();
  }

  refreshLoginState() {
    this.isLoggedIn = this.userService.isLoggedIn();
  }

}
