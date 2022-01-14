// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    article: '',
    title: '',
    publish_date: '',
    author: '',
    id:'',
    total:1,
    page:1,
    articleIdList:[],
  },

  onLoad(res) {
    var myDate = new Date();
    console.log(myDate.getTime())
    let that = this; 
    if(res.id){
      //通过分享的链接直接进入具体的文章页
      that.getContentByID(res.id);
    }
  },
  
  getContentByID: function (id){
    let that = this
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.nichuiniu.cn/wp-json/wp/v2/posts/' + id,
      header: {
        'content-type': 'application/json',
        'dataType': 'json'
      },
      success: function (res) {
        that.setData({
          title: res.data.title.rendered,
          // author: res.data.author,
          article: res.data.content.rendered.replace(/<p/g, '<p style="margin:0% 0% 5% 0%;" ').replace(/<h2/g, '<h2 style="display:none" ').replace(/<h1/g, '<h1 style="display:none" ').replace(/<br/g, '<p style="margin:0% 0% 5% 0%;" '),
          publish_date: res.data.date,
          id: res.data.id,
        });
        that.checkLocalUserList(res.data.author);
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        }
    })
  },
  checkLocalUserList(id){
    let that = this;
    let userList = wx.getStorageSync('userList');
    // console.log(userList)
    for ( var i = 0; i <userList.length; i++){
      if(userList[i].id==id){
        that.setData({
          author: userList[i].name,
        })
        wx.hideLoading()
        wx.hideNavigationBarLoading();
        break
      }
    }

    if(userList.length>0){
      var userInList = 0
      for (let i = 0, len = userList.length; i < len; i++) {
        if(userList[i].id==id){
          that.setData({
            author: userList[i].name,
          })
          wx.hideLoading()
          wx.hideNavigationBarLoading();
          userInList = 1
          break
        }
      }
      if(userInList == 0){
        that.getUserNameByID(id,userList)
      }
    }else{
      let userList = []
      that.getUserNameByID(id,userList)
    }
  },
  getUserNameByID(id,userList){
    let that = this;
    wx.request({
      url: 'https://www.nichuiniu.cn/wp-json/wp/v2/users/' + id,
      header: {
        'content-type': 'application/json',
        'dataType': 'json'
      },
      success: function (res) {
        var user = {id: id,name:res.data.name};
        userList.push(user);
        wx.setStorageSync('userList', userList);
        that.setData({
          author: res.data.name,
        });
        wx.hideLoading()
        wx.hideNavigationBarLoading();
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      path: '/pages/index/index' + '?id=' + this.data.id,
    }
  },

})
