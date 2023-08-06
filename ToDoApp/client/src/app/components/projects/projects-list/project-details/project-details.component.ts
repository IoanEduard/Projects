import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IProject } from 'src/app/shared/models/IProject';
import { ProjectService } from 'src/app/shared/services/project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {

  projectId: number;
  project: IProject = {} as IProject;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = +params!.get('id')!;
      this.getProjectDetails();
    });
  }

  getProjectDetails() {
    this.projectService.getProjectById(this.projectId).subscribe(result => {
      this.project = result;
    })
  }

}
