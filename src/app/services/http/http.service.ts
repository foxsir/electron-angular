import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {throwError} from 'rxjs';
import {APP_CONFIG} from '@environments/environment';
import {SnackBarService} from '@services/snack-bar/snack-bar.service';
import RBChatUtils from "@app/libs/rbchat-utils";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private host = APP_CONFIG.api;
  private localAuthedUserInfo = RBChatUtils.getAuthedLocalUserInfoFromCookie();
  private tokenPrefix = "Bearer";

  constructor(
    private http: HttpClient,
    private snackBar: SnackBarService,
  ) {
  }

  private handleError(res: HttpErrorResponse) {
    if (res.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', res.error.message);
    } else {
      if (res.status === 0) {
        this.snackBar.openSnackBar("数据请求错误", 'mat-warn');
      }
      if (res.error.errors && res.error.errors.length) {
        for (const field of res.error.errors) {
          if (field) {
            this.snackBar.openSnackBar(field.defaultMessage, 'mat-warn');
            return throwError(field.defaultMessage);
          }
        }
      }
      // 表单错误
      if (res.error.data && res.error.data.fieldErrors) {
        for (const field in res.error.data.fieldErrors) {
          if (res.error.data.fieldErrors.hasOwnProperty(field)) {
            this.snackBar.openSnackBar(res.error.data.fieldErrors[field], 'mat-warn');
            return throwError(res.error.data.fieldErrors[field]);
          }
        }
      }
      // 普通错误
      if (res.error.message) {
        this.snackBar.openSnackBar(res.error.message, 'mat-warn');
        return throwError(res.error.message);
      }
    }
    // Return an observable with a user-facing error message.
  }

  /**
   * 以json形式提交数据
   * @param url
   * @param body
   */
  post(url: string, body: any) {
    let request;
    if (url.charAt(0) === "/") {
      request = url;
      // request = [this.host, url].join("");
    } else {
      // request = [this.host, url].join("/");
      request = url;
    }

    let Authorization = {};
    if(this.localAuthedUserInfo && this.localAuthedUserInfo.token) {
      Authorization = {
        Authorization: [this.tokenPrefix, this.localAuthedUserInfo?.token].join(" "),
      };
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...Authorization
      })
    };
    return this.http.post(request, body, httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  get(url: string, body: any = {}) {
    let request;
    if (url.charAt(0) === "/") {
      request = url;
      // request = [this.host, url].join("");
    } else {
      // request = [this.host, url].join("/");
      request = url;
    }

    const params = [];
    for (const d in body) {
      if (body.hasOwnProperty(d)) {
        params.push([d, body[d]].join('='));
      }
    }

    let Authorization = {};
    if(this.localAuthedUserInfo && this.localAuthedUserInfo.token) {
      Authorization = {
        Authorization: [this.tokenPrefix, this.localAuthedUserInfo?.token].join(" "),
      };
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        ...Authorization
      })
    };
    return this.http.get(request + "?" + params.join("&"), httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * 以表单形式提交POST数据
   * @param url
   * @param body
   */
  postForm(url: string, body: any = {}) {
    let request;
    if (url.charAt(0) === "/") {
      request = url;
      // request = [this.host, url].join("");
    } else {
      // request = [this.host, url].join("/");
      request = url;
    }

    const params = [];
    for (const d in body) {
      if (body.hasOwnProperty(d)) {
        params.push([d, encodeURIComponent(body[d])].join('='));
      }
    }

    let Authorization = {};
    if(this.localAuthedUserInfo && this.localAuthedUserInfo.token) {
      Authorization = {
        Authorization: [this.tokenPrefix, this.localAuthedUserInfo?.token].join(" "),
      };
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        ...Authorization
      })
    };
    return this.http.post(request, params.join("&"), httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * 获取文件内容长度
   * @param url
   */
  getContentLength(url: string) {
    let Authorization = {};
    if(this.localAuthedUserInfo && this.localAuthedUserInfo.token) {
      Authorization = {
        Authorization: [this.tokenPrefix, this.localAuthedUserInfo?.token].join(" "),
      };
    }
    return new Promise((resolve, reject) => {
      fetch(url, {
        headers: {
          ...Authorization
        }
      }).then(response => {
        resolve(response.headers.get("content-length"));
      });
    });
  }

}
