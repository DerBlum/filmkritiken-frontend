import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Filmkritiken } from 'src/app/openapi';
import { openErrorPopup } from '../../utilities/ErrorPopup';
import { FilmkritikenFrontendService } from '../../services/filmkritiken.service';

@Component({
    selector: 'app-fk-set-besprochen-am-dialog',
    templateUrl: './fk-set-besprochen-am-dialog.component.html',
    styleUrls: ['./fk-set-besprochen-am-dialog.component.css'],
    standalone: false
})
export class FkSetBesprochenAmDialogComponent implements OnInit {

    besprochenamControl = new FormControl<Date>(null, [Validators.required]);

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { filmkritiken: Filmkritiken },
        private dialogRef: MatDialogRef<FkSetBesprochenAmDialogComponent>,
        private filmkritikenService: FilmkritikenFrontendService,
        private snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {
        const existing = this.data.filmkritiken?.details?.besprochenam;
        if (existing) {
            this.besprochenamControl.setValue(new Date(existing));
        }
    }

    save(): void {
        if (this.besprochenamControl.invalid) {
            openErrorPopup(this.snackBar, 'Bitte ein gültiges Datum eingeben');
            return;
        }

        const date: Date = this.besprochenamControl.value;
        this.filmkritikenService.setBesprochenAm(this.data.filmkritiken.id, date).subscribe({
            error: err => openErrorPopup(this.snackBar, (err as Error).message),
            next: err => {
                if (err instanceof Error) {
                    openErrorPopup(this.snackBar, err.message);
                    return;
                }
                this.dialogRef.close(date);
            },
        });
    }

}
