import { Injectable } from '@angular/core';

import {Howl, Howler} from 'howler';


@Injectable({
  providedIn: 'root'
})
export class SoundService {

  private callPlayAction: Howl;
  private friendsPassPlayAction: Howl;
  private messagePlayAction: Howl;

  constructor() { }

  /**
   * 语音通话声音 30秒结束
   */
  callPlay() {
    return new Promise((resolve, reject) => {
      if(this.callPlayAction) {
        this.callPlayAction.stop();
      }
      this.callPlayAction = new Howl({
        src: ['assets/sounds/call.mp3'],
        loop: false,
        volume: 1,
        onend: function() {
          resolve(true);
        }
      });
      this.callPlayAction.play();
    });
  }

  /**
   * 取消通话声音，挂断和拒接时使用
   */
  public cancelCallPlay() {
    if(this.callPlayAction) {
      this.callPlayAction.stop();
    }
  }

  /**
   * 好友请求通过声音
   */
  friendsPassPlay() {
    return new Promise((resolve, reject) => {
      if(this.friendsPassPlayAction) {
        this.friendsPassPlayAction.stop();
      }
      this.friendsPassPlayAction = new Howl({
        src: ['assets/sounds/friends-pass.wav'],
        loop: false,
        volume: 1,
        onend: function() {
          resolve(true);
        }
      });
      this.friendsPassPlayAction.play();
    });
  }

  /**
   * 取消好友请求通过声音
   */
  public cancelFriendsPassPlay() {
    if(this.friendsPassPlayAction) {
      this.friendsPassPlayAction.stop();
    }
  }

  /**
   * 新消息提示音
   */
  messagePlay(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(this.messagePlayAction) {
        this.messagePlayAction.stop();
      }
      this.messagePlayAction = new Howl({
        src: ['assets/sounds/message.mp3'],
        loop: false,
        volume: 1,
        onend: function() {
          resolve(true);
        }
      });
      this.messagePlayAction.play();
    });
  }

  /**
   * 取消新消息提示音
   */
  public cancelMessagePlay() {
    if(this.friendsPassPlayAction) {
      this.friendsPassPlayAction.stop();
    }
  }

}
