import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

export function openErrorPopup(snackBar: MatSnackBar, error: string): void {
    snackBar.open(error, 'Schließen', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
    });
}
