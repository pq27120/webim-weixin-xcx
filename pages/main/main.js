var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
  data: {
    search_btn: true,
    search_friend: false,
    show_mask: false,
    myName: '',
    // myrole: '',
    member: []
    // isDoctor:false
  },
  onLoad: function (option) {
    this.setData({
      myName: getApp().globalData.name
      // myrole: option.role
      // isDoctor: option.doctor
    })
    //console.log("wjy")
    //var that = this
    //console.log('main js .... role = ' + that.data.myrole)
  },
  onShow: function () {
    // var that = this
    // //console.log(WebIM.conn)
    /** 
    getApp().globalData.jim.getFriendList().onSuccess(function (data) {
      var member = []
      if(data.code == 0){
        member = data.friend_list     
        that.setData({
          member: member
        })
        wx.setStorage({
          key: 'member',
          data: that.data.member
        })       
      }
    }) */
    console.log('getApp().globalData.userInfo=' + getApp().globalData.userInfo);
    // 没有授权的话不获取用户列表
    if (getApp().globalData.userInfo == null){
      return;
    }

    var that = this
    // 如果是医生，请求患者列表；如果是患者，请求医生列表
    wx.request({
      url: (getApp().globalData.role === 1) ? getApp().globalData.api.patientFriendList : getApp().globalData.api.doctorFriendList,
      data: { "wechatId": getApp().globalData.openid },
      header: { 'Content-Type': "application/x-www-form-urlencoded" },
      method: 'post',
      success: function (res) {
        //  console.log('>>>> requst fk doctor:' + res.data.data);
        // 0 为未注册用户, 1 为医生, 2 为患者, 3 为医生患者用户
        // getApp().globalData.role = (res.data.data === 1) ? 'doctor' : 'patient'
        var member = []
        member = res.data.data
        if (member) {
          that.setData({
            member: member
          })
          wx.setStorage({
            key: 'member',
            data: that.data.member
          })
        }
      }
    })

    var rosters = {
      success: function (roster) {
        var member = []
        for (var i = 0; i < roster.length; i++) {
          if (roster[i].subscription == "both") {
            member.push(roster[i])
          }
        }
        that.setData({
          member: member
        })
        wx.setStorage({
          key: 'member',
          data: that.data.member
        })
      }
    }

    //WebIM.conn.setPresence()
    WebIM.conn.getRoster(rosters)
  },
  moveFriend: function (message) {
    var that = this
    var rosters = {
      success: function (roster) {
        var member = []
        for (var i = 0; i < roster.length; i++) {
          if (roster[i].subscription == "both") {
            member.push(roster[i])
          }
        }
        that.setData({
          member: member
        })
      }
    }
    if (message.type == 'unsubscribe' || message.type == 'unsubscribed') {
      WebIM.conn.removeRoster({
        to: message.from,
        success: function () {
          WebIM.conn.unsubscribed({
            to: message.from
          });
          WebIM.conn.getRoster(rosters)
        }
      })
    }
  },
  handleFriendMsg: function (message) {
    var that = this
    //console.log(message)
    wx.showModal({
      title: '添加好友请求',
      content: message.from + '请求加为好友',
      success: function (res) {
        if (res.confirm == true) {
          //console.log('vvvvvvvvvvvvv')
          WebIM.conn.subscribed({
            to: message.from,
            message: "[resp:true]"
          })
          WebIM.conn.subscribe({
            to: message.from,
            message: "[resp:true]"
          })
        } else {
          WebIM.conn.unsubscribed({
            to: message.from,
            message: "rejectAddFriend"
          })
          //console.log('delete_friend')
        }
      },
      fail: function (error) {
        //console.log(error)
      }
    })

  },
  delete_friend: function (event) {
    var delName = event.target.dataset.username
    wx.showModal({
      title: '确认删除好友' + delName,
      cancelText: '取消',
      confirmText: '删除',
      success: function (res) {
        if (res.confirm == true) {
          WebIM.conn.removeRoster({
            to: delName,
            success: function () {
              WebIM.conn.unsubscribed({
                to: delName
              });
              //console.log(delName)
            },
            error: function (error) {
              //console.log(error)
            }
          })
        }

      },
      fail: function (error) {
        //console.log(error)
      }
    })
  },
  openSearch: function () {
    this.setData({
      search_btn: false,
      search_friend: true,
      show_mask: true
    })
  },
  cancel: function () {
    this.setData({
      search_btn: true,
      search_friend: false,
      show_mask: false
    })
  },
  add_new: function () {
    wx.navigateTo({
      url: '../add_new/add_new'
    })
  },
  tab_chat: function () {
    wx.redirectTo({
      url: '../chat/chat'
    })
  },
  close_mask: function () {
    this.setData({
      search_btn: true,
      search_friend: false,
      show_mask: false
    })
  },
  tab_setting: function () {
    var that = this
    // console.log('main.js.tab_setting.role=' + that.data.myrole)
    wx.redirectTo({
      // url: '../settings/settings?role=' + that.data.myrole
      url: '../settings/settings'
    })

  },
  into_inform: function () {
    wx.navigateTo({
      url: '../inform/inform'
    })
  },
  into_groups: function () {
    wx.navigateTo({
      url: '../groups/groups'
    })
  },
  into_room: function (event) {
    var that = this
    //console.log(event)
    var nameList = {
      // myName: that.data.myName,
      your: event.target.dataset.username
    }
    wx.navigateTo({
      url: '../chatroom/chatroom?username=' + JSON.stringify(nameList)
    })
  },
  into_info: function (event) {
    wx.navigateTo({
      // url: '../friend_info/friend_info?yourname=' + event.target.dataset.username
      url: '../friend_info/friend_info'
    })
  }

})