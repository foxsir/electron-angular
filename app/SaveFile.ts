const { dialog } = require('electron')
import {ipcMain} from 'electron';
const fs = require('fs')
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const fetch = require('node-fetch');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

interface FormatParams {
  url: string;
  uuid: string;
  path: string;
}

export default class SaveFile {
  async init() {
    this.convertFormat();
  }

  convertFormat() {
    ipcMain.on('amr2mp3', async (event, msg: FormatParams) => {
      const filepath = [__dirname, 'temp', msg.uuid + ".amr"].join('/');
      const output = [__dirname, 'temp', msg.uuid + ".mp3"].join('/');
      this.downloadFile(msg.url, filepath).then(() => {
        const command = ffmpeg(filepath);
        command
          .output(output)
          .on('start', function(commandLine) {
            // console.log('Spawned Ffmpeg with command: ' + commandLine);
          }).on('end', function() {
          const contents = fs.readFileSync(output, {encoding: 'base64'});
          event.sender.send('amr2mp3-reply', {status: 200, data: contents, uuid: msg.uuid});
          fs.unlinkSync(filepath);
          fs.unlinkSync(output);
        }).run();
      })
    });
  }

  downloadFile = (async (url, path) => {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
  });
}
