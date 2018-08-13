var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default
var app = getApp();
var RecordStatus = {
  SHOW: 0,
  HIDE: 1,
  HOLD: 2,
  SWIPE: 3,
  RELEASE: 4
}

var RecordDesc = {
  0: '长按开始录音',
  2: '向上滑动取消',
  3: '松开手取消',
}

Page({
  data: {
    chatMsg: [],
    emojiStr: '',
    wechatId: '',
    yourname: '',
    // myName: '',
    sendInfo: '',
    userMessage: '',
    inputMessage: '',
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    show: 'emoji_list',
    view: 'scroll_view',
    toView: '',
    emoji: WebIM.Emoji,
    emojiObj: WebIM.EmojiObj,
    msgView: {},
    RecordStatus: RecordStatus,
    RecordDesc: RecordDesc,
    recordStatus: RecordStatus.HIDE,
  },
  onLoad: function (options) {
    var that = this
    // console.log(options);
    // console.log('>>>>>' + wx.getStorageSync('myUsername'));
    // var myName = wx.getStorageSync('myUsername')
    // console.log('>>>>>>>>>>' + myName);
    var options = JSON.parse(options.username)
    // var num = wx.getStorageSync(options.your + myName).length - 1
    wx.setNavigationBarTitle({
      title: options.your
    })
    // var num = wx.getStorageSync(options.your).length;
    var num = wx.getStorageSync(options.your + ',' + getApp().globalData.openid).length;
     console.log('name + openid = ' + options.your + ',' + getApp().globalData.openid)
     console.log('num='+ num);
    if (num > 0) {
      setTimeout(function () {
         console.log('123>>>>' + (wx.getStorageSync(options.your + ',' + getApp().globalData.openid)[num - 1].mid))
        that.setData({
          // toView: wx.getStorageSync(options.your + myName)[num].mid
          // toView: wx.getStorageSync(options.your)[num].mid
          // toView: wx.getStorageSync(options.your + ',' + getApp().globalData.openid)[num].mid
          toView: wx.getStorageSync(options.your + ',' + getApp().globalData.openid)[num - 1].mid
        })
      }, 10)
    }
    // console.log('wx.getStorageSync(options.your)=' + wx.getStorageSync(options.your));
    // console.log('wx.getStorageSync(options.your)=' + wx.getStorageSync(options.your + ',' + getApp().globalData.openid));
    this.setData({
      wechatId: options.wechatId,
      yourname: options.your,
      // myName: myName,
      inputMessage: '',
      // chatMsg: wx.getStorageSync(options.your + myName) || []
      // chatMsg: wx.getStorageSync(options.your) || []
      chatMsg: wx.getStorageSync(options.your + ',' + getApp().globalData.openid) || []
    })
    // console.log(that.data.chatMsg)
    wx.setNavigationBarTitle({
      title: that.data.yourname
    })

    app.globalData.jim.onMsgReceive(function (data) {
       // var that = this;
      var msg_type = data.messages[0].content.msg_type;
       if(msg_type == "image") {
         that.receiveImage(data)
       }else if(msg_type == "file") {
         that.receiveAudio(data)
       }else {
         that.receiveText(data);
       }
     });

  },

  onShow: function () {
    var that = this
    this.setData({
      inputMessage: ''
    })
  },
  bindMessage: function (e) {
    this.setData({
      userMessage: e.detail.value
    })
  },
  cleanInput: function () {
    var that = this
    var setUserMessage = {
      sendInfo: that.data.userMessage
    }
    that.setData(setUserMessage)
  },
  //***************** 录音 begin ***************************
  changedTouches: null,
  toggleRecordModal: function (e) {
    this.setData({
      recordStatus: this.data.recordStatus == RecordStatus.HIDE ? RecordStatus.SHOW : RecordStatus.HIDE
    })
  },
  toggleWithoutAction: function (e) {
    console.log('toggleWithoutModal 拦截请求不做处理')
  },
  handleRecordingMove: function (e) {
    var touches = e.touches[0]
    var changedTouches = this.changedTouches

    if (!this.changedTouches) {
      return
    }
    // 无效
    // var changedTouches = e.changedTouches[0]
    // console.log(changedTouches.pageY, touches.pageY)

    if (this.data.recordStatus == RecordStatus.SWIPE) {
      if (changedTouches.pageY - touches.pageY < 20) {
        this.setData({
          recordStatus: RecordStatus.HOLD
        })
      }
    }
    if (this.data.recordStatus == RecordStatus.HOLD) {
      if (changedTouches.pageY - touches.pageY > 20) {
        this.setData({
          recordStatus: RecordStatus.SWIPE
        })
      }
    }

  },
  handleRecording: function (e) {
    var self = this
    console.log('handleRecording')
    this.changedTouches = e.touches[0]
    this.setData({
      recordStatus: RecordStatus.HOLD
    })
    wx.startRecord({
      fail: function (err) {
        // 时间太短会失败
        console.log(err)
      },
      success: function (res) {
        console.log('success')
        // 取消录音发放状态 -> 退出不发送
        if (self.data.recordStatus == RecordStatus.RELEASE) {
          console.log('user canceled')
          return
        }
        // console.log(tempFilePath)
        //self.uploadRecord(res.tempFilePath)
        self.sendSingleRecord(res.tempFilePath);
      },
      complete: function () {
        console.log("complete")
        this.handleRecordingCancel()
      }.bind(this)
    })

    setTimeout(function () {
      //超时 
      self.handleRecordingCancel()
    }, 100000)
  },
  handleRecordingCancel: function () {
    console.log('handleRecordingCancel')
    // 向上滑动状态停止：取消录音发放
    if (this.data.recordStatus == RecordStatus.SWIPE) {
      this.setData({
        recordStatus: RecordStatus.RELEASE
      })
    } else {
      this.setData({
        recordStatus: RecordStatus.HIDE
      })
    }
    wx.stopRecord()
  },
  stopRecord: function (e) {
    let { url, mid } = e.target.dataset
    this.data.msgView[mid] = this.data.msgView[mid] || {}
    this.data.msgView[mid].isPlay = false;
    this.setData({
      msgView: this.data.msgView
    })
    wx.stopVoice()
  },
  playRecord: function (e) {
    let { url, mid } = e.target.dataset
    this.data.msgView[mid] = this.data.msgView[mid] || {}

    // reset all plays
    for (let v in this.data.msgView) {
      this.data.msgView[v] = this.data.msgView && (this.data.msgView[v] || {})
      this.data.msgView[v].isPlay = false
    }

    // is play then stop
    if (this.data.msgView[mid].isPlay) {
      this.stopRecord(e)
      return;
    }

    console.log(url, mid)
    this.data.msgView[mid].isPlay = true;
    this.setData({
      msgView: this.data.msgView
    })

    wx.downloadFile({
      url: url,
      success: function (res) {
        wx.playVoice({
          filePath: res.tempFilePath,
          complete: function () {
            this.stopRecord(e)
          }.bind(this)
        })
      }.bind(this),
      fail: function (err) {
      },
      complete: function complete() {
      }
    })
  },
  uploadRecord: function (tempFilePath) {
    var str = WebIM.config.appkey.split('#')
    var that = this
    wx.uploadFile({
      url: 'https://a1.easemob.com/' + str[0] + '/' + str[1] + '/chatfiles',
      filePath: tempFilePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      success: function (res) {
        // return;

        // 发送xmpp消息
        var msg = new WebIM.message('audio', WebIM.conn.getUniqueId())
        var data = res.data
        var dataObj = JSON.parse(data)
        var file = {
          type: 'audio',
          'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
          'filetype': '',
          'filename': tempFilePath
        }
        var option = {
          apiUrl: WebIM.config.apiURL,
          body: file,
          to: that.data.yourname,                  // 接收消息对象
          roomType: false,
          chatType: 'singleChat'
        }
        msg.set(option)
        WebIM.conn.send(msg.body)
        // 本地消息展示
        var time = WebIM.time()
        var msgData = {
          info: {
            to: msg.body.to
          },
          username: that.data.myName,
          yourname: msg.body.to,
          msg: {
            type: msg.type,
            data: msg.body.body.url,
            url: msg.body.body.url,
          },
          style: 'self',
          time: time,
          mid: msg.id
        }
        that.data.chatMsg.push(msgData)
        console.log(that.data.chatMsg)
        // 存储到本地消息
        var myName = wx.getStorageSync('myUsername')
        wx.setStorage({
          // key: that.data.yourname + myName,
          key: that.data.yourname + ',' + getApp().globalData.openid,
          data: that.data.chatMsg,
          success: function () {
            //console.log('success', that.data)
            that.setData({
              chatMsg: that.data.chatMsg
            })
            setTimeout(function () {

              that.setData({
                toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
              })
            }, 10)
          }
        })
      }
    })
  },
  //***************** 录音 end ***************************
 sendMessage1: function () {

    if (!this.data.userMessage.trim()) return;


    var that = this
    // //console.log(that.data.userMessage)
    // //console.log(that.data.sendInfo)
    var myName = wx.getStorageSync('myUsername')
    var id = WebIM.conn.getUniqueId();
    var msg = new WebIM.message('txt', id);
    msg.set({
      msg: that.data.sendInfo,
      to: that.data.yourname,
      roomType: false,
      success: function (id, serverMsgId) {
        console.log('send text message success')
      }
    });
    // //console.log(msg)
    console.log("Sending textmessage")
    msg.body.chatType = 'singleChat';
    WebIM.conn.send(msg.body);
    if (msg) {
      var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''))
      var time = WebIM.time()
      var msgData = {
        info: {
          to: msg.body.to
        },
        username: that.data.myName,
        yourname: msg.body.to,
        msg: {
          type: msg.type,
          data: value
        },
        style: 'self',
        time: time,
        mid: msg.id
      }
      that.data.chatMsg.push(msgData)
      console.log("that.data.yourname.myName= " + that.data.yourname + ',' + getApp().globalData.openid)

      wx.setStorage({
        // key: that.data.yourname + myName,
        key: that.data.yourname + ',' + getApp().globalData.openid,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg,
            emojiList: [],
            inputMessage: ''
          })
          setTimeout(function () {
            console.log(that.data.chatMsg[that.data.chatMsg.length - 1].mid)
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
      
      that.setData({
        userMessage: ''
      })
    }
  }, 
  sendMessage: function() {

    //var target_username = that.data.wechatId;
    if (!this.data.userMessage.trim()) return;
    var that = this
    app.globalData.jim.sendSingleMsg({
      'target_username': that.data.wechatId,
      'appkey': "5da10dc227e8d4125971ed9b",
      'content': that.data.sendInfo,
      'no_offline': false,
      'no_notification': false,
      //'custom_notification':{'enabled':true,'title':'title','alert':'alert','at_prefix':'atprefix'}
      need_receipt: true
    }).onSuccess(function (data, msg) {
     // console.log('success data:' + JSON.stringify(data));
      //console.log('succes msg:' + JSON.stringify(msg));

      var content = msg.content.msg_body.text;
      console.log(content);
      var value = WebIM.parseEmoji(msg.content.msg_body.text.replace(/\n/mg, ''));
      var msgData = {
        info: {
          to: that.data.yourname
        },
        username: that.data.myName,
        yourname: that.data.yourname,
        msg: {
          type: msg.content.msg_type,
          data: value
        },
        style: 'self',
        time: msg.content.create_time,
        mid: "JIM_"+msg.msg_id
      }
      that.data.chatMsg.push(msgData)
      console.log("that.data.yourname.myName= " + that.data.yourname + ',' + getApp().globalData.openid)

      wx.setStorage({
        // key: that.data.yourname + myName,
        key: that.data.yourname + ',' + getApp().globalData.openid,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg,
            emojiList: [],
            inputMessage: ''
          })
          setTimeout(function () {
            console.log(that.data.chatMsg[that.data.chatMsg.length - 1].mid)
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })

      that.setData({
        userMessage: ''
      })



    }).onFail(function (data) {
      console.log('error:' + JSON.stringify(data));
    });
  },

  receiveMsg: function (msg, type) {
    var that = this
    var myName = wx.getStorageSync('myUsername')
    if (msg.from == that.data.yourname || msg.to == that.data.yourname) {
      if (type == 'txt') {
        var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))
      } else if (type == 'emoji') {
        var value = msg.data
      } else if (type == 'audio') {
        // 如果是音频则请求服务器转码
        console.log('Audio Audio msg: ', msg);
        var token = msg.accessToken;
        console.log('get token: ', token)
        var options = {
          url: msg.url,
          header: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'audio/mp3',
            'Authorization': 'Bearer ' + token
          },
          success: function (res) {
            console.log('downloadFile success Play', res);
            // wx.playVoice({
            // filePath: res.tempFilePath
            // })
            msg.url = res.tempFilePath
            var msgData = {
              info: {
                from: msg.from,
                to: msg.to
              },
              username: '',
              yourname: msg.from,
              msg: {
                type: type,
                data: value,
                url: msg.url
              },
              style: '',
              time: time,
              mid: msg.type + msg.id
            }

            if (msg.from == that.data.yourname) {
              msgData.style = ''
              msgData.username = msg.from
            } else {
              msgData.style = 'self'
              msgData.username = msg.to
            }

            var msgArr = that.data.chatMsg;
            msgArr.pop();
            msgArr.push(msgData);

            that.setData({
              chatMsg: that.data.chatMsg,
            })
            console.log("New audio");
          },
          fail: function (e) {
            console.log('downloadFile failed', e);
          }
        };
        console.log('Download');
        wx.downloadFile(options);
      }
      //console.log(msg)
      //console.log(value)
      var time = WebIM.time()
      var msgData = {
        info: {
          from: msg.from,
          to: msg.to
        },
        username: '',
        yourname: msg.from,
        msg: {
          type: type,
          data: value,
          url: msg.url
        },
        style: '',
        time: time,
        mid: msg.type + msg.id
      }
      console.log('Audio Audio msgData: ', msgData);
      if (msg.from == that.data.yourname) {
        msgData.style = ''
        msgData.username = msg.from
      } else {
        msgData.style = 'self'
        msgData.username = msg.to
      }
      //console.log(msgData, that.data.chatMsg, that.data)
      that.data.chatMsg.push(msgData)
      wx.setStorage({
        // key: that.data.yourname + myName,
        key: that.data.yourname + ',' + getApp().globalData.openid,
        data: that.data.chatMsg,
        success: function () {
          if (type == 'audio')
            return;
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg,
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
    }
  },
  openEmoji: function () {
    this.setData({
      show: 'showEmoji',
      view: 'scroll_view_change'
    })
  },
  sendEmoji: function (event) {
    var that = this
    var emoji = event.target.dataset.emoji
    var msglen = that.data.userMessage.length - 1
    if (emoji && emoji != '[del]') {
      var str = that.data.userMessage + emoji
    } else if (emoji == '[del]') {
      var start = that.data.userMessage.lastIndexOf('[')
      var end = that.data.userMessage.lastIndexOf(']')
      var len = end - start
      if (end != -1 && end == msglen && len >= 3 && len <= 4) {
        var str = that.data.userMessage.slice(0, start)
      } else {
        var str = that.data.userMessage.slice(0, msglen)
      }
    }
    this.setData({
      userMessage: str,
      inputMessage: str
    })
  },
  sendImage: function () {
    var that = this
    var pages = getCurrentPages()
    pages[1].cancelEmoji()
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        // if (pages[1]) {
        //   pages[1].upLoadImage(res, that)
        // }
        pages[1].sendSingleImage(res);
      }
    })
  },

  sendLocation: function () {
    var that = this
    var pages = getCurrentPages()
    pages[1].cancelEmoji()
    wx.chooseLocation({
      success: function (respData) {

        app.globalData.jim.sendSingleLocation({
          'target_username': that.data.wechatId,
          'target_nickname': that.data.wechatId,
          'appkey': "5da10dc227e8d4125971ed9b",
          'latitude': respData.latitude,
          'longitude': respData.longitude,
          'scale': 1,
          'label': respData.longitude,
          'nead_receipt': true
        }).onSuccess(function (data) {
          console.log('success:' + JSON.stringify(data));
          
        }).onFail(function (data) {
          console.log('error:' + JSON.stringify(data));
          
        });
        // var id = WebIM.conn.getUniqueId();
        // var msg = new WebIM.message('location', id);
        // msg.set({
        //   msg: that.data.sendInfo,
        //   to: respData.longitude,
        //   roomType: false,
        //   lng: respData.longitude,
        //   lat: respData.latitude,
        //   addr: respData.longitude,
        //   success: function (id, serverMsgId) {
        //     //console.log('success')
        //   }
        // });
        // // //console.log(msg)
        // msg.body.chatType = 'singleChat';
        // WebIM.conn.send(msg.body);
      }
    })
  },

  testInterfaces: function () {
    var option = {
      roomId: '21873157013506',
      success: function (respData) {
        wx.showToast({
          title: "JoinChatRoomSuccess",
        });
        console.log('Response data: ', respData);
      }
    };

    WebIM.conn.joinChatRoom(option);
    // var option = {
    //     apiUrl: WebIM.config.apiURL,
    //     pagenum: 1,
    //     pagesize: 20,
    //     success: function(resp){
    //         console.log(resp);
    //     },
    //     error: function(e){
    //         console.log(e);
    //     }
    // };
    // WebIM.conn.getChatRooms(option);
  },
  quitChatRoom: function () {
    console.log('ScareCrow');
    var option = {
      roomId: '21873157013506',
      success: function () {
        console.log("quitChatRoom");
      }
    }
    WebIM.conn.quitChatRoom(option);
  },
  // sendVideo: function() {
  //     var that = this
  //     wx.chooseVideo({
  //         sourceType: ['album', 'camera'],
  //         maxDuration: 60,
  //         camera: 'back',
  //         success: function(res) {
  //             console.log(res)
  //             var tempFilePaths = res.tempFilePath
  //             var str = WebIM.config.appkey.split('#')
  //             wx.uploadFile({
  //                 url: 'https://a1.easemob.com/'+ str[0] + '/' + str[1] + '/chatfiles',
  //                 filePath: tempFilePaths,
  //                 name: 'file',
  //                 header: {
  //                     'Content-Type': 'multipart/form-data'
  //                 },
  //                 success: function (res) {
  //                         var data = res.data

  //                         var dataObj = JSON.parse(data)
  //                         console.log(dataObj)
  //                         var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
  //                         var msg = new WebIM.message('img', id);
  //                         console.log(msg)
  //                         var file = {
  //                             type: 'img',
  //                             'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
  //                             'filetype': 'mp4',
  //                             'filename': tempFilePaths
  //                         }
  //                         //console.log(file)
  //                         var option = {
  //                             apiUrl: WebIM.config.apiURL,
  //                             body: file,
  //                             to: that.data.yourname,                  // 接收消息对象
  //                             roomType: false,
  //                             chatType: 'singleChat'
  //                         }
  //                         msg.set(option)
  //                         WebIM.conn.send(msg.body)
  //                         if (msg) {
  //                             //console.log(msg,msg.body.body.url)
  //                             var time = WebIM.time()
  //                             var msgData = {
  //                                 info: {
  //                                     to: msg.body.to
  //                                 },
  //                                 username: that.data.myName,
  //                                 yourname: msg.body.to,
  //                                 msg: {
  //                                     type: msg.type,
  //                                     data: msg.body.body.url
  //                                 },
  //                                 style: 'self',
  //                                 time: time,
  //                                 mid: msg.id
  //                             }
  //                             that.data.chatMsg.push(msgData)
  //                             console.log(that.data.chatMsg)
  //                             var myName = wx.getStorageSync('myUsername')
  //                             wx.setStorage({
  //                                 key: that.data.yourname + myName,
  //                                 data: that.data.chatMsg,
  //                                 success: function () {
  //                                     //console.log('success', that.data)
  //                                     that.setData({
  //                                         chatMsg: that.data.chatMsg
  //                                     })
  //                                     setTimeout(function () {
  //                                         that.setData({
  //                                             toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
  //                                         })
  //                                     }, 10)
  //                                 }
  //                             })
  //                         }

  //                 }
  //             })
  //         }
  //     })
  // },
  receiveImage: function (data) {
    var that = this;
    var content = data.messages[0].content;
    var msg_type = data.messages[0].content.msg_type;

    app.globalData.jim.getResource({
      'media_id': content.msg_body.media_id,
    }).onSuccess(function (data) {
      //data.code 返回码
      //data.message 描述
      //data.url 资源临时访问路径

      var time = content.create_time
      var msgData = {
        info: {
          from: content.from_name,
          to: content.target_name
        },
        username: '',
        yourname: content.from_name,
        msg: {
          type: msg_type,
          data: data.url
        },
        style: '',
        time: time,
        mid: "JIM" + data.rid
      }

      msgData.style = ''
      msgData.username = content.from_name
      that.data.chatMsg.push(msgData)

      wx.setStorage({
        // key: that.data.yourname + myName,
        key: that.data.yourname + ',' + getApp().globalData.openid,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 10)
        }
      })


    }).onFail(function (data) {
      //data.code 返回码
      //data.message 描述
    });

    // var that = this
    // var myName = wx.getStorageSync('myUsername')
    // //console.log(msg)
    // if (msg) {
    //   //console.log(msg)
    //   var time = WebIM.time()
    //   var msgData = {
    //     info: {
    //       from: msg.from,
    //       to: msg.to
    //     },
    //     username: msg.from,
    //     yourname: msg.from,
    //     msg: {
    //       type: 'img',
    //       data: msg.url
    //     },
    //     style: '',
    //     time: time,
    //     mid: 'img' + msg.id
    //   }
    //   //console.log(msgData)
    //   that.data.chatMsg.push(msgData)
    //   //console.log(that.data.chatMsg)
    //   wx.setStorage({
    //     // key: that.data.yourname + myName,
    //     key: that.data.yourname + ',' + getApp().globalData.openid,
    //     data: that.data.chatMsg,
    //     success: function () {
    //       //console.log('success', that.data)
    //       that.setData({
    //         chatMsg: that.data.chatMsg
    //       })
    //       setTimeout(function () {
    //         that.setData({
    //           toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
    //         })
    //       }, 100)
    //     }
    //   })
    // }
  },

  receiveText:function(data) {
    var that = this;
    var content = data.messages[0].content;
    var msg_type = content.msg_type;

    var myName = wx.getStorageSync('myUsername');
    var time = content.create_time;
    var value = WebIM.parseEmoji(content.msg_body.text.replace(/\n/mg, ''));

    var msgData = {
      info: {
        from: content.from_name,
        to: content.target_name
      },
      username: '',
      yourname: content.from_name,
      msg: {
        type: msg_type,
        data: value
      },
      style: '',
      time: time,
      mid: msg_type + data.rid
    }


    msgData.style = ''
    msgData.username = content.from_name

    that.data.chatMsg.push(msgData)
    wx.setStorage({
      // key: that.data.yourname + myName,
      key: that.data.yourname + ',' + getApp().globalData.openid,
      data: that.data.chatMsg,
      success: function () {
        if (msg_type == 'audio')
          return;
        //console.log('success', that.data)
        that.setData({
          chatMsg: that.data.chatMsg,
        })
        setTimeout(function () {
          that.setData({
            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
          })
        }, 100)
      }
    })
  },

  receiveAudio: function (data) {

    var that = this;
    var content = data.messages[0].content;
    var msg_type = data.messages[0].content.msg_type;

    app.globalData.jim.getResource({
      'media_id': content.msg_body.media_id,
    }).onSuccess(function (data) {
      //data.code 返回码
      //data.message 描述
      //data.url 资源临时访问路径

      var time = content.create_time
      var msgData = {
        info: {
          from: content.from_name,
          to: content.target_name
        },
        username: '',
        yourname: content.from_name,
        msg: {
          type: "audio",
          data: data.url
        },
        style: '',
        time: time,
        mid: "JIM" + data.rid
      }

      msgData.style = ''
      msgData.username = content.from_name
      that.data.chatMsg.push(msgData)

      wx.setStorage({
        // key: that.data.yourname + myName,
        key: that.data.yourname + ',' + getApp().globalData.openid,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 10)
        }
      })


    }).onFail(function (data) {
      //data.code 返回码
      //data.message 描述
    });
    // var that = this
    // var myName = wx.getStorageSync('myUsername')
    // //console.log(msg)
    // if (msg) {
    //   //console.log(msg)
    //   var time = WebIM.time()
    //   var msgData = {
    //     info: {
    //       from: msg.from,
    //       to: msg.to
    //     },
    //     username: msg.from,
    //     yourname: msg.from,
    //     msg: {
    //       type: 'video',
    //       data: msg.url
    //     },
    //     style: '',
    //     time: time,
    //     mid: 'video' + msg.id
    //   }
    //   //console.log(msgData)
    //   that.data.chatMsg.push(msgData)
    //   //console.log(that.data.chatMsg)
    //   wx.setStorage({
    //     // key: that.data.yourname + myName,
    //     key: that.data.yourname + ',' + getApp().globalData.openid,
    //     data: that.data.chatMsg,
    //     success: function () {
    //       //console.log('success', that.data)
    //       that.setData({
    //         chatMsg: that.data.chatMsg
    //       })
    //       setTimeout(function () {
    //         that.setData({
    //           toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
    //         })
    //       }, 100)
    //     }
    //   })
    // }
  },

  receiveVideo: function (msg, type) {
    var that = this
    var myName = wx.getStorageSync('myUsername')
    //console.log(msg)
    if (msg) {
      //console.log(msg)
      var time = WebIM.time()
      var msgData = {
        info: {
          from: msg.from,
          to: msg.to
        },
        username: msg.from,
        yourname: msg.from,
        msg: {
          type: 'video',
          data: msg.url
        },
        style: '',
        time: time,
        mid: 'video' + msg.id
      }
      //console.log(msgData)
      that.data.chatMsg.push(msgData)
      //console.log(that.data.chatMsg)
      wx.setStorage({
        // key: that.data.yourname + myName,
        key: that.data.yourname + ',' + getApp().globalData.openid,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
    }
  },

  openCamera: function () {
    var that = this
    var pages = getCurrentPages()
    pages[1].cancelEmoji()
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function (res) {
        if (pages[1]) {
          //pages[1].upLoadImage(res, that)
          pages[1].sendSingleImage(res);
        }
      }
    })
  },
  focus: function () {
    this.setData({
      show: 'emoji_list',
      view: 'scroll_view'
    })
  },
  cancelEmoji: function () {
    this.setData({
      show: 'emoji_list',
      view: 'scroll_view'
    })
  },
  scroll: function (e) {
    // //console.log(e)
  },
  lower: function (e) {
    //console.log(e)
  },
  upLoadImage: function (res, that) {
    //console.log(res)
    var tempFilePaths = res.tempFilePaths
    //console.log(tempFilePaths)
    wx.getImageInfo({
      src: res.tempFilePaths[0],
      success: function (res) {
        // console.log(res)
        var allowType = {
          'jpg': true,
          'gif': true,
          'png': true,
          'bmp': true
        };
        var str = WebIM.config.appkey.split('#')
        var width = res.width
        var height = res.height
        var index = res.path.lastIndexOf('.')
        if (index != -1) {
          var filetype = res.path.slice(index + 1)
        }
        if (filetype.toLowerCase() in allowType) {
          wx.uploadFile({
            url: 'https://a1.easemob.com/' + str[0] + '/' + str[1] + '/chatfiles',
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              'Content-Type': 'multipart/form-data'
            },
            success: function (res) {
              var data = res.data
              var dataObj = JSON.parse(data)
              // console.log(dataObj)
              var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
              var msg = new WebIM.message('img', id);
              var file = {
                type: 'img',
                size: {
                  width: width,
                  height: height
                },
                'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
                'filetype': filetype,
                'filename': tempFilePaths[0]
              }
              //console.log(file)
              var option = {
                apiUrl: WebIM.config.apiURL,
                body: file,
                to: that.data.yourname,                  // 接收消息对象
                roomType: false,
                chatType: 'singleChat'
              }
              msg.set(option)
              WebIM.conn.send(msg.body)
              if (msg) {
                //console.log(msg,msg.body.body.url)
                var time = WebIM.time()
                var msgData = {
                  info: {
                    to: msg.body.to
                  },
                  username: that.data.myName,
                  yourname: msg.body.to,
                  msg: {
                    type: msg.type,
                    data: msg.body.body.url,
                    size: {
                      width: msg.body.body.size.width,
                      height: msg.body.body.size.height,
                    }
                  },
                  style: 'self',
                  time: time,
                  mid: msg.id
                }
                that.data.chatMsg.push(msgData)
                //console.log(that.data.chatMsg)
                var myName = wx.getStorageSync('myUsername')
                wx.setStorage({
                  // key: that.data.yourname + myName,
                  key: that.data.yourname + ',' + getApp().globalData.openid,
                  data: that.data.chatMsg,
                  success: function () {
                    //console.log('success', that.data)
                    that.setData({
                      chatMsg: that.data.chatMsg
                    })
                    setTimeout(function () {
                      that.setData({
                        toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                      })
                    }, 10)
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  previewImage: function (event) {
    var url = event.target.dataset.url
    wx.previewImage({
      urls: [url]  // 需要预览的图片http链接列表
    })
  },
  sendSingleImage:function(res) {
    var that = this
    var tempFilePaths = res.tempFilePaths[0]; //获取成功，读取文件路
    app.globalData.jim.sendSinglePic({
      'target_username': that.data.wechatId,
      'target_nickname': that.data.wechatId,
      'appkey': "5da10dc227e8d4125971ed9b",
      'image': tempFilePaths //设置图片参数
    }).onSuccess(function (data, msg) {
      console.log(msg)
      app.globalData.jim.getResource({
        'media_id': msg.content.msg_body.media_id,
      }).onSuccess(function (data) {
        //data.code 返回码
        //data.message 描述
        //data.url 资源临时访问路径

        var time = msg.content.create_time
        var msgData = {
          info: {
            to: msg.target_name
          },
          username: that.data.myName,
          yourname: msg.target_name,
          msg: {
            type: msg.content.msg_type,
            data: data.url,
            size: {
              width: msg.content.msg_body.width,
              height: msg.content.msg_body.height,
            }
          },
          style: 'self',
          time: time,
          mid: "JIM_" + msg.msg_id
        }
        that.data.chatMsg.push(msgData)
        //console.log(that.data.chatMsg)
        var myName = wx.getStorageSync('myUsername')
        wx.setStorage({
          // key: that.data.yourname + myName,
          key: that.data.yourname + ',' + getApp().globalData.openid,
          data: that.data.chatMsg,
          success: function () {
            //console.log('success', that.data)
            that.setData({
              chatMsg: that.data.chatMsg
            })
            setTimeout(function () {
              that.setData({
                toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
              })
            }, 10)
          }
        })


      }).onFail(function (data) {
        //data.code 返回码
        //data.message 描述
      });

    }).onFail(function (data) {
      //TODO
    });
  },
  sendSingleRecord: function (tempFilePath) {
    var that = this
    app.globalData.jim.sendSingleVedio({
      'target_username': that.data.wechatId,
      'target_nickname': that.data.wechatId,
      'appkey': "5da10dc227e8d4125971ed9b",
      'file': tempFilePath
    }).onSuccess(function (data, msg) {
      console.log('success:' + JSON.stringify(msg));

      app.globalData.jim.getResource({
        'media_id': msg.content.msg_body.media_id,
      }).onSuccess(function (data) {
        //data.code 返回码
        //data.message 描述
        //data.url 资源临时访问路径

        var time = msg.content.create_time
        var msgData = {
          info: {
            to: msg.target_name
          },
          username: that.data.myName,
          yourname: msg.target_name,
          msg: {
            type: 'audio',
            data: data.url,
            url: data.url,
          },
          style: 'self',
          time: time,
          mid: "JIM_" + msg.msg_id
        }
        that.data.chatMsg.push(msgData)
        console.log(that.data.chatMsg)
        // 存储到本地消息
        var myName = wx.getStorageSync('myUsername')
        wx.setStorage({
          // key: that.data.yourname + myName,
          key: that.data.yourname + ',' + getApp().globalData.openid,
          data: that.data.chatMsg,
          success: function () {
            //console.log('success', that.data)
            that.setData({
              chatMsg: that.data.chatMsg
            })
            setTimeout(function () {

              that.setData({
                toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
              })
            }, 10)
          }
        })



      }).onFail(function (data) {
        //data.code 返回码
        //data.message 描述
      });
      
    }).onFail(function (data) {
      //TODO
    });
  
  }
})

















