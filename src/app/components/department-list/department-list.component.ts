import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { IDepartment } from '../../interfaces/department';
import { HttpService } from '../../service/http.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, RouterLink, MatInputModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent {
  departmentList: IDepartment[] = [];
  httpService = inject(HttpService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  displayedColumns: string[] = [
    'departmentName',
    'action'
  ];
  ngOnInit() {
    this.getDepartmentFromServer();
  }

  getDepartmentFromServer() {
    this.httpService.getAllDepartments().subscribe((result) => {
      this.departmentList = result;
    });
  }

  editDep(id: number) {
    this.router.navigateByUrl("/department/" + id);
  }

  deleteDep(id: number) {
    this.httpService.deleteDepartment(id).subscribe({
      next: () => {
        this.notificationService.success('Department deleted successfully');
        this.getDepartmentFromServer();
      },
      error: () => {
        this.notificationService.error('Failed to delete department');
      }
    });
  }  
}
