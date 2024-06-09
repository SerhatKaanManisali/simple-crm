import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  router: Router = inject(Router);
  title = 'simple-crm';
  isScreenSmall = false;
  isDrawerOpened = false;
  isOnDashboard = true;

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 800px)']).subscribe((state: BreakpointState) => {
      this.isScreenSmall = state.matches;
    });
  }

  onDrawerToggle() {
    this.isDrawerOpened = !this.isDrawerOpened;
  }

  navigateUp() {
    const currentUrl = this.router.url;
    const urlSegments = currentUrl.split('/').filter(segment => segment);

    if (urlSegments.length > 0) {
      urlSegments.pop();
      const newUrl = '/' + urlSegments.join('/');
      this.router.navigate([newUrl]);
    }
  }
}
