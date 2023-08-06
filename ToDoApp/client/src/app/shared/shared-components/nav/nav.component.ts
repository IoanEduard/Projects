import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OurToastrService } from '../../services/toastr.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isLoggedIn: boolean;

  constructor(private authService: AuthService, private toastrService: OurToastrService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(next => {
      this.isLoggedIn = next;
    })
  }

  logout(){
    this.authService.logOut();
    this.toastrService.showMessage('logged out');
  }
}
