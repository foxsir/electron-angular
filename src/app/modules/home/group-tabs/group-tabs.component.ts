import {AfterContentChecked, Component, Input, OnInit, ElementRef, Renderer2, ViewChild} from '@angular/core';

@Component({
    selector: 'app-group-tabs',
    templateUrl: './group-tabs.component.html',
    styleUrls: ['./group-tabs.component.scss']
})
export class GroupTabsComponent implements OnInit {
    @Input() tabLink: string;
    @ViewChild("webviewmain") webviewmain: ElementRef;

    constructor(private renderer: Renderer2) { }

    ngOnInit(): void {
        
    }

    ngAfterViewInit() {
        
    }

    openLink(url) {
        this.renderer.setAttribute(this.webviewmain.nativeElement, 'src', 'https://' + url);
        console.log('群页签设置属性：', this.tabLink, url);
    }

    newwindow(event) {
        //console.log('event: ', event);
        //this.tabLink = event.url.replace('http://', '').replace('https://', '');
        //event.preventDefault();

        console.log('event: ', event);
        let url = event.url.replace('http://', '').replace('https://', '');
        this.renderer.setAttribute(this.webviewmain.nativeElement, 'src', 'https://' + url);
        event.preventDefault();
    }

}
