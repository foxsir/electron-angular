import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {throwError} from 'rxjs';
import {APP_CONFIG} from '@environments/environment';
import {SnackBarService} from '@services/snack-bar/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private host = APP_CONFIG.api;

  constructor(
    private http: HttpClient,
    private snackBar: SnackBarService
  ) {
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      if (error.status === 0) {
        this.snackBar.openSnackBar("数据请求错误", 'mat-warn');
      }
      // 表单错误
      if (error.error.failedFields) {
        for (const field in error.error.failedFields) {
          if (error.error.failedFields.hasOwnProperty(field)) {
            this.snackBar.openSnackBar(error.error.failedFields[field], 'mat-warn');
            return throwError(error.error.failedFields[field]);
          }
        }
      }
      if (error.error.errors && error.error.errors.length) {
        for (const field of error.error.errors) {
          if (field) {
            this.snackBar.openSnackBar(field.defaultMessage, 'mat-warn');
            return throwError(field.defaultMessage);
          }
        }
      }
      // 表单错误
      if (error.error.data && error.error.data.fieldErrors) {
        for (const field in error.error.data.fieldErrors) {
          if (error.error.data.fieldErrors.hasOwnProperty(field)) {
            this.snackBar.openSnackBar(error.error.data.fieldErrors[field], 'mat-warn');
            return throwError(error.error.data.fieldErrors[field]);
          }
        }
      }
      // 普通错误
      if (error.error.message) {
        this.snackBar.openSnackBar(error.error.message, 'mat-warn');
        return throwError(error.error.message);
      }
    }
    // Return an observable with a user-facing error message.
  }

  post(url: string, body: any) {
    let request;
    if (url.charAt(0) === "/") {
      request = url;
      // request = [this.host, url].join("");
    } else {
      // request = [this.host, url].join("/");
      request = url;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Authorization') || "",
      })
    };
    return this.http.post(request, body, httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

}
