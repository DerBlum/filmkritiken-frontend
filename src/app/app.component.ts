import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, take } from 'rxjs/operators';
import { openErrorPopup } from './filmkritiken/utilities/ErrorPopup';
import { UserService } from './shared/user/user.service';
import * as roles from './shared/user/roles';

@Component({
  selector: 'fk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'filmkritiken-frontend';
  isLoggedIn = false;
  canCopyToken = false;

  constructor(
    private userService: UserService,
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.userService.subscribeToLoginState({
      next: (loginState) => this.loginStateUpdated(loginState)
    })
    this.loginStateUpdated(this.userService.isLoggedIn());
  }

  loginStateUpdated(loginState: boolean): void {
    this.isLoggedIn = loginState;
    this.canCopyToken = this.userService.hasRole(roles.roleDebugCopyAuthToken);
  }

  loginPopup() {
    this.userService.loginViaPopup();
  }

  copyAuthToken() {
    this.userService.getAuthToken().
      pipe(
        take(1),
        map(token => {
          if (!token) {
            openErrorPopup(this._snackBar, "Token konnte nicht kopiert werden.");
          }

          this.clipboard.copy(token.toString());
          openErrorPopup(this._snackBar, "Token kopiert.");
        }),
        catchError(_ => {
          openErrorPopup(this._snackBar, "Token konnte nicht kopiert werden.");
          return undefined;
        })
      )
      .toPromise()
      .finally(() => { })
  }

  logout() {
    this.userService.logout();
  }

}
