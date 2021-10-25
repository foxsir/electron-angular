import {Component, Injectable, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import appConfigInterface from "@app/interfaces/app-config.interface";
import {WindowService} from "@services/window/window.service";
import {DatabaseService} from "@services/database/database.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {MessageDistributeService} from "@services/message-distribute/message-distribute.service";
import {ProtocalModel} from "@app/models/protocal.model";
import {GlobalCache} from "@app/config/global-cache";
import SubscribeManage from "@app/common/subscribe-manage";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  registerType: number = 0;
  selectedTab: number = 0;
  loginProtocol: boolean = true;

  constructor(
    public router: Router,
    public restService: RestService,
    public windowService: WindowService,
    private snackBarService: SnackBarService,
    private messageDistributeService: MessageDistributeService,
  ) {
    this.getAppConfig();
    this.subscribeUpdateAppConfig();
  }

  ngOnInit(): void {
    if(this.router.url === '/session/register') {
      this.selectedTab = 1;
    }
    this.loginProtocol = GlobalCache.getAll().loginProtocol;
  }

  /**
   * 切换tabs时检查注册类型
   * @param index
   */
  selectedChange(index: number) {
    this.selectedTab = index;
    if(index === 0) {
      return this.router.navigate(["/session/login"]);
    } else {
      return this.router.navigate(["/session/register"]);
    }
  }

  getAppConfig() {
    this.restService.getAppConfig().subscribe((res: NewHttpResponseInterface<appConfigInterface>) => {
      if(res.status === 200) {
        GlobalCache.setAppConfig(res.data);
      }
    });
  }

  openPrivacyPolicyUrl() {
    if(GlobalCache.getAll().appConfig) {
      this.windowService.openUrl(GlobalCache.getAll().appConfig.privacyPolicyUrl);
    }
  }

  selectLoginProtocol(event) {
    event.preventDefault();
    GlobalCache.setLoginProtocol(!GlobalCache.loginProtocol);
    this.loginProtocol = GlobalCache.loginProtocol;
  }

  /**
   * 系统配置发送了改变
   */
  subscribeUpdateAppConfig() {
    SubscribeManage.run(this.messageDistributeService.UPDATE_APP_CONFIG$, (res: ProtocalModel) => {
      console.log("收到更新App配置的指令111");
      this.getAppConfig();
    });
  }

}
