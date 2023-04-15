import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './reducers';
import { loginSuccess } from './auth/store/auth.actions';
import { User } from './common/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private store = inject(Store<State>);

  ngOnInit(): void {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      this.store.dispatch(loginSuccess({ user }));
    }
  }
}
