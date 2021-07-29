import { Component, OnInit } from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import LocalUserInfo from "@app/models/LocalUserInfo";
import {LocalUserService} from "@services/local-user/local-user.service";
import HttpResponse from "@app/models/HttpResponse";
import ChattingGroup from "@app/models/ChattingGroup";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  private localUserInfo: LocalUserInfo = this.localUserService.localUserInfo;
  public chattingGroup: ChattingGroup[];

  constructor(
    private restService: RestService,
    private localUserService: LocalUserService,
  ) {
    this.restService.submitGetGroupsListFromServer(this.localUserInfo.user_uid).subscribe((res: HttpResponse) => {
      if (res.success) {
        this.chattingGroup = JSON.parse(res.returnValue);
      }
    });
  }

  ngOnInit(): void {

  }

}
