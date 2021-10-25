import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';

import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MatDrawer} from "@angular/material/sidenav";
import {LocalUserService} from "@services/local-user/local-user.service";
import {AvatarService} from "@services/avatar/avatar.service";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
const { ipcRenderer } = window.require("electron");

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
import RBChatUtils from "@app/libs/rbchat-utils";
import {QrCodeComponent} from "@modules/user-dialogs/qr-code/qr-code.component";
import {PrivacySettingComponent} from "@modules/user-dialogs/privacy-setting/privacy-setting.component";
import {MySignatureComponent} from "@modules/user-dialogs/my-signature/my-signature.component";
import {UpdatePasswordComponent} from "@modules/user-dialogs/update-password/update-password.component";
import {RestService} from "@services/rest/rest.service";
import {CacheService} from "@services/cache/cache.service";
import {UploadedFile} from "@app/factorys/upload/upload-file/upload-file.component";
import {UserModel} from "@app/models/user.model";
import {DatabaseService} from "@services/database/database.service";
import {ImService} from "@services/im/im.service";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {ProtocalModel} from "@app/models/protocal.model";
import {MessageDistributeService} from "@services/message-distribute/message-distribute.service";
import SubscribeManage from "@app/common/subscribe-manage";
// import icons end

@Component({
  selector: 'app-account-panel',
  templateUrl: './account-panel.component.html',
  styleUrls: ['./account-panel.component.scss']
})
export class AccountPanelComponent implements OnInit {
  @Input() accountDrawer: MatDrawer;
  @ViewChild('privacySettingDrawer') privacySettingDrawer: MatDrawer;


  private dialogConfig = {
    width: '314px'
  };

  public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
  public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);

  myAvatar: SafeResourceUrl = null;

  public localUserInfo: LocalUserinfoModel;

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
      action: this.editSignature.bind(this)
    },
    {
      label: "修改密码",
      icon: this.dom.bypassSecurityTrustResourceUrl(lockIcon),
      iconActive: this.dom.bypassSecurityTrustResourceUrl(lockActiveIcon),
      action: this.updatePassword.bind(this)
    },
    {
      label: "清空缓存",
      icon: this.dom.bypassSecurityTrustResourceUrl(lockIcon),
      iconActive: this.dom.bypassSecurityTrustResourceUrl(lockActiveIcon),
      action: () => {
        this.cacheService.clearAllCache();
      }
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
    private restService: RestService,
    private imService: ImService,
    private cacheService: CacheService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private messageDistributeService: MessageDistributeService,
  ) {
    this.subscribeLogOutMessage();
  }

  ngOnInit(): void {
    this.localUserInfo = this.localUserService.localUserInfo;

    // this.avatarService.getAvatar(this.localUserInfo.userId.toString()).then(url => {
    //
    // });
    this.cacheService.getMyInfo().then((data: UserModel) => {
      if(data.userAvatarFileName.length > 0) {
        this.myAvatar = this.dom.bypassSecurityTrustResourceUrl(data.userAvatarFileName);
      } else {
        this.myAvatar = this.dom.bypassSecurityTrustResourceUrl(this.avatarService.defaultLocalAvatar);
      }
    });

    //todo 保存到缓存中并做到界面数据实时更新
    this.restService.getUserBaseById(this.localUserInfo.userId.toString()).subscribe(res => {
      console.log('MySignatureComponent result: ', res);
      this.localUserInfo.whatsUp = res.data.whatSUp;
    });
  }

  qrcode() {
    return this.dialogService.openDialog(QrCodeComponent, this.dialogConfig);
  }

  privacySetting() {
    return this.privacySettingDrawer.open();
  }

  editSignature() {
    return this.dialogService.openDialog(MySignatureComponent, this.dialogConfig);
  }

  updatePassword() {
    return this.dialogService.openDialog(UpdatePasswordComponent, this.dialogConfig);
  }

  logout() {
    this.dialogService.confirm({title: '退出登录', text: "确定要退出当前账号吗？"}).then(ok => {
      if(ok) {
        this.router.navigate(['/']).then(() => {
          this.restService.loginOut().subscribe(() => {
            this.imService.disconnectSocket();
            this.windowService.restoreWindow();
            this.windowService.loginWindow();
            // 关闭数据库链接
            this.cacheService.disconnectDB();
            this.currentChattingChangeService.switchCurrentChatting(null).then();
            sessionStorage.removeItem(RBChatUtils.COOKIE_KEY_AUTHED_LOCAL_USER_INFO_ID);
            ipcRenderer.removeAllListeners();
            SubscribeManage.unsubscriptionAll();
          });
        });
      }
    });
  }

  public setAvatar(upload: UploadedFile) {
    this.restService.updateUserBaseById({
      userAvatarFileName: upload.url.href,
    }).subscribe(res => {
      this.cacheService.cacheMyInfo().then();
    });
  }

  /**
   * 订阅删除单聊消息的通知
   * @private
   */
  private subscribeLogOutMessage() {
    SubscribeManage.run(this.messageDistributeService.LOG_OUTSourceSource$, (res: ProtocalModel) => {
      this.router.navigate(['/']).then(() => {
        this.restService.loginOut().subscribe(() => {
          this.imService.disconnectSocket();
          this.windowService.restoreWindow();
          this.windowService.loginWindow();
          // 关闭数据库链接
          this.cacheService.disconnectDB();
          this.currentChattingChangeService.switchCurrentChatting(null).then();
          localStorage.removeItem(RBChatUtils.COOKIE_KEY_AUTHED_LOCAL_USER_INFO_ID);
        });
      });
    });
  }

}
