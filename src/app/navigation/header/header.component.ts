import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sideNav = new EventEmitter<void>();

  authSubscription: Subscription;

  authStatus = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
   this.authSubscription = this.authService.changeAuth.subscribe(status => {
      this.authStatus = status;
    });
  }

  onToggleSideNav() {
    this.sideNav.emit();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  logOut() {
    this.authService.logout();
  }
}
