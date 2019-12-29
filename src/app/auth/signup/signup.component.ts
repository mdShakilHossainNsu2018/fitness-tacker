import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UiService} from '../../shared/ui.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signUpForm;
  isLoading = false;
  loadingSubscription: Subscription;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private uiService: UiService) {
    this.signUpForm = this.formBuilder.group({
      email: '',
      password: '',
      birthday: '',
      agree: ''
    });
  }

  ngOnInit() {
    this.loadingSubscription = this.uiService.isloading.subscribe(value => {
      this.isLoading = value;
    });
  }

  onSubmit(formValue: any) {
    this.authService.registerUser(
      {
        email: formValue.value.email,
        password: formValue.value.password
      }
    );
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }
}
