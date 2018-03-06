var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

//WebIM.conn  实例化的  
Page({
	data: {
		friend_name:''
	},
	bindFriendName: function(e) {
		this.setData({
			friend_name: e.detail.value
		})
	},
	onShow: function() {
		//console.log(getCurrentPages())
	},
	sendMsg: function() {
		wx.showToast({
			title: '消息发送成功！',
			duration: 1500
		})
	},
  // 允许从相机和相册扫码
  san:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  },
	add_friend: function() {
	    var that = this
	    if(that.data.friend_name == '') {
	    	wx.showToast({
	    		title: '好友添加失败！',
	    		duration: 1500
	    	})
	    	return false
	    }
	    else {
        getApp().globalData.jim.addFriend({
          'target_name': that.data.friend_name,
          'why': 'why'
        }).onSuccess(function (data) {
          console.log(data);
          //data.code 返回码
          //data.message 描述
        }).onFail(function (data) {
          // 同上
        });
		    // WebIM.conn.subscribe({
		    //     to: that.data.friend_name
		    //     // message: "hello!"                   
		    // })
		    wx.showToast({
	    		title: '消息发送成功！',
	    		duration: 1500
	    	})
	    }  
	}
})



















