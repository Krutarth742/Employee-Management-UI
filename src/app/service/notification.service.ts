import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private readonly toastr: ToastrService) {}

  success(msg: string, title = 'Success') {
    this.toastr.success(msg, title);
  }

  error(msg: string, title = 'Error') {
    this.toastr.error(msg, title);
  }

  info(msg: string, title = 'Info') {
    this.toastr.info(msg, title);
  }

  warning(msg: string, title = 'Warning') {
    this.toastr.warning(msg, title);
  }
}
