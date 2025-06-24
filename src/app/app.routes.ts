import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CreatePollComponent } from './pages/create-poll/create-poll.component';
import { MyPollsComponent } from './pages/my-polls/my-polls.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'my-polls',
        component: MyPollsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'create-poll',
        component: CreatePollComponent,
        canActivate: [authGuard]
    }
];