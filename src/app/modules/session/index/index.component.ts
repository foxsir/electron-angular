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

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class IndexComponent implements OnInit {
  registerType: number = 0;
  selectedTab: number = 0;
  public loginProtocol : boolean = true;

  public appConfig: appConfigInterface;

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
      this.appConfig = res.data;
    });
  }

  openPrivacyPolicyUrl() {
    if(this.appConfig) {
      this.windowService.openUrl(this.appConfig.privacyPolicyUrl);
    }
  }

  selectLoginProtocol(event) {
    event.preventDefault();
    this.loginProtocol = !this.loginProtocol;
    alert(this.loginProtocol);
  }

  /**
   * 系统配置发送了改变
   */
  subscribeUpdateAppConfig() {
    this.messageDistributeService.UPDATE_APP_CONFIG$.subscribe((res: ProtocalModel) => {
      console.log("收到更新App配置的指令111");
      this.getAppConfig();
    });
  }

}
