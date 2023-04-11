import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubResolver implements OnDestroy {
  destroy$ = new Subject();

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
