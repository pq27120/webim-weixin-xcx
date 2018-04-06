require('./utils/strophe.js')
var JMessage = require('./utils/jmessage.min.js')
// 去掉此行的引入，因为会报错，找不到crypto变量
// var uuid = require('./utils/uuid.js')
var uuid = require('./utils/uuidtool.js')
// var vvvv = require('./utils/node-uuid/v4.js');
var md = require('./utils/md5.js')
var WebIM = require('./utils/WebIM.js').default

//app.js   
App({
    getRoomPage: function () {
        return this.getPage("pages/chatroom/chatroom")
    },
    getPage: function (pageName) {
        var pages = getCurrentPages()
        return pages.find(function (page) {
            return page.__route__ == pageName
        })
    },
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var that = this
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        var jim = new JMessage({
            debug : true
        });

        var appkey = "5da10dc227e8d4125971ed9b";
        // var id = uuidv1.replace(new RegExp("-", "g"), "");
        // console.log('id=' + id);
        var id = uuid.uuid().replace(new RegExp("-", "g"), "");
        // console.log('uuid1=' + uuid1)
        // 写死此id
        // var id = '4fe2fb8030f011e8a01385a16ca66749';
        var timestamp = (new Date()).valueOf();
        var secret = md.md5("appkey=" + appkey + "&timestamp=" + timestamp  + "&random_str=" + id  + "&key=bd2f7dea8d90d09ad56b6229");
        jim.init({
          "appkey": "5da10dc227e8d4125971ed9b",
          "random_str": id,
          "signature": secret,
          "timestamp": timestamp
        }).onSuccess(function (data) {
          //TODO
          that.globalData.jim = jim;
        }).onFail(function (data) {
          //TODO
        });  

        WebIM.conn.listen({
            onOpened: function (message) {
                WebIM.conn.setPresence()
            },
            onPresence: function (message) {
                switch(message.type){
                    case "unsubscribe":
                        pages[0].moveFriend(message);
                        break;
                    case "subscribe":
                        if (message.status === '[resp:true]') {
                            return
                        } else {
                            pages[0].handleFriendMsg(message)
                        }
                        break;
                    case "joinChatRoomSuccess":
                        console.log('Message: ', message);
                        wx.showToast({
                            title: "JoinChatRoomSuccess",
                        });
                        break;
                    case "memberJoinChatRoomSuccess":
                        console.log('memberMessage: ', message);
                        wx.showToast({
                            title: "memberJoinChatRoomSuccess",
                        });
                        break;
                    case "memberLeaveChatRoomSuccess":
                        console.log("LeaveChatRoom");
                        wx.showToast({
                            title: "leaveChatRoomSuccess",
                        });
                        break;
                }
            },
            onRoster: function (message) {
                var pages = getCurrentPages()
                if (pages[0]) {
                    pages[0].onShow()
                }
            },

            onVideoMessage: function(message){
                console.log('onVideoMessage: ', message);
                var page = that.getRoomPage()
                if (message) {
                    if (page) {
                        page.receiveVideo(message, 'video')
                    } else {
                        var chatMsg = that.globalData.chatMsg || []
                        var time = WebIM.time()
                        var msgData = {
                            info: {
                                from: message.from,
                                to: message.to
                            },
                            username: message.from,
                            yourname: message.from,
                            msg: {
                                type: 'video',
                                data: message.url
                            },
                            style: '',
                            time: time,
                            mid: 'video' + message.id
                        }
                        msgData.style = ''
                        chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
                        chatMsg.push(msgData)
                        wx.setStorage({
                            key: msgData.yourname + message.to,
                            data: chatMsg,
                            success: function () {
                                //console.log('success')
                            }
                        })
                    }
                }
            },

            onAudioMessage: function (message) {
                console.log('onAudioMessage', message)
                var page = that.getRoomPage()
                console.log(page)
                if (message) {
                    if (page) {
                        page.receiveMsg(message, 'audio')
                    } else {
                        var chatMsg = that.globalData.chatMsg || []
                        var value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''))
                        var time = WebIM.time()
                        var msgData = {
                            info: {
                                from: message.from,
                                to: message.to
                            },
                            username: message.from,
                            yourname: message.from,
                            msg: {
                                type: 'audio',
                                data: value
                            },
                            style: '',
                            time: time,
                            mid: 'audio' + message.id
                        }
                        console.log("Audio msgData: ", msgData);
                        chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
                        chatMsg.push(msgData)
                        wx.setStorage({
                            key: msgData.yourname + message.to,
                            data: chatMsg,
                            success: function () {
                                //console.log('success')
                            }
                        })
                    }
                }
            },

            onLocationMessage: function (message) {
                console.log("Location message: ", message);
            },

            onTextMessage: function (message) {
                var page = that.getRoomPage()
                console.log(page)
                if (message) {
                    if (page) {
                        page.receiveMsg(message, 'txt')
                    } else {
                        var chatMsg = that.globalData.chatMsg || []
                        var value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''))
                        var time = WebIM.time()
                        var msgData = {
                            info: {
                                from: message.from,
                                to: message.to
                            },
                            username: message.from,
                            yourname: message.from,
                            msg: {
                                type: 'txt',
                                data: value
                            },
                            style: '',
                            time: time,
                            mid: 'txt' + message.id
                        }
                        chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
                        chatMsg.push(msgData)
                        wx.setStorage({
                            key: msgData.yourname + message.to,
                            data: chatMsg,
                            success: function () {
                                //console.log('success')
                            }
                        })
                    }
                }
            },
            onEmojiMessage: function (message) {
                //console.log('onEmojiMessage',message)
                var page = that.getRoomPage()
                //console.log(pages)
                if (message) {
                    if (page) {
                        page.receiveMsg(message, 'emoji')
                    } else {
                        var chatMsg = that.globalData.chatMsg || []
                        var time = WebIM.time()
                        var msgData = {
                            info: {
                                from: message.from,
                                to: message.to
                            },
                            username: message.from,
                            yourname: message.from,
                            msg: {
                                type: 'emoji',
                                data: message.data
                            },
                            style: '',
                            time: time,
                            mid: 'emoji' + message.id
                        }
                        msgData.style = ''
                        chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
                        chatMsg.push(msgData)
                        //console.log(chatMsg)
                        wx.setStorage({
                            key: msgData.yourname + message.to,
                            data: chatMsg,
                            success: function () {
                                //console.log('success')
                            }
                        })
                    }
                }
            },
            onPictureMessage: function (message) {
                //console.log('Picture',message);
                var page = that.getRoomPage()
                if (message) {
                    if (page) {
                        //console.log("wdawdawdawdqwd")
                        page.receiveImage(message, 'img')
                    } else {
                        var chatMsg = that.globalData.chatMsg || []
                        var time = WebIM.time()
                        var msgData = {
                            info: {
                                from: message.from,
                                to: message.to
                            },
                            username: message.from,
                            yourname: message.from,
                            msg: {
                                type: 'img',
                                data: message.url
                            },
                            style: '',
                            time: time,
                            mid: 'img' + message.id
                        }
                        msgData.style = ''
                        chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
                        chatMsg.push(msgData)
                        wx.setStorage({
                            key: msgData.yourname + message.to,
                            data: chatMsg,
                            success: function () {
                                //console.log('success')
                            }
                        })
                    }
                }
            },
            // 各种异常
            onError: function (error) {
                // 16: server-side close the websocket connection
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
                    if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
                        return;
                    }

                    wx.showToast({
                        title: 'server-side close the websocket connection',
                        duration: 1000
                    });
                    wx.redirectTo({
                        url: '../login/login'
                    });
                    return;
                }

                // 8: offline by multi login
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
                    wx.showToast({
                        title: 'offline by multi login',
                        duration: 1000
                    })
                    wx.redirectTo({
                        url: '../login/login'
                    })
                    return;
                }
            },
        })

        
    }
    ,
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    }
    ,
    globalData: {
        userInfo: null,
        chatMsg: [],
        jim: null,
        appkey: '5da10dc227e8d4125971ed9b',
        loginName: '',
        loginPassWord: '',
        // autoLogin: true,
        role: null,
        name: null,
        encryptedData: null,
        api: {
          // 角色信息
          roleInfo: 'http://120.78.132.250:8082/fk_api/user/userRole',
          // 添加好友
          addFriend: 'http://120.78.132.250:8082/fk_api/addFriend/',
          // 患者好友列表
          patientFriendList: 'http://120.78.132.250:8082/fk_api/user/patientFriendList',
          // 医生好友列表
          doctorFriendList: 'http://120.78.132.250:8082/fk_api/user/doctorFriendList',
          // 医生注册
          doctorLogin: 'http://120.78.132.250:8082/fk_api/user/doctorLogin',
          // 患者注册
          patientLogin: 'http://120.78.132.250:8082/fk_api/user/patientLogin'
        }
    }
})