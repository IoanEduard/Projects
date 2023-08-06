import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';  
import { createWiresService } from 'selenium-webdriver/firefox';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {

  private activatedRoute: ActivatedRoute;
  private router: Router;

  showEmp: boolean = false;
  showRank: boolean = false;

  constructor(activatedRoute: ActivatedRoute, router: Router) 
  {
    this.activatedRoute = activatedRoute;
    this.router = router;
  }

  ngOnInit() {
  }

  CloseRankOutlet() { 
    this.router.navigate(['/manangement', {outlets: {'emp': ['employee'], 'rank': null}}]);
    this.showEmp = true;
    this.showRank = false;
  }

  CloseEmpOutlet() { 
    this.router.navigate(['/manangement', {outlets: {'rank': ['rank'], 'emp': null}}]);
    this.showEmp = false;
    this.showRank = true;
  }
}
