import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { DepartmentFormComponent } from './components/department-form/department-form.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: "",
        // component:HomePageComponent
        redirectTo: '/sign-in',
        pathMatch: 'full'
    },
    {
        path: "employee-list",
        component: EmployeeListComponent,
        canActivate: [authGuard]
    },
    {
        path: "create-employee",
        component: EmployeeFormComponent,
        canActivate: [authGuard]
    },
    {
        path: "employee/:id",
        component: EmployeeFormComponent,
        canActivate: [authGuard]
    },
    {
        path: "department-list",
        component: DepartmentListComponent,
        canActivate: [authGuard]
    },
    {
        path: "create-department",
        component: DepartmentFormComponent,
        canActivate: [authGuard]
    },
    {
        path: "department/:departmentID",
        component: DepartmentFormComponent,
        canActivate: [authGuard]
    },
    {
        path: "sign-in",
        component:SignInComponent
    },
    {
        path: "home-page",
        component: HomePageComponent,
        canActivate: [authGuard]
    },
];
