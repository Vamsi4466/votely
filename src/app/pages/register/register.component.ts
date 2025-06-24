import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faGoogle} from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../services/auth.service';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
  faGoogle = faGoogle
  registerForm: FormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
    confirmPassword: this.fb.control('', [Validators.required])
  });  

  toastr= inject(ToastrService)
  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService){}

  gotoLogin(){
    this.router.navigateByUrl('login')
  }

  handleRegister(){
    this.authService.registerEmailPasswordRegister(this.registerForm.value.email, this.registerForm.value.password).then((result) =>{
      const credential = GoogleAuthProvider.credentialFromResult(result);

      const user = result.user;
      this.authService.addUserData(user, {name: this.registerForm.value.name});
      this.authService.setCurrentUser(user);

      this.toastr.success('Successfully registered an account')
      this.router.navigateByUrl('');
    }).catch((error) =>{
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        this.toastr.error('This email is already in use');
      } else if (error.code === 'auth/invalid-email') {
        this.toastr.error('Invalid Email');
      } else {
        this.toastr.error('Encountered an error while trying to register an account')
      }
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