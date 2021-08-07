import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  registerType: number = 0;
  selectedTab: number = 0;

  constructor(
    public router: Router,
  ) { }

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

}
