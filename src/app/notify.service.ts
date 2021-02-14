import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class NotifyService {

  constructor(private snackBar: MatSnackBar) { }

  public error(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 30000,
      panelClass: "error",
    });
  }

  public warning(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 30000,
      panelClass: "warning",
    });
  }

  public success(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 30000,
      panelClass: "success",
    });
  }


}
