import { Component, OnInit } from '@angular/core';
import {WindowService} from "@services/window/window.service";
import {DomSanitizer} from "@angular/platform-browser";

import closeIcon from '@app/assets/icons/close.svg';
import closeActiveIcon from '@app/assets/icons/close-active.svg';
import minIcon from '@app/assets/icons/min.svg';
import minActiveIcon from '@app/assets/icons/min-active.svg';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon)
  public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon)
  public minIcon = this.dom.bypassSecurityTrustResourceUrl(minIcon)
  public minActiveIcon = this.dom.bypassSecurityTrustResourceUrl(minActiveIcon)

  constructor(
    private windowService: WindowService,
    private dom: DomSanitizer,
  ) { }

  ngOnInit(): void {
  }

  minimize() {
    this.windowService.minimizeWindow();
  }

  maximize() {
    this.windowService.maximizeWindow();
  }

  close() {
    this.windowService.closeWindow();
  }


}
