import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideFirebaseApp, initializeApp} from '@angular/fire/app'
import { routes } from './app.routes';
import { firebaseConfig } from './firebase/firebase-config';
import {getAuth, provideAuth} from '@angular/fire/auth'
import {getFirestore, provideFirestore} from '@angular/fire/firestore'
import { provideToastr } from 'ngx-toastr';

import {provideAnimations} from '@angular/platform-browser/animations'
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideToastr(),
    provideAnimations()
  ]
};