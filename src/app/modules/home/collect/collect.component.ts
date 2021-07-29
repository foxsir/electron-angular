import { Component, OnInit } from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {HttpResponse} from "@angular/common/http";
import {HttpService} from "@services/http/http.service";

@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.scss']
})
export class CollectComponent implements OnInit {
  collectList: any[];

  constructor(
    private restService: RestService,
    private localUserService: LocalUserService,
    private http: HttpService,
  ) {
    this.restService.getMyCollectList().subscribe(res => {
      if (res.success) {
        this.collectList = JSON.parse(res.returnValue);
      }
    });
  }

  ngOnInit(): void {
  }

}
