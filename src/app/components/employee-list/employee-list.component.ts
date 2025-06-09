import { Component, inject } from '@angular/core';
import { IEmployee } from '../../interfaces/employee';
import { HttpService } from '../../service/http.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../../service/notification.service';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ClientSideRowModelModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { FormsModule } from '@angular/forms';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterLink,
    MatInputModule,
    AgGridModule,
    FormsModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  employeeList: IEmployee[] = [];
  httpService = inject(HttpService);
  router = inject(Router);
  notificationService = inject(NotificationService);
  modules = [ClientSideRowModelModule];
  selectedFile: File | null = null;
  filteredEmployees: IEmployee[] = [];
  searchTerm: any;
  pageSize: number = 10;  
  pageSizes: number[] = [5, 10, 20, 50];
  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [5,10, 25, 50];
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'age',
    'phone',
    // 'salary',
    'departmentName',
    'action',
  ];

  gridApi: any;
  gridColumnApi: any;
  ngOnInit() {
    this.getEmployeesFromServer();
  }

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', sortable: true, filter: 'agNumberColumnFilter', enableRowGroup: true },
    { field: 'name', headerName: 'Name', sortable: true, filter: 'agTextColumnFilter', enableRowGroup: true },
    { field: 'email', headerName: 'Email', sortable: true, filter: 'agTextColumnFilter', enableRowGroup: true },
    { field: 'age', headerName: 'Age', sortable: true, filter: 'agNumberColumnFilter', enableRowGroup: true },
    { field: 'phone', headerName: 'Phone', sortable: true, filter: 'agTextColumnFilter', enableRowGroup: true },
    {
      field: 'departmentName',
      headerName: 'Department',
      sortable: true,
      filter: 'agTextColumnFilter',
      enableRowGroup: true,
      rowGroup: true,
      hide: false,
    },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Delete</button>
          <button class="btn-qr-code">QR Code</button>
        `;
      },
      cellRendererParams: {
        onClick: this.onActionClicked.bind(this),
      },
      suppressHeaderMenuButton: true,
      sortable: false,
      filter: false,
      suppressColumnsToolPanel: true,
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    filter: true, 
    sortable: true,
    enableRowGroup: true, 
  };
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.paginationSetPageSize(this.pageSize); 
    this.gridApi.setRowData(this.employeeList);
  }
  onActionClicked(event: any) {
    const target = event.event.target;
    const id = event.data.id;

    if (target.classList.contains('btn-edit')) {
      this.edit(id);
    } else if (target.classList.contains('btn-delete')) {
      this.delete(id);
    } else if (target.classList.contains('btn-qr-code')) {
      this.generateQRCode(event.data);
    }
  }
  onQuickFilterChanged(event: Event) {
    // if (!this.isBrowser) return;
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.gridApi.setQuickFilter(inputElement.value);
    // Update filteredEmployees for export
    this.gridApi.forEachNodeAfterFilter((node: any) => {
      this.filteredEmployees = this.filteredEmployees.concat(node.data);
    });
  }

  onPageSizeChanged(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = Number(selectElement.value);
    this.gridApi.paginationSetPageSize(this.pageSize);
  }

  generateQRCode(employee: IEmployee) {
    this.httpService.generateEmployeeQRCode(employee.id ?? 0).subscribe({
      next: (response: Blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(response);
        
        // Create a dialog or modal to display the QR code
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.left = '520px';
        modal.style.top = '220px';
        modal.style.width = '200px';
        modal.style.height = '100px';
        // modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        const content = document.createElement('div');
        content.style.backgroundColor = 'white';
        content.style.padding = '20px';
        content.style.borderRadius = '5px';
        content.style.textAlign = 'center';
        
        const title = document.createElement('h3');
        title.textContent = `QR Code for ${employee.name}`;
        
        const image = document.createElement('img');
        image.src = url;
        image.style.display = 'block';
        image.style.margin = '20px auto';
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.padding = '8px 16px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
          document.body.removeChild(modal);
          window.URL.revokeObjectURL(url);
        };
        
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.style.padding = '8px 16px';
        downloadButton.style.marginRight = '10px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.onclick = () => {
          const a = document.createElement('a');
          a.href = url;
          a.download = `employee-${employee.id}-qrcode.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
        
        content.appendChild(title);
        content.appendChild(image);
        content.appendChild(downloadButton);
        content.appendChild(closeButton);
        modal.appendChild(content);
        document.body.appendChild(modal);
      },
      error: () => {
        this.notificationService.error('Failed to generate QR code');
      }
    });
  }

  getEmployeesFromServer() {
    this.httpService.getAllEmployees().subscribe((result) => {
      this.employeeList = result;
      this.filteredEmployees = result;
      this.gridApi?.setRowData(result);
    });
  }

  filterEmployees(event: any) {
    this.searchTerm = event.target.value;
    const term = this.searchTerm.toLowerCase();
    if (term) {
      this.filteredEmployees = this.employeeList.filter((employee) =>
        employee.name.toLowerCase().includes(term)
      );
    } else {
      this.filteredEmployees = this.employeeList;
    }
  }

  edit(id: number) {
    this.router.navigateByUrl('/employee/' + id);
  }

  delete(id: number) {
    this.httpService.deleteEmployee(id).subscribe({
      next: () => {
        this.notificationService.success('Employee deleted successfully');
        this.getEmployeesFromServer();
      },
      error: () => {
        this.notificationService.error('Failed to delete employee');
      },
    });
  }

  exportToExcel() {
    this.httpService
      .exportEmployees(this.filteredEmployees)
      .subscribe((response: Blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(response);
        a.href = objectUrl;
        a.download = 'employees.xlsx';
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile) {
      this.httpService.importEmployees(this.selectedFile).subscribe({
        next: (response: string) => {
          this.notificationService.success('File uploaded successfully');
          this.getEmployeesFromServer();
        },
        error: (error: any) => {
          this.notificationService.error('File upload failed');
          console.error('File upload failed', error);
        },
      });
    } else {
      this.notificationService.warning('No file selected');
      console.warn('No file selected.');
    }
  }
}
