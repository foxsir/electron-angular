import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'empty-data',
  templateUrl: './empty-data.component.html',
  styleUrls: ['./empty-data.component.scss']
})
export class EmptyDataComponent implements OnInit {
  @Input() dataCount: number = 0;
  @Input() text = "暂时没有任何内容";
  @Input() showIcon: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
