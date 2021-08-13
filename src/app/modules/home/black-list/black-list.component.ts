import { Component, OnInit } from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import HttpPresponseModel from "@app/interfaces/http-response.interface";

@Component({
    selector: 'app-black-list',
    templateUrl: './black-list.component.html',
    styleUrls: ['./black-list.component.scss']
})
export class BlackListComponent implements OnInit {

    blacklist: any[];

    constructor(private restService: RestService) {
        this.restService.getMyBlackList().subscribe(res => {
            this.blacklist = res.data;
        });
    }

    ngOnInit(): void {
    }

}
