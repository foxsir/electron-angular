import {Component, OnInit} from '@angular/core';
import {CacheService} from "@services/cache/cache.service";
import {UserModel} from "@app/models/user.model";
import {FileService} from "@services/file/file.service";
import DirectoryType from "@services/file/config/DirectoryType";
import {MatDialogRef} from "@angular/material/dialog";
import {QrcodeComponent} from "ngx-qrcode2";
import {ElementService} from "@services/element/element.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import CommonTools from "@app/common/common.tools";

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {
  public myInfo: UserModel;
  public avatar: string;

  constructor(
    public dialogRef: MatDialogRef<QrCodeComponent>,
    private cacheService: CacheService,
    private fileService: FileService,
    private elementService: ElementService,
    private snackBarService: SnackBarService
  ) {
  }

    ngOnInit(): void {
        this.cacheService.getMyInfo().then((data) => {
            this.myInfo = data;
            //this.avatar = this.fileService.getFileUrl([DirectoryType.OSS_PORTRAIT, data.userAvatarFileName].join("/"));
            this.avatar = data.userAvatarFileName;
            console.log('头像：', this.avatar);
        });
    }

  copy(qrcode: QrcodeComponent) {
    this.elementService.copyImageToClipboard(qrcode.qrcElement.nativeElement.firstChild);
    this.snackBarService.openMessage('已经复制到剪切板');
  }

  download(qrcode: QrcodeComponent) {
    CommonTools.downloadLink(qrcode.qrcElement.nativeElement.firstChild.src, "qrcode.png");
  }

}
