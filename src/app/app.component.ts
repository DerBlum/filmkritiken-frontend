import { Clipboard } from '@angular/cdk/clipboard';
import {Component, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, take } from 'rxjs/operators';
import { openErrorPopup } from './filmkritiken/utilities/ErrorPopup';
import { UserService } from './shared/user/user.service';
import * as roles from './shared/user/roles';
import {MatDialog} from '@angular/material/dialog';
import {FkAddFilmDialogComponent} from './filmkritiken/components/fk-add-film-dialog/fk-add-film-dialog.component';

@Component({
    selector: 'fk-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit{

  title = 'filmkritiken-frontend';
  isLoggedIn = false;
  canCopyToken = false;
  canAddFilm = false;

  constructor(
    private userService: UserService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.userService.subscribeToLoginState({
      next: (loginState) => this.loginStateUpdated(loginState)
    });
    this.loginStateUpdated(this.userService.isLoggedIn());
  }

  loginStateUpdated(loginState: boolean): void {
    this.isLoggedIn = loginState;
    this.canCopyToken = this.userService.hasRole(roles.roleDebugCopyAuthToken);
    this.canAddFilm = this.userService.hasRole(roles.roleFilmAdd);
  }

  loginPopup(): void {
    this.userService.loginViaPopup();
  }

  copyAuthToken(): void {
    this.userService.getAuthToken().
      pipe(
        take(1),
        map(token => {
          if (!token) {
            openErrorPopup(this.snackBar, 'Token konnte nicht kopiert werden.');
          }

          this.clipboard.copy(token.toString());
          openErrorPopup(this.snackBar, 'Token kopiert.');
        }),
        catchError(_ => {
          openErrorPopup(this.snackBar, 'Token konnte nicht kopiert werden.');
          return undefined;
        })
      )
      .toPromise()
      .finally(() => { });
  }

  logout(): void {
    this.userService.logout();
  }

  openAddFilmDialog(): void {
    this.matDialog.open(FkAddFilmDialogComponent);
  }
}
