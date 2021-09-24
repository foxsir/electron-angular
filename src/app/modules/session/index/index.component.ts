import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import appConfigInterface from "@app/interfaces/app-config.interface";
import {WindowService} from "@services/window/window.service";
import {DatabaseService} from "@services/database/database.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  registerType: number = 0;
  selectedTab: number = 0;

  public appConfig: appConfigInterface;

  constructor(
    public router: Router,
    public restService: RestService,
    public windowService: WindowService,
  ) {
    this.getAppConfig();
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
      const url = ['http://', this.appConfig.privacyPolicyUrl].join("");
      this.windowService.openUrl(url);
    }
  }

}
