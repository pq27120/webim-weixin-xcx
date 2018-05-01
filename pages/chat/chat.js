Page({
  data: {
    search_btn: true,
    search_chats: false,
    show_mask: false,
    yourname: '',
    arr: []
  },
  onShow: function () {
    var that = this
    var member = wx.getStorageSync('member');
    // console.log("member=" + member[0].id + ";" + member[0].doctorId + ";" + member[0].doctorName);
    var myName = wx.getStorageSync('myUsername')
    var array = []
    if (member) {
      for (var i = 0; i < member.length; i++) {
        // if (wx.getStorageSync(member[i].name + myName) != '') {
        //   array.push(wx.getStorageSync(member[i].name + myName)[wx.getStorageSync(member[i].name + myName).length - 1])
        // }
        // wx.getStorageSync((((getApp().globalData.role == 1) ? member[i].doctorName : member[i].patientName)) + ',' + getApp().globalData.openid);
        // console.log(i + '>>>' + (((getApp().globalData.role == 1) ? member[i].patientName : member[i].doctorName) + ',' + getApp().globalData.openid));
        // console.log(i + '>>>' + wx.getStorageSync((((getApp().globalData.role == 1) ? member[i].patientName : member[i].doctorName) + ',' + getApp().globalData.openid)));
        // console.log('1>>>' + member[i].doctorName);
        // console.log('2>>>' + member[i].patientName);
        // console.log('3>>>' + getApp().globalData.openid);
        // console.log('4>>>' + wx.getStorageSync(((getApp().globalData.role == 1) ? member[i].doctorName : member[i].patientName) + ',' + getApp().globalData.openid));
        if (wx.getStorageSync(((getApp().globalData.role == 1) ? member[i].patientName : member[i].doctorName) + ',' + getApp().globalData.openid) != '') {
          var msgdata = wx.getStorageSync(((getApp().globalData.role == 1) ? member[i].patientName : member[i].doctorName) + ',' + getApp().globalData.openid)[wx.getStorageSync(((getApp().globalData.role == 1) ? member[i].patientName : member[i].doctorName) + ',' + getApp().globalData.openid).length - 1];
          msgdata.imageurl = ((getApp().globalData.role == 1) ? member[i].patientUrl : member[i].doctorUrl);
          array.push(msgdata)
        }
      }
    }
    // console.log(array);
    this.setData({
      arr: array
    })
  },
  openSearch: function () {
    this.setData({
      search_btn: false,
      search_chats: true,
      show_mask: true
    })
  },
  cancel: function () {
    this.setData({
      search_btn: true,
      search_chats: false,
      show_mask: false
    })
  },
  tab_contacts: function () {
    wx.redirectTo({
      url: '../main/main'
    })
  },
  close_mask: function () {
    this.setData({
      search_btn: true,
      search_chats: false,
      show_mask: false
    })
  },
  tab_setting: function () {
    wx.redirectTo({
      url: '../settings/settings'
    })
  },
  into_chatRoom: function (event) {
    var that = this
    //console.log(event)
    var my = wx.getStorageSync('myUsername')
    var nameList = {
      myName: my,
      your: event.currentTarget.dataset.username
    }
    wx.navigateTo({
      url: '../chatroom/chatroom?username=' + JSON.stringify(nameList)
    })
  },
  del_chat: function (event) {
    var nameList = {
      your: event.currentTarget.dataset.username
    }
    var myName = wx.getStorageSync('myUsername')
    var currentPage = getCurrentPages()
    wx.showModal({
      title: '删除该聊天记录',
      confirmText: '删除',
      success: function (res) {
        if (res.confirm) {
          wx.setStorage({
            key: nameList.your + myName,
            data: '',
            success: function () {
              if (currentPage[0]) {
                currentPage[0].onShow()
              }
            }
          })
        }
      },
      fail: function (error) {
        //console.log(error)
      }
    })
  }

})



