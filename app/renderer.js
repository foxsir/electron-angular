const AgoraRtcEngine = require('agora-electron-sdk').default


const os = require('os')
const path = require('path')

// 填入你的 App ID
const APPID = "7422abc69a69429681bac6f1e48208fc"
// 填入你的 Token
const token = "0067422abc69a69429681bac6f1e48208fcIADY9BcfPa3dOLNlJXhKDlBHmEvUwD/zy9dLgWZAzkYAFwx+f9gAAAAAEADn8NlKlxUrYQEAAQCVFSth"


const sdkLogPath = path.resolve(os.homedir(), "./test.log")

let rtcEngine = new AgoraRtcEngine()
// 初始化 AgoraRtcEngine 实例
rtcEngine.initialize(APPID)

rtcEngine.on('error', (err, msg) => {
    console.log("Error!")
})

// 视频模块默认开启，需要调用 disableVideo 关闭视频模块，才能开启纯语音模式
rtcEngine.disableVideo()

rtcEngine.setLogFile(sdkLogPath)


// 填入你的频道名。填入的频道名必须与生成临时 Token 时填入的频道名一致。
// 加入频道
//rtcEngine.joinChannel(token, "test", null, 123456);

window.test_code = "1233";
window.test_function = function (msg) {
    console.log('preload: ', msg);
};

window.joinChannelEx = function () {
    rtcEngine.joinChannel(token, "test", null, 123456);
};