import {Component, ElementRef, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss']
})
export class VirtualScrollComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  private observer: IntersectionObserver;

  private subscribeScrolledChange: () => void = () => {};
  private subscribeScrolledToTop: () => void = () => {};
  private subscribeScrolledToBottom: () => void = () => {};

  offsetTop: number;
  offsetBottom: number;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => this.initialize(), 1000);
  }

  private initialize() {
    this.scrollContainer.nativeElement.onscroll = () => {
      this.subscribeScrolledChange();
      this.offsetTop = this.scrollContainer.nativeElement.scrollTop;
      this.offsetTop = this.offsetTop < 1 ? 0 : this.offsetTop;

      this.offsetBottom = Number(this.scrollContainer.nativeElement.scrollHeight
        - this.scrollContainer.nativeElement.scrollTop
        - this.scrollContainer.nativeElement.clientHeight);
      this.offsetBottom = this.offsetBottom > 0 ? this.offsetBottom : 0;

      if(this.offsetBottom === 0) {
        this.subscribeScrolledToBottom();
      }
      if(this.offsetTop === 0) {
        this.subscribeScrolledToTop();
      }
    }

    this.observeBoxes(this.scrollContainer.nativeElement);
  }

  private observeBoxes(example: any) {
    this.observer = new IntersectionObserver(this.observed, { threshold: 0 });
    const boxes = example.querySelectorAll(".virtual-scroll-item");
    for (let i = 0; i < boxes.length; ++i)
      this.observer.observe(boxes[i]);
  }

  private observed(entries: any[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting)
        entry.target.classList.remove("offscreen");
      else
        entry.target.classList.add("offscreen");
    });
  }

  @Output()
  readonly scrolledChange = (subscribe: () => void) => {
    this.subscribeScrolledChange = subscribe;
  };

  @Output()
  readonly subscribeToTop = (subscribe: () => void) => {
    this.subscribeScrolledToTop = subscribe;
  }

  @Output()
  readonly subscribeToBottom = (subscribe: () => void) => {
    this.subscribeScrolledToBottom = subscribe;
  }

  @Output()
  readonly scrollToTop = (behavior: 'smooth' | 'auto' = 'auto') => {
    this.scrollContainer.nativeElement.scrollTo({
      left: 0,
      top: 0,
      behavior: behavior
    })
  }

  @Output()
  readonly scrollToBottom = (behavior: 'smooth' | 'auto' = 'auto') => {
    this.scrollContainer.nativeElement.scrollTo({
      left: 0,
      top: this.scrollContainer.nativeElement.scrollHeight,
      behavior: behavior
    })
  }

  @Output()
  readonly scrollToItemForID = (id: string, behavior: 'smooth' | 'auto' = 'auto') => {
    const ele = this.scrollContainer.nativeElement.getElementById(id);
    if(ele) {
      ele.scrollIntoView({behavior: behavior});
    }
  }

}
