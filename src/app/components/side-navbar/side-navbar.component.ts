import { Component, OnInit } from '@angular/core';
import {faHome, faPlus, faChartBar, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { NavItemConfig } from '../../interfaces/ui-config/nav-item-config';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent implements OnInit {
  faSignOutAlt = faSignOutAlt
  navItems: NavItemConfig[] = [{
    name: 'Home',
    route: 'home',
    icon: faHome,
    active: false
  },
  {
    name: 'My Polls',
    route: 'my-polls',
    icon: faChartBar,
    active: false
  },
  {
    name: 'Create Poll',
    route: 'create-poll',
    icon: faPlus,
    active: false
  }]
  profilePic: any;
  userName: any;
  showDropdown: boolean | undefined;

  constructor(public authService: AuthService, private router: Router, public themeService: ThemeService) {}
   navigateToHome() {
     this.router.navigate(['/home']);
   }
  logout() {
    this.authService.logoutUser();
  }

  ngOnInit(): void {
    this.router.events.subscribe((routeEvent) =>{
      
      if(routeEvent instanceof NavigationEnd){
        this.navItems.map((item) =>{
          
          if(item.route) {
            item.active = routeEvent.url.includes(item.route);
          }
        })
      }
    })

    const user = this.authService.getCurrentUser();
    if (user) {
      this.profilePic = user.photoURL;
      this.userName = user.displayName;
    }

    
    
         
  }


  selectTab(item: NavItemConfig){
    const index = this.navItems.findIndex((tab) => tab.name === item.name );

    this.navItems.map((tab) => tab.active = tab.name === this.navItems[index].name);
    this.router.navigateByUrl(this.navItems[index].route);

  }

  isSideNav() {
    return Object.keys(this.authService.getCurrentUser()).length > 0
  }

  isAuthRoute(): boolean {
  const currentRoute = this.router.url;
  return currentRoute.includes('login') || currentRoute.includes('register');
}


    
}