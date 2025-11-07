import {
  trigger,
  transition,
  style,
  query,
  animate,
  group,
} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        opacity: 0,
      }),
    ], { optional: true }),
    
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('300ms ease-out', style({
          opacity: 0,
          transform: 'translateY(-20px)',
        })),
      ], { optional: true }),
      
      query(':enter', [
        animate('400ms 200ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)',
        })),
      ], { optional: true }),
    ]),
  ]),
]);

export const slideInAnimation = trigger('slideInAnimation', [
  transition('TempleSelector => *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 })
    ], { optional: true }),
    query(':leave', animate('300ms ease-out', style({ 
      transform: 'translateX(-100%)', 
      opacity: 0 
    })), { optional: true }),
    query(':enter', animate('400ms 100ms ease-out', style({ 
      transform: 'translateX(0%)', 
      opacity: 1 
    })), { optional: true })
  ]),
  
  transition('* => TempleSelector', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(-100%)', opacity: 0 })
    ], { optional: true }),
    query(':leave', animate('300ms ease-out', style({ 
      transform: 'translateX(100%)', 
      opacity: 0 
    })), { optional: true }),
    query(':enter', animate('400ms 100ms ease-out', style({ 
      transform: 'translateX(0%)', 
      opacity: 1 
    })), { optional: true })
  ])
]);
