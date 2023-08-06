import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [
    trigger('widthGrow', [
      state('closed', style({
        width: 100,
      })),
      state('open', style({
        width: 200
      })),
      transition('* => *', animate(250))
    ])
  ],
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isLoggedIn: boolean = false;
  minimized = false;
  state = "open";

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(next => {
      this.isLoggedIn = next;
    })
  }

  minimize() {
    if (!this.minimized) {
      setTimeout(() => this.minimized = !this.minimized, 10);
    } else {
      setTimeout(() => this.minimized = !this.minimized, 200);
    }
    (this.state == "closed") ? this.state = "open" : this.state = "closed";
  }
}
