import {Component, Input, OnInit} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {DomSanitizer} from "@angular/platform-browser";

import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import backspaceIcon from "@app/assets/icons/backspace.svg";
import backspaceActiveIcon from "@app/assets/icons/backspace-active.svg";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {MatDialogRef} from "@angular/material/dialog";
import {CacheService} from "@services/cache/cache.service";
import {LocalUserService} from "@services/local-user/local-user.service";

@Component({
  selector: 'app-my-signature',
  templateUrl: './my-signature.component.html',
  styleUrls: ['./my-signature.component.scss']
})

export class MySignatureComponent implements OnInit {
  @Input() drawer: MatDrawer;

  public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
  public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
  public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
  public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);

  public whatSUp = "";

  constructor(
    private dialogRef: MatDialogRef<MySignatureComponent, boolean>,
    private dom: DomSanitizer,
    private restService: RestService,
    private localUserService: LocalUserService,
    private snackBarService: SnackBarService,
    private cacheService: CacheService,
  ) {
    this.cacheService.getMyInfo().then(info => {
      this.whatSUp = info.whatSUp;
    });
  }

  ngOnInit(): void {

  }

  save() {
    const data = {
      whatSUp: this.whatSUp
    };

    this.restService.updateUserBaseById(data).subscribe((res: NewHttpResponseInterface<any>) => {
      if (res.status === 200) {
        this.snackBarService.openMessage('修改完成');
        this.dialogRef.close(true);
        this.cacheService.cacheMyInfo().then(info => {
          this.localUserService.update(info);
        });
      }
    });
  }
}

