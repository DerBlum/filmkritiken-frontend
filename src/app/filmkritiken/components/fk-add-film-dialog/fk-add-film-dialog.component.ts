import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Film, Image} from 'src/app/openapi';
import { UserService } from 'src/app/shared/user/user.service';
import { FilmkritikenFrontendService } from '../../services/filmkritiken.service';
import { FilmRequest } from 'src/app/openapi/model/filmRequest';
import { openErrorPopup } from '../../utilities/ErrorPopup';
import * as roles from '../../../shared/user/roles';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-fk-add-film-dialog',
    templateUrl: './fk-add-film-dialog.component.html',
    styleUrls: ['./fk-add-film-dialog.component.css'],
    standalone: false
})
export class FkAddFilmDialogComponent implements OnInit {

  hasRoleForAdd = false;

  vonControl = new FormControl<string>('', [Validators.required]);
  titelControl = new FormControl<string>('', [Validators.required]);
  imageCopyrightControl = new FormControl<string>('IMDb', [Validators.required]);
  altersfreigabeControl = new FormControl<number>(0, [Validators.required, Validators.min(0), Validators.max(18)]);
  erscheinungsjahrControl = new FormControl<number>(2000, [Validators.required, Validators.min(1900), Validators.max(2100)]);
  regieControl = new FormControl<string>('', [Validators.required]);
  laengeControl = new FormControl<number>(0, [Validators.required, Validators.min(1), Validators.max(1000)]);
  originalspracheControl = new FormControl<string>('', [Validators.required]);
  produktionslandControl = new FormControl<string>('', [Validators.required]);
  originaltitelControl = new FormControl<string>('');
  besprochenamControl = new FormControl<Date>(null, [Validators.required]);

  filmFormGroup = this.fb.group({
    von: this.vonControl,
    titel: this.titelControl,
    imageCopyright: this.imageCopyrightControl,
    altersfreigabe: this.altersfreigabeControl,
    erscheinungsjahr: this.erscheinungsjahrControl,
    regie: this.regieControl,
    laenge: this.laengeControl,
    originalsprache: this.originalspracheControl,
    produktionsland: this.produktionslandControl,
    originaltitel: this.originaltitelControl,
    besprochenam: this.besprochenamControl,
  });

  selectedImage: Blob = null;

  constructor(
    private userService: UserService,
    private filmkritikenService: FilmkritikenFrontendService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FkAddFilmDialogComponent>,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.dialogRef.updateSize('80%', '80%');
    this.userService.subscribeToLoginState({
      next: _ => this.updateOnLoginStateChange()
    });

    this.updateOnLoginStateChange();
  }

  updateOnLoginStateChange(): void {
    if (this.userService.isLoggedIn()) {
      this.hasRoleForAdd = this.userService.hasRole(roles.roleFilmAdd);
    } else {
      this.hasRoleForAdd = false;
    }
  }

  addFilm(): void {
    // validate
    if (this.filmFormGroup.invalid) {
      this.showError('Nicht alle notwendigen Felder ausgefüllt');
      return;
    }
    if (this.selectedImage === null) {
      this.showError('Kein Bild ausgewählt');
      return;
    }

    // build request
    const film = {
      titel: this.filmFormGroup.value.titel,
      image: {
        copyright: this.filmFormGroup.value.imageCopyright,
      } as Image,
      altersfreigabe: this.filmFormGroup.value.altersfreigabe,
      erscheinungsjahr: this.filmFormGroup.value.erscheinungsjahr,
      regie: this.filmFormGroup.value.regie,
      laenge: this.filmFormGroup.value.laenge,
      originalsprache: this.filmFormGroup.value.originalsprache,
      produktionsland: this.filmFormGroup.value.produktionsland,
      originaltitel: this.filmFormGroup.value.originaltitel,
    } as Film;
    const filmRequest = {
      film,
      von: this.filmFormGroup.value.von,
      besprochenam: this.filmFormGroup.value.besprochenam.toISOString(),
      bewertungoffen: false,
    } as FilmRequest;

    // send request
    const response = this.filmkritikenService.addFilm(
      filmRequest,
      this.selectedImage,
    );
    response.subscribe({
      error: error => {
        this.showError((error as Error).message);
      },
      next: filmkritiken => {
        if (filmkritiken instanceof HttpErrorResponse) {
          this.showError(filmkritiken.message);
        }
        this.dialogRef.close();
        return;
      },
      complete: () => console.log('addFilm received completed event')
    });

  }

  onImageSelected(): void {
    const inputNode: any = document.querySelector('#file');
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.selectedImage = new Blob([e.target.result]);
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  showError(errorMessage: string): void {
    openErrorPopup(this.snackBar, errorMessage);
  }

}
