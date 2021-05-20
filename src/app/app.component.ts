import { Component } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
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
