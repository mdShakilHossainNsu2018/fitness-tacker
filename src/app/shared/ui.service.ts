import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  isloading = new Subject<boolean>();

  constructor(private snackBar: MatSnackBar) {
  }

  openSnackBar(message, duration) {
    this.snackBar.open(message, null, {
      duration
    });
  }

}
