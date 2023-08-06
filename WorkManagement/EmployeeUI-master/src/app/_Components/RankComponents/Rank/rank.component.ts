import { Component, OnInit    } from '@angular/core';
import { Rank } from 'src/app/_Models/Rank';
import { RankService } from 'src/app/_Services/rank.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss'],

})
export class RankComponent implements OnInit {
  ranks: Rank[];
  rankForm: boolean;
  isNewForm: boolean = true;
  newRank: any = {};

  order: string = 'Name';
  reverse: boolean = false;

  constructor(
    private rankService: RankService,
    private modalService: NgbModal,
  ) 
  { }

  ngOnInit() {
    this.getRanks();
  }

  saveRank(rank: Rank) {
    if (this.isNewForm) {
      this.rankService.addRank(rank).subscribe(_ => this.ranks.push(rank));
    }
    else {
      this.rankService.putRank(rank).subscribe();
    }
    
    this.modalService.dismissAll();
    this.rankForm = false;
  }

  getRanks(): void {
    this.rankService.getRanks()
      .subscribe(
          ranks => {
            this.ranks = ranks;
      });
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  openAddRank(content) {
      this.modalService.open(content, { centered: true });

      if (this.ranks.length) {
        this.newRank = {};
      }
      this.rankForm = true;
      this.isNewForm = true;
  }

  openEditRank(rank: Rank, content) {
    this.modalService.open(content, { centered: true });

    if (!rank) {
      this.rankForm = false;
      return;
    }
    this.rankForm = true;
    this.isNewForm = false;
    this.newRank = rank;
  }

  delete(rank: Rank): void {
    this.ranks = this.ranks.filter(j => j !== rank);
    this.rankService.deleteRank(rank).subscribe();
  }
}
