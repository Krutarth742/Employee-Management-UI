import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpService } from '../../service/http.service';
import { IEmployee } from '../../interfaces/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { IDepartment } from '../../interfaces/department';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NotificationService } from '../../service/notification.service';
import { AgGridModule } from 'ag-grid-angular';
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatOptionModule,
    MatFormFieldModule,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent {
  formBuilder = inject(FormBuilder);
  httpService = inject(HttpService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  notificationService = inject(NotificationService);

  departmentList: IDepartment[] = [];
  employeeForm = this.formBuilder.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(100)],
    ],
    phone: ['', [Validators.required, this.phoneLengthValidator()]],
    age: [18, [Validators.required, Validators.min(18), Validators.max(65)]],
    salary: [0, [Validators.required, Validators.min(0)]],
    departmentID: [0, [Validators.required]],
  });

  employeeId!: number;
  isEdit = false;
  ngOnInit() {
    this.employeeId = this.route.snapshot.params['id'];
    if (this.employeeId) {
      this.isEdit = true;
      this.httpService.getEmployee(this.employeeId).subscribe((result) => {
        this.employeeForm.patchValue(result);
      });
    }
    this.getDepartmentFromServer();
  }
  getDepartmentFromServer() {
    this.httpService.getAllDepartments().subscribe((result) => {
      this.departmentList = result;
    });
  }

  phoneLengthValidator() {
    return (control: any) => {
      const phone = control.value;
      if (!phone) return null;
      const isValid = /^\d{10}$/.test(phone);
      return isValid ? null : { phoneLength: true };
    };
  }
  save() {
    const employee: IEmployee = {
      name: this.employeeForm.value.name!,
      email: this.employeeForm.value.email!,
      password: this.employeeForm.value.password!,
      phone: this.employeeForm.value.phone!,
      age: this.employeeForm.value.age!,
      salary: this.employeeForm.value.salary!,
      departmentID: +this.employeeForm.value.departmentID!,
    };
    if (this.isEdit) {
      this.httpService.updateEmployee(this.employeeId, employee).subscribe({
        next: () => {
          this.notificationService.success('Employee updated successfully');
          this.router.navigateByUrl('/employee-list');
        },
        error: () => {
          this.notificationService.error('Failed to update employee');
        },
      });
    } else {
      this.httpService.createEmployee(employee).subscribe({
        next: () => {
          this.notificationService.success('Employee created successfully');
          this.router.navigateByUrl('/employee-list');
        },
        error: () => {
          this.notificationService.error('Failed to create employee');
        },
      });
    }
  }
}
