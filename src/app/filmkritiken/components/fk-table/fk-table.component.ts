import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Bewertung, Filmkritiken } from 'src/app/openapi';
import { UserService } from 'src/app/shared/user/user.service';
import { FilmkritikenFrontendService } from '../../services/filmkritiken.service';
import { getAverageWertung } from '../../utilities/BewertungUtilities';
import { openErrorPopup } from '../../utilities/ErrorPopup';
import * as roles from '../../../shared/user/roles';

@Component({
  selector: 'fk-table',
  templateUrl: './fk-table.component.html',
  styleUrls: ['./fk-table.component.css']
})
export class FkTableComponent implements OnInit {

  @Input()
  filmkritiken: Filmkritiken;
  hasRoleForBewertung = false;
  hasRoleForOpenCloseBewertung = false;

  bewertungenDataSource: MatTableDataSource<Bewertung>;
  displayedColumns: string[] = ['person', 'wertung'];

  wertungControl = new FormControl(10, [Validators.required, Validators.min(1), Validators.max(10)]);
  wertungFormGroup = new FormGroup({ 'wertung': this.wertungControl });

  constructor(
    private userService: UserService,
    private filmkritikenService: FilmkritikenFrontendService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.bewertungenDataSource = new MatTableDataSource(this.filmkritiken.bewertungen);
    this.userService.subscribeToLoginState({
      next: _ => this.updateOnLoginStateChange()
    })

    this.updateOnLoginStateChange();
  }

  updateOnLoginStateChange(): void {
    if (this.userService.isLoggedIn()) {
      this.hasRoleForBewertung = this.userService.hasRole(roles.roleBewertungAdd);
      this.hasRoleForOpenCloseBewertung = this.userService.hasRole(roles.roleBewertungOpenClose);
      this.setInitialWertung();
    } else {
      this.hasRoleForBewertung = false;
      this.hasRoleForOpenCloseBewertung = false;
    }
  }

  getAverageWertung(): string {
    return getAverageWertung(this.filmkritiken.bewertungen);
  }

  setInitialWertung(): void {
    if (this.hasRoleForBewertung && this.filmkritiken?.bewertungen) {
      let user = this.userService.getUsername();
      for (const wertung of this.filmkritiken.bewertungen) {
        if (wertung.von == user) {
          this.wertungControl.setValue(wertung.wertung);
          return;
        }
      }
    }
  }

  openCloseBewertungen(open: boolean): void {
    let filmkritikenId = this.filmkritiken.id;

    let response = this.filmkritikenService.openCloseBewertungen(filmkritikenId, open)
    response.subscribe({
      error: error => {
        this.showError((error as Error).message);
      },
      next: error => {
        if (!error) {
          this.filmkritiken.details.bewertungoffen = open;
          return;
        }

        if (error instanceof HttpErrorResponse) {
          this.showError((error as HttpErrorResponse).error);
        } else {
          this.showError(error.message);
        }
      },
      complete: () => console.log("openCloseBewertungen received completed event")
    })

  }

  sendWertung(): void {
    let filmkritikenId = this.filmkritiken.id;
    let username = this.userService.getUsername();
    let wertung = this.wertungControl.value;

    if (this.wertungControl.invalid) {
      this.showError("Wertung muss zwischen 1 und 10 liegen.");
      return;
    }

    let response = this.filmkritikenService.setBewertung(
      filmkritikenId,
      username,
      {
        filmkritikenId: filmkritikenId,
        wertung: wertung,
      }
    );
    response.subscribe({
      error: error => {
        this.showError((error as Error).message);
      },
      next: error => {
        if (!error) {
          this.createOrUpdateWertung(username, wertung);
          return;
        }

        if (error instanceof HttpErrorResponse) {
          this.showError((error as HttpErrorResponse).error);
        } else {
          this.showError(error.message);
        }
      },
      complete: () => console.log("sendWertung received completed event")
    });
  }

  createOrUpdateWertung(username: string, wertung: number) {
    let bewertungFound = false;
    this.bewertungenDataSource.data.forEach(element => {
      if (element.von == username) {
        element.wertung = wertung;
        bewertungFound = true;
      }
    });

    if (!bewertungFound) {
      this.bewertungenDataSource.data.push({
        enthaltung: false,
        von: username,
        wertung: wertung,
      });
    }
  }

  showError(errorMessage: string) {
    openErrorPopup(this._snackBar, errorMessage);
  }

}
