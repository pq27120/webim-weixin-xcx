var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
  data: {
    // username: '',
    // password: '',
    doctorgrade: ['主任医师（教授/专家）', '副主任医师（副教授）', '主治医师', '住院医师'],
    doctorgradeindex: 2,

    doctorInfo: {},
    patientInfo: {},

    registername: '',
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
      if (this.checkPatient()) {
        this.registerPatient();
      }
    }
  },

  registerDoctor: function () {
    // console.log(this.data.doctorInfo.department);
    // console.log(this.data.doctorInfo.grade);
    // console.log(this.data.doctorInfo.hospital);
    // console.log(4);
    // console.log(this.data.doctorInfo.name);
    wx.request({
      // url: getApp().globalData.api.doctorLogin + "?wechatId=" + getApp().globalData.userInfo.nickName,
      url: getApp().globalData.api.doctorLogin + "?wechatId=" + getApp().globalData.unionId,
      data: {
        "departmentId": this.data.doctorInfo.department,
        "grade": this.data.doctorInfo.grade,
        "hospitalId": this.data.doctorInfo.hospital,
        "monthPrice": 0,
        // "name": this.data.doctorInfo.name
        "name": getApp().globalData.userInfo.nickName
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
    // console.log('>>>' + getApp().globalData.userInfo.nickName);
    // console.log('>>>' + this.data.patientInfo.tel);
    // console.log('>>>' + this.data.patientInfo.birthday);
    // console.log('>>>' + getApp().globalData.userInfo.gender);
    // console.log(e.detail.value);
    wx.request({
      // url: getApp().globalData.api.patientLogin + "?wechatId=" + getApp().globalData.userInfo.nickName,
      url: getApp().globalData.api.patientLogin + "?wechatId=" + getApp().globalData.unionId,
      data: {
        "birthday": this.data.patientInfo.birthday,
        "mobile": this.data.patientInfo.tel,
        // "name": this.data.patientInfo.name,
        "name": getApp().globalData.userInfo.nickName,
        // "sex": (this.data.patientInfo.sex == '男') ? '1' : '0'
        "sex": getApp().globalData.userInfo.gender
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

  checkPatient: function () {
    var telregular = /^\d{11}$/;
    var tel = this.data.patientInfo.tel;
    // console.log('tel=' + tel);
    // console.log('tel regular = ' + telregular.test(tel))
    // console.log('tel regular = ' + !(telregular.test(tel)))
    if (!(telregular.test(tel))) {
      wx.showToast({
        title: '手机号码不正确',
        duration: 2000
      })
      return false;
    }

    return true;
  },

  bindDoctorName: function (e) {
    this.setData({
      'doctorInfo.name': e.detail.value
    })
  },
  bindDoctorHospital: function (e) {
    this.setData({
      'doctorInfo.hospital': e.detail.value
    })
  },
  bindDoctorDept: function (e) {
    this.setData({
      'doctorInfo.department': e.detail.value
    })
  },
  bindDoctorGrade: function (e) {
    // console.log(this.data.doctorgradeindex)
    // this.setData({
    //   'doctorInfo.grade': e.detail.value
    // })
    var index = e.detail.value;
    this.setData({
      'doctorInfo.grade': index,
      doctorgradeindex: index
    })
  },

  // 患者信息
  bindPatientName: function (e) {
    this.setData({
      'patientInfo.name': e.detail.value
    })
    // console.log(this.data.patientInfo)
  },
  bindPatientSex: function (e) {
    this.setData({
      'patientInfo.sex': e.detail.value
    })

  },
  bindPatientTel: function (e) {
    this.setData({
      'patientInfo.tel': e.detail.value
    })

  },
  bindPatientBrithday: function (e) {
    this.setData({
      'patientInfo.birthday': e.detail.value
    })
  }
})