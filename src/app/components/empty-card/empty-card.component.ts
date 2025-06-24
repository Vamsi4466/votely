import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empty-card',
  standalone: true,
  imports: [],
  templateUrl: './empty-card.component.html',
  styleUrl: './empty-card.component.scss'
})
export class EmptyCardComponent {

  constructor(private router: Router) {} 
  routeToCreate(){
    this.router.navigateByUrl('create-poll')
  }
}