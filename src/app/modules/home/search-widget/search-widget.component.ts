import { Component, OnInit } from '@angular/core';

import editIcon from "@app/assets/icons/edit.svg";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.scss']
})
export class SearchWidgetComponent implements OnInit {

  public editIcon = this.dom.bypassSecurityTrustResourceUrl(editIcon);

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

}
