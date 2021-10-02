import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-group-tabs',
  templateUrl: './group-tabs.component.html',
  styleUrls: ['./group-tabs.component.scss']
})
export class GroupTabsComponent implements OnInit {
  @Input() tabLink: string;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
