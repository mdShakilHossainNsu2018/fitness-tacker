import {Injectable} from '@angular/core';
import {UserModel} from './user.model';
import {AuthDataModel} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {TrainingService} from '../trianing/training.service';
import {UiService} from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: UserModel;

  isAuthenticated = false;

  changeAuth = new Subject<boolean>();

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UiService
  ) {
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.authSuccessfully();
      } else {
        this.trainingService.cancelSubscriptions();
        this.changeAuth.next(false);
        this.isAuthenticated = false;
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthDataModel) {
    this.uiService.isloading.next(true);
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(
      res => {
        this.uiService.isloading.next(false);
        this.authSuccessfully();
      }).catch(
      errorMes => {
        this.uiService.isloading.next(false);
        this.uiService.openSnackBar(errorMes.message, 300);
      }
    );
  }

  login(authData: AuthDataModel) {
    this.uiService.isloading.next(true);
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password).then(
      res => {
        this.uiService.isloading.next(false);
        this.authSuccessfully();
      }).catch(
      errorMes => {
        this.uiService.isloading.next(false);
        this.uiService.openSnackBar(errorMes.message, 300);
      }
    );
  }

  logout() {
    this.afAuth.auth.signOut().catch(reason => {
      console.log(reason);
    });
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.changeAuth.next(true);
    this.router.navigate(['/training']);
  }
}
