import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IEmployee } from '../interfaces/employee';
import { Observable } from 'rxjs';
import { IDepartment } from '../interfaces/department';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  apiUrl = 'http://localhost:5235';
  http = inject(HttpClient);
  constructor() {}

  getAllEmployees() {
    return this.http.get<IEmployee[]>(this.apiUrl + '/api/Employee');
  }

  getAllDepartments() {
    return this.http.get<IDepartment[]>(this.apiUrl + '/api/Department');
  }

  exportEmployees(employees: IEmployee[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/api/Employee/export`, employees, { responseType: 'blob' });
  }

  createEmployee(employee: IEmployee) {
    return this.http.post(this.apiUrl + '/api/Employee', employee);
  }
  createDepartment(department: IDepartment) {
    return this.http.post(this.apiUrl + '/api/Department', department);
  }
  
  getEmployee(employeeId: number) {
    return this.http.get<IEmployee>(
      this.apiUrl + '/api/Employee/' + employeeId
    );
  }
  getDepartment(departmentID: number) {
    return this.http.get<IDepartment>(
      this.apiUrl + '/api/Department/' + departmentID
    );
  }
  updateEmployee(employeeId:number,employee: IEmployee) {
    return this.http.put<IEmployee>(this.apiUrl + '/api/Employee/'+ employeeId, employee);
  }
  deleteEmployee(employeeId:number) {
    return this.http.delete(this.apiUrl + '/api/Employee/'+ employeeId);
  }

  updateDepartment(departmentID:number,department: IDepartment) {
    return this.http.put<IDepartment>(this.apiUrl + '/api/Department/'+ departmentID, department);
  }
  deleteDepartment(departmentID: number) {
    return this.http.delete(this.apiUrl + '/api/Department/'+ departmentID);
  }

  importEmployees(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/api/Employee/import`, formData);
  }

  generateEmployeeQRCode(employeeId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/Employee/${employeeId}/qrcode`, {
      responseType: 'blob'
    });
  }
}
