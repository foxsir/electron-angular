import { Component, OnInit } from '@angular/core';

import editIcon from "@app/assets/icons/edit.svg";
import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.scss']
})
export class SearchWidgetComponent implements OnInit {
  public editIcon = this.dom.bypassSecurityTrustResourceUrl(editIcon);
  public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
  public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
  public showResource: boolean = false;
  public search: string;

  constructor(
    private dom: DomSanitizer,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  createGroup() {
    return this.router.navigate(['/home/message/create-group']);
  }

  searchFriend() {
    return this.router.navigate(['/home/message/search-friend']);
  }

  searchContent() {
    if(!this.showResource) {
      this.showResource = !this.showResource;
    }
  }

  cancelSearch() {
    this.search = null;
    this.showResource = false;
  }

}
