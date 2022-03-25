import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  pluck,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WindowService {
  height$: Observable<number>;
  width$: Observable<number>;

  constructor() {
    const windowSize$ = new BehaviorSubject(getWindowSize());

    this.height$ = windowSize$.pipe(pluck('height'), distinctUntilChanged());
    this.width$ = windowSize$.pipe(pluck('width'), distinctUntilChanged());

    fromEvent(window, 'resize')
      .pipe(map(getWindowSize))
      .subscribe(windowSize$.next);
  }
}

function getWindowSize() {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
  };
}
