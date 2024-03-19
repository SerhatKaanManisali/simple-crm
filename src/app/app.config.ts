import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'simple-crm-be975',
          appId: '1:558771221717:web:f290d277ec4082555fde5c',
          storageBucket: 'simple-crm-be975.appspot.com',
          apiKey: 'AIzaSyBwwi4YNd_3Q_XdOcsCBHnvED-FYRy9JGw',
          authDomain: 'simple-crm-be975.firebaseapp.com',
          messagingSenderId: '558771221717',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};