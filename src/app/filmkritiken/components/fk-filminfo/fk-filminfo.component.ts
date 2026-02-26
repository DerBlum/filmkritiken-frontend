import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Filmkritiken } from 'src/app/openapi';
import { UserService } from 'src/app/shared/user/user.service';
import * as roles from '../../../shared/user/roles';
import { FkSetBesprochenAmDialogComponent } from '../fk-set-besprochen-am-dialog/fk-set-besprochen-am-dialog.component';

@Component({
    selector: 'fk-filminfo',
    templateUrl: './fk-filminfo.component.html',
    styleUrls: ['./fk-filminfo.component.css'],
    standalone: false
})
export class FkFilminfoComponent implements OnInit {

  @Input()
  filmkritiken: Filmkritiken;
  besprochenAm: Date;
  hasRoleForEdit = false;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const ba = this.filmkritiken?.details?.besprochenam;
    if (ba) {
      this.besprochenAm = new Date(this.filmkritiken.details.besprochenam);
    }

    this.userService.subscribeToLoginState({
      next: _ => this.updateRoles(),
    });
    this.updateRoles();
  }

  updateRoles(): void {
    this.hasRoleForEdit = this.userService.isLoggedIn()
      ? this.userService.hasRole(roles.roleFilmAdd)
      : false;
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(FkSetBesprochenAmDialogComponent, {
      data: { filmkritiken: this.filmkritiken },
      width: '320px',
    });

    dialogRef.afterClosed().subscribe((newDate: Date | undefined) => {
      if (newDate) {
        this.besprochenAm = newDate;
      }
    });
  }

}
