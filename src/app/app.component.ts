import { Component } from '@angular/core';

import { fromEvent, Subject, interval } from 'rxjs';
import {
  buffer,
  bufferWhen,
  bufferTime,
  bufferCount,
  bufferToggle,
  switchMap,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular';
  start$ = new Subject();
  stop$ = new Subject();
  // Count to hold the current emitted value
  count = 0;
  ngOnInit() {
    // Each time the start$ emits a new value, a new cache will be start
    this.start$
      .pipe(
        switchMap(() => interval(1000)),
        tap((v) => {
          this.count = v;
        }),
        // Each time the end$ emits the current values will be release
        // then start to cache new values for the next release
        buffer(this.stop$)
      )
      .subscribe({
        next: (v) => {
          console.log(v);
        },
        complete: () => {
          console.log('complete');
        },
      });
  }

  click(): void {
    this.start$.next();
  }
  clickStop(): void {
    this.stop$.next();
  }
}
