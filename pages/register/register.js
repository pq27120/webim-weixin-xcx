var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
  data: {
    // username: '',
    // password: '',
    doctorInfo: {},
    patientInfo: {},
    registername:  '',
    registersex: '',
    isDoctor: ''
  },
  onLoad: function (option) {
    this.setData({
      isDoctor: getApp().globalData.role === 1,
      registername: getApp().globalData.userInfo.nickName,
      registersex: (getApp().globalData.userInfo.gender == 1) ? '男' : '女'
    });
    // console.log('getApp().globalData.role=' + this.data.isDoctor);
  },
  register: function () {
    // console.log('doctor=' + this.data.doctorInfo.name);
    // console.log('patient=' + this.data.patientInfo.name);
    if (this.data.isDoctor) {
      this.registerDoctor();
    } else {
      this.registerPatient();
    }
  },

  registerDoctor: function () {
    // console.log(this.data.doctorInfo.department);
    // console.log(this.data.doctorInfo.grade);
    // console.log(this.data.doctorInfo.hospital);
    // console.log(4);
    // console.log(this.data.doctorInfo.name);
    wx.request({
      url: getApp().globalData.api.doctorLogin + "?wechatId=" + getApp().globalData.userInfo.nickName,
      data: {
        "departmentId": this.data.doctorInfo.department,
        "grade": this.data.doctorInfo.grade,
        "hospitalId": this.data.doctorInfo.hospital,
        "monthPrice": 0,
        "name": this.data.doctorInfo.name
      },
      header: { 'Content-Type': "application/json" },
      method: 'post',
      success: function (res) {
        wx.redirectTo({
          url: '../main/main'
        })
      }
    })
  },

  registerPatient: function (e) {
    // console.log(this.data.patientInfo.name);
    // console.log(this.data.patientInfo.tel);
    // console.log(this.data.patientInfo.birthday);
    // console.log(this.data.patientInfo.sex);
    // console.log(e.detail.value);
    wx.request({
      url: getApp().globalData.api.patientLogin + "?wechatId=" + getApp().globalData.userInfo.nickName,
      data: {
        "birthday": this.data.patientInfo.birthday,
        "mobile": this.data.patientInfo.tel,
        "name": this.data.patientInfo.name,
        "sex": (this.data.patientInfo.sex == '男') ? '1' : '0'
      },
      header: { 'Content-Type': "application/json" },
      method: 'post',
      success: function (res) {
        wx.redirectTo({
          url: '../main/main'
        })
      }
    })
  },

  bindDoctorName: function (e) {
    this.setData({
      'doctorInfo.name': e.detail.value
      // }
    })
  },
  bindDoctorHospital: function (e) {
    this.setData({
      'doctorInfo.hospital': e.detail.value
      // }
    })
  },
  bindDoctorDept: function (e) {
    this.setData({
      'doctorInfo.department': e.detail.value
      // }
    })
  },
  bindDoctorGrade: function (e) {
    this.setData({
      'doctorInfo.grade': e.detail.value
      // }
    })
  },

  // 患者信息
  bindPatientName: function (e) {
    this.setData({
      'patientInfo.name': e.detail.value
      // }
    })
    // console.log(this.data.patientInfo)
  },
  bindPatientSex: function (e) {
    this.setData({
      'patientInfo.sex': e.detail.value
      // }
    })

  },
  bindPatientTel: function (e) {
    this.setData({
      'patientInfo.tel': e.detail.value
      // }
    })

  },
  bindPatientBrithday: function (e) {
    this.setData({
      'patientInfo.birthday': e.detail.value
      // }
    })
  },
  // bindUsername: function(e) {
  // 	this.setData({
  // 		username: e.detail.value
  // 	})
  // },
  // bindPassword: function(e) {
  // 	this.setData({
  // 		password: e.detail.value
  // 	})
  // },
  // register: function() {
  //   var that = this
  //   if(that.data.username == '') {
  // 		wx.showModal({
  //       title: '请输入账号！',
  // 			confirmText: 'OK',
  // 			showCancel: false
  // 		})
  // 	}else if(that.data.password == '') {
  // 		wx.showModal({
  // 			title: '请输入密码！',
  // 			confirmText: 'OK',
  // 			showCancel: false
  // 		})
  // 	}else {
  // 		var options = {
  //             apiUrl: WebIM.config.apiURL,
  //             username: that.data.username,
  //             password: that.data.password,
  //             nickname: '',
  //             appKey: WebIM.config.appkey,
  //             success: function(res) {
  //             	if(res.statusCode == '200') {
  //             		wx.showToast({
  // 		                title: '注册成功,正在登录',
  // 		                icon: 'success',
  // 		                duration: 1500,
  // 		                success: function() {
  // 		                	var data = {
  // 				                apiUrl: WebIM.config.apiURL,
  // 				                user: that.data.username,
  // 				                pwd: that.data.password,
  // 				                grant_type: 'password',
  // 				                appKey: WebIM.config.appkey
  // 				            }
  // 				            //console.log('data',data)
  // 				            wx.setStorage({
  // 				                key: "myUsername",
  // 				                data: that.data.username
  // 				            })
  // 				            setTimeout(function(){
  // 				            	WebIM.conn.open(data)
  // 				            },1000)

  // 		                }
  // 		            });   
  //             	}	
  //             },
  //             error: function(res) {
  //             	if(res.statusCode !== '200') {
  //             		wx.showModal({
  //             			title: '用户名已被占用',
  // 		                showCancel: false,
  // 		                confirmText: 'OK'
  //             		})
  //             	}
  //             }
  //       	}
  //       	WebIM.utils.registerUser(options)
  // 	}

  //   }
})