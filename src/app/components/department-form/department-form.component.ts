import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { HttpService } from '../../service/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDepartment } from '../../interfaces/department';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.css',
})
export class DepartmentFormComponent {
  formBuilder = inject(FormBuilder);
  httpService = inject(HttpService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  notificationService = inject(NotificationService);

  departmentForm = this.formBuilder.group({
    departmentName: ['', [Validators.required]],
  });

  departmentID!: number;
  isEdit = false;
  ngOnInit() {
    this.departmentID = this.route.snapshot.params['departmentID'];
    if (this.departmentID) {
      this.isEdit = true;
      this.httpService.getDepartment(this.departmentID).subscribe((result) => {
        this.departmentForm.patchValue(result);
      });
    }
  }

  save() {
    const department: IDepartment = {
      departmentName: this.departmentForm.value.departmentName!,
    };

    if (this.isEdit) {
      this.httpService
        .updateDepartment(this.departmentID, department)
        .subscribe({
          next: () => {
            this.notificationService.success('Department updated successfully');
            this.router.navigateByUrl('/department-list');
          },
          error: () => {
            this.notificationService.error('Failed to update department');
          },
        });
    } else {
      this.httpService.createDepartment(department).subscribe({
        next: () => {
          this.notificationService.success('Department created successfully');
          this.router.navigateByUrl('/department-list');
        },
        error: () => {
          this.notificationService.error('Failed to create department');
        },
      });
    }
  }
}
