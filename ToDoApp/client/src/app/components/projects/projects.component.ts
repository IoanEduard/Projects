import { ProjectsFormModalComponent } from './projects-list/projects-form-modal/projects-form-modal.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { Observable, Observer, of, switchMap } from 'rxjs';
import { BasicResponse } from 'src/app/shared/models/dtos/BasicResponse';
import { ProjectService } from 'src/app/shared/services/project.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  bsModalRef?: BsModalRef;
  search?: string;
  suggestions$?: Observable<BasicResponse[]>;
  errorMessage?: string;

  constructor(private modalService: BsModalService, private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    this.typeAhead();
  }

  onSelect(event: any) {
    this.router.navigate(['projects/', event.item.id]);
  }

  private typeAhead() {
    this.suggestions$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.search);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          return this.projectService.searchProjectByName(query);
        }
        return of([]);
      })
    );
  }

  openAddProjectModal() {
    const initialState: ModalOptions = {
      initialState: {}
    };
    this.bsModalRef = this.modalService.show(ProjectsFormModalComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
