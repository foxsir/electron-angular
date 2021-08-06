import {Component, Inject, Input, OnInit} from '@angular/core';

import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MatDrawer} from "@angular/material/sidenav";
import {LocalUserService} from "@services/local-user/local-user.service";
import {AvatarService} from "@services/avatar/avatar.service";
import LocalUserInfo from "@app/models/LocalUserInfo";

// import icons
import qrIcon from "@app/assets/icons/qr.svg";
import qrActiveIcon from "@app/assets/icons/qr-active.svg";
import listIcon from "@app/assets/icons/list.svg";
import listActiveIcon from "@app/assets/icons/list-active.svg";
import pencilIcon from "@app/assets/icons/pencil.svg";
import pencilActiveIcon from "@app/assets/icons/pencil-active.svg";
import lockIcon from "@app/assets/icons/lock.svg";
import lockActiveIcon from "@app/assets/icons/lock-active.svg";
import logoutIcon from "@app/assets/icons/logout.svg";
import logoutActiveIcon from "@app/assets/icons/logout-active.svg";
import {DialogService} from "@services/dialog/dialog.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {WindowService} from "@services/window/window.service";
// import icons end

@Component({
  selector: 'app-account-panel',
  templateUrl: './account-panel.component.html',
  styleUrls: ['./account-panel.component.scss']
})
export class AccountPanelComponent implements OnInit {
  @Input() drawer: MatDrawer;

  public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
  public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);

  myAvatar: SafeResourceUrl = this.dom.bypassSecurityTrustResourceUrl(
    this.avatarService.defaultLocalAvatar
  );

  public localUserInfo: LocalUserInfo;

  public userSettingMenu = [
    {
      label: "二维码",
      icon: this.dom.bypassSecurityTrustResourceUrl(qrIcon),
      iconActive: this.dom.bypassSecurityTrustResourceUrl(qrActiveIcon),
      action: this.qrcode.bind(this)
    },
    {
      label: "隐私设置",
      icon: this.dom.bypassSecurityTrustResourceUrl(listIcon),
      iconActive: this.dom.bypassSecurityTrustResourceUrl(listActiveIcon),
      action: this.privacySetting.bind(this)
    },
    {
      label: "个性签名",
      icon: this.dom.bypassSecurityTrustResourceUrl(pencilIcon),
      iconActive: this.dom.bypassSecurityTrustResourceUrl(pencilActiveIcon),
      action: this.editSign.bind(this)
    },
    {
      label: "修改密码",
      icon: this.dom.bypassSecurityTrustResourceUrl(lockIcon),
      iconActive: this.dom.bypassSecurityTrustResourceUrl(lockActiveIcon),
      action: this.resetPassword.bind(this)
    },
    {
      label: "退出登录",
      icon: this.dom.bypassSecurityTrustResourceUrl(logoutIcon),
      iconActive: this.dom.bypassSecurityTrustResourceUrl(logoutActiveIcon),
      action: this.logout.bind(this)
    },
  ];

  constructor(
    private dom: DomSanitizer,
    private avatarService: AvatarService,
    private localUserService: LocalUserService,
    private dialogService: DialogService,
    private router: Router,
    private windowService: WindowService,
  ) {
  }

  ngOnInit(): void {
    this.localUserInfo = this.localUserService.localUserInfo;
    this.avatarService.getAvatar(this.localUserInfo.userId).then(url => {
      this.myAvatar = this.dom.bypassSecurityTrustResourceUrl(url);
    });
  }

  qrcode() {

  }

  privacySetting() {

  }

  editSign() {

  }

  resetPassword() {

  }

  logout() {
    this.router.navigate(['/']).then(() => {
      localStorage.removeItem("aluiid");
      this.windowService.loginWindow();
    });
  }

}
