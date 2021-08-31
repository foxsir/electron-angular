import { Component, OnInit } from '@angular/core';
import { CacheService } from "@services/cache/cache.service";
import { RestService } from "@services/rest/rest.service";
import FriendModel from "@app/models/friend.model";

class FriendData {
    public char: string;
    public list: FriendModel[] = [];
}

@Component({
    selector: 'app-my-friends',
    templateUrl: './my-friends.component.html',
    styleUrls: ['./my-friends.component.scss']
})
export class MyFriendsComponent implements OnInit {

    public friendList: FriendModel[] = [];
    public frienddata: FriendData[] = [];

    public numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    public letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    constructor(
        private cacheService: CacheService,
        private restService: RestService,
    ) { }

    ngOnInit(): void {
        // 好友使用缓存中的数据
        // 我的群组组件有点击切换到聊天的示例 group.component.ts

        this.cacheService.getCacheFriends().then(data => {
            if (data) {
                this.friendList = Object.values(data);
                console.log('我的好友 data：', data);
                console.log('我的好友 list：', this.friendList);

                for (let item of this.friendList) {
                    var first_char = item.nickname[0].toString().toUpperCase();                    

                    //if (this.numbers.indexOf(first_char) != -1) {

                    //}
                    //else if (this.letters.indexOf(first_char) != -1) {

                    //}
                    //else {

                    //}

                    var results = this.frienddata.filter(t => t.char == first_char);
                    if (results.length == 0) {
                        var model = new FriendData();
                        model.char = first_char;
                        model.list.push(item);
                        this.frienddata.push(model);
                    }
                    else {
                        results[0].list.push(item);
                    }
                }

                this.frienddata = this.frienddata.sort((n1, n2) => {
                    var flag = 0;
                    if (n1.char > n2.char) {
                        flag = 1;
                    }
                    else if (n1.char < n2.char) {
                        flag = -1;
                    }
                    return flag;
                });

                console.log('我的好友 list 格式化之后：', this.frienddata);
            }
        });
    }

}
