const ipcRenderer = require('electron').ipcRenderer;
window.ipcRenderer = ipcRenderer;

window.startScreenShot = function () {
    window.ipcRenderer.send("start-screen-capture", "new message");
};

const AgoraRtcEngine = require('agora-electron-sdk').default


const os = require('os')
const path = require('path')

// 填入你的 App ID
const APPID = "4e62d9d9541242c69f1e00f2cbb1bc3f"
// 填入你的 Token
//const token = ""


const sdkLogPath = path.resolve(os.homedir(), "./test.log")

let rtcEngine = new AgoraRtcEngine()
// 初始化 AgoraRtcEngine 实例
rtcEngine.initialize(APPID)

rtcEngine.on('error', (err, msg) => {
    console.log("rtcEngine Error!", err, msg)
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

window.joinChannelEx = function (parms_str) {
    var parms = JSON.parse(parms_str);
    console.log('joinChannelEx: ', parms);

    var channel = "";
    if (parms.islanch == true) {
        channel = parms.userid + "-" + parms.touserid
    }
    else {
        channel = parms.touserid + "-" + parms.userid
    }

    rtcEngine.joinChannel(parms.token, channel, null, 0);
};

window.leaveChannel = function (parms_str) {
    var result = rtcEngine.leaveChannel();
    console.log('Leave Channel Result: ', result);
};