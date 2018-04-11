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
      registername: (getApp().globalData.userInfo == null) ? '' : getApp().globalData.userInfo.nickName,
      registersex: (getApp().globalData.userInfo == null) ? '男' : ((getApp().globalData.userInfo.gender == 1) ? '男' : '女')
    });
    // console.log('getApp().globalData.userInfo=' + getApp().globalData.userInfo);
  },
  register: function () {
    // console.log('doctor=' + this.data.doctorInfo.name);
    // console.log('patient=' + this.data.patientInfo.name);
    if (this.data.isDoctor) {
      this.registerDoctor();
    } else {
      // if (this.checkPatient()) {
        this.registerPatient();
      // }
    }
  },

  registerDoctor: function () {
    // console.log(this.data.registername);
    console.log(this.data.doctorInfo.department);
    // console.log(this.data.doctorInfo.grade);
    console.log(this.data.doctorInfo.hospital);
    // console.log(4);
    // console.log(this.data.doctorInfo.name);
    var name = this.data.registername;
    var sex = this.data.registersex;

    if (this.data.registername == '') {
      wx.showToast({
        title: '请填写医生姓名',
        duration: 2000
      })
      return;
    }
    // console('name=' + name);

    if (this.data.doctorInfo.hospital == undefined){
      wx.showToast({
        title: '请选择所在医院',
        duration: 2000
      })
      return;
    }

    if (this.data.doctorInfo.department == undefined){
      wx.showToast({
        title: '请选择所在科室',
        duration: 2000
      })
      return;
    }
    var name = this.data.registername;
    wx.request({
      // url: getApp().globalData.api.doctorLogin + "?wechatId=" + getApp().globalData.userInfo.nickName,
      url: getApp().globalData.api.doctorLogin + "?wechatId=" + getApp().globalData.openid,
      data: {
        "departmentId": this.data.doctorInfo.department,
        "grade": this.data.doctorInfo.grade,
        "hospitalId": this.data.doctorInfo.hospital,
        "monthPrice": 0,
        // "name": this.data.doctorInfo.name
        "name": name
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
    // return;
    // console.log('>>>' + getApp().globalData.userInfo.nickName);
    // console.log('>>>' + this.data.patientInfo.tel);
    // console.log('>>>' + this.data.patientInfo.birthday);return;
    // console.log('>>>' + getApp().globalData.userInfo.gender);
    // console.log('>>>>>>>register= ' + this.data.patientInfo);
    // console.log('>>>>>>>register= ' + this.data.patientInfo.name);
    // console.log('>>>>>>>register= ' + (this.data.patientInfo.name == null));
    var name = this.data.registername;
    var sex = this.data.registersex;

    if (this.data.registername == '') {
      wx.showToast({
        title: '请填写患者姓名',
        duration: 2000
      })
      return;
    }

    if (!this.checkPatient()){
      return;
    }

    if (this.data.patientInfo.birthday == undefined){
      wx.showToast({
        title: '请选择患者生日',
        duration: 2000
      })
      return;
    }
    
    wx.request({
      // url: getApp().globalData.api.patientLogin + "?wechatId=" + getApp().globalData.userInfo.nickName,
      url: getApp().globalData.api.patientLogin + "?wechatId=" + getApp().globalData.openid,
      data: {
        "birthday": this.data.patientInfo.birthday,
        "mobile": this.data.patientInfo.tel,
        // "name": this.data.patientInfo.name,
        // "name": getApp().globalData.userInfo.nickName,
        "name": name,
        "sex": sex
        // "sex": (this.data.patientInfo.sex == '男') ? '1' : '0'
        // "sex": getApp().globalData.userInfo.gender

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
    var userinfo = getApp().globalData.userInfo;
    if (userinfo) {

    }

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
      'doctorInfo.name': e.detail.value,
      registername: e.detail.value
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
      'patientInfo.name': e.detail.value,
      registername : e.detail.value
    })
    // console.log(this.data.patientInfo)
  },

  bindPatientSex: function (e) {
    this.setData({
      'patientInfo.sex': e.detail.value,
      registersex : e.detail.value == '男' ? e.detail.value : '女'
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