import { MatSnackBar } from '@angular/material/snack-bar';

export function openErrorPopup(snackBar: MatSnackBar, error: string): void {
    snackBar.open(error, 'Schließen', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
    });
}
