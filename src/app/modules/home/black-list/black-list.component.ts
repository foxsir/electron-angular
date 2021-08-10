import { Component, OnInit } from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import HttpPresponseModel from "@app/models/http-response.model";

@Component({
  selector: 'app-black-list',
  templateUrl: './black-list.component.html',
  styleUrls: ['./black-list.component.scss']
})
export class BlackListComponent implements OnInit {

  constructor(
    private restService: RestService
  ) {
    this.restService.getMyBlackList().subscribe((res: HttpPresponseModel) => {
      console.dir(res.data === null);
      console.dir(res);
    });
  }

  ngOnInit(): void {
  }

}
