import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faGoogle} from '@fortawesome/free-brands-svg-icons'
import {faHome} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

library.add(fas,fab);
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  faGoogle = faGoogle;
  faHome= faHome;

  loginForm: FormGroup = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required])
  })
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  constructor(private router: Router, private fb: FormBuilder){}
  
  gotoRegister(){
    this.router.navigateByUrl('register')
  }

  handleSignInWithEmailPassword(){
    this.authService.signInEmailPassword(this.loginForm.value.email, this.loginForm.value.password).then((result) =>{
      const credential = GoogleAuthProvider.credentialFromResult(result);

      const user = result.user;
      this.authService.addUserData(user, null);
      this.authService.setCurrentUser(user);
      this.router.navigateByUrl('');
    }).catch((error) =>{
      console.error(error);

      this.toastr.error('Invalid credentials')
    })
  }

  handleSignWithGoogle(){
    this.authService.signInWithGoogle().then((result) =>{
      const credential = GoogleAuthProvider.credentialFromResult(result);

      const user = result.user;
      this.authService.addUserData(user, null);
      this.authService.setCurrentUser(user);
      this.router.navigateByUrl('');
    }).catch((error) =>{
      console.error(error);
    })
  }


  
}