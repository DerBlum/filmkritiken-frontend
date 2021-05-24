import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Bewertung, Filmkritiken } from 'src/app/openapi';
import { UserService } from 'src/app/shared/user/user.service';
import { FilmkritikenFrontendService } from '../../services/filmkritiken.service';
import { getAverageWertung } from '../../utilities/BewertungUtilities';

@Component({
  selector: 'fk-table',
  templateUrl: './fk-table.component.html',
  styleUrls: ['./fk-table.component.css']
})
export class FkTableComponent implements OnInit {

  @Input()
  filmkritiken: Filmkritiken;
  isLoggedIn = false;

  bewertungenDataSource: MatTableDataSource<Bewertung>;
  displayedColumns: string[] = ['person', 'wertung'];

  wertungControl = new FormControl(10, [Validators.min(1), Validators.max(10)]);

  constructor(
    private userService: UserService,
    private filmkritikenService: FilmkritikenFrontendService,
  ) { }

  ngOnInit(): void {
    this.bewertungenDataSource = new MatTableDataSource(this.filmkritiken.bewertungen);
    this.userService.subscribeToLoginState({
      next: loginStateUpdated => this.isLoggedIn = loginStateUpdated
    })
    this.isLoggedIn = this.userService.isLoggedIn();
    this.setInitialWertung();
  }

  getAverageWertung(): string {
    return getAverageWertung(this.filmkritiken.bewertungen);
  }

  setInitialWertung(): void {
    if (this.isLoggedIn && this.filmkritiken?.bewertungen) {
      let user = this.userService.getUsername();
      for (const wertung of this.filmkritiken.bewertungen) {
        if (wertung.von == user) {
          this.wertungControl.setValue(wertung.wertung);
          return;
        }
      }
    }
  }

  sendWertung(): void {
    this.filmkritikenService.setBewertung(
      this.filmkritiken.id,
      this.userService.getUsername(),
      {
        filmkritikenId: this.filmkritiken.id, wertung: this.wertungControl.value
      }
    );
  }

}
