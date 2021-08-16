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
    public show_modal = false;
    public current_model: any;

    constructor(private restService: RestService) {
        this.restService.getMyBlackList().subscribe(res => {
            this.blacklist = res.data;
        });
    }

    ngOnInit(): void {

    }

    remove(item) {
        this.show_modal = true;
        this.current_model = item;
    }

    handleCancel() {
        this.show_modal = false;
    }

    handleOk() {
        var data = {
            blackUserId: this.current_model.userUid,            
        };
        data['type'] = 0;

        this.restService.blackUser(data).subscribe(res => {
            this.show_modal = false;

            this.restService.getMyBlackList().subscribe(res => {
                this.blacklist = res.data;
            });
        });
    }

}
