import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import {CacheService} from "@services/cache/cache.service";
import BlackListModel from "@app/models/black-list.model";
import {DialogService} from "@services/dialog/dialog.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import SubscribeManage from "@app/common/subscribe-manage";

@Component({
  selector: 'app-black-list',
  templateUrl: './black-list.component.html',
  styleUrls: ['./black-list.component.scss']
})
export class BlackListComponent implements OnInit {

  blacklist: BlackListModel[] = [];

  constructor(
    private restService: RestService,
    private cacheService: CacheService,
    private dialogService: DialogService,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.cacheService.getBlackList().then(cache => {
      if(cache) {
        cache.forEach(item => {
          this.blacklist.push(item);
        });
      }
    });
    SubscribeManage.run(this.cacheService.cacheUpdate$, (data) => {
      if(data.blackListMap) {
        this.zone.run(() => {
          this.blacklist = [];
          data.blackListMap.forEach(item => {
            this.blacklist.push(item);
          });
          this.changeDetectorRef.detectChanges();
        })
      }
    });
  }

  ngOnInit(): void {
  }

  remove(item) {
    this.dialogService.confirm({text: ['将用户：', item.nickname, '移出黑名单'].join("")}).then(ok => {
      if(ok) {
        const data = {
          blackUserId: item.userUid,
          type: 0,
        };
        this.restService.blackUser(data).subscribe();
      }
    });
  }

}
