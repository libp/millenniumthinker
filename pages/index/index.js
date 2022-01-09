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
    let value = wx.getStorageSync('not_prompt_load');
    let articleIdList = wx.getStorageSync('articleIdList');
    if (!value) {
      that.showModal();
    };
    if(res.id){
      //通过分享的链接直接进入具体的文章页
      that.getContentByID(res.id);
    }else if (articleIdList) {
      //本地已经缓存所有文章ID
      let luckyday = parseInt((new Date()).getTime()/1000/24/60/60)%articleIdList.length
      that.getContentByID(articleIdList[luckyday]);
      wx.setNavigationBarTitle({
        title: '今日推荐 - 千年思想家'
      })
    }else {
      that.getArticleIDList(that.data.page);
      wx.setNavigationBarTitle({
        title: '今日推荐 - 千年思想家'
      })
    }
  },
  getArticleIDList: function(page){
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.nichuiniu.cn/wp-json/wp/v2/posts?categories=7,8&per_page=100&order=asc&_fields=id&page=' + page,
      header: {
        'content-type': 'application/json',
        'dataType': 'json'
      },
      success: function (res) {
        that.data.total = parseInt(res.header['X-WP-TotalPages'])
        that.data.page += 1
        // articleIdList 不需要输出到视图层，所以不需要使用setdata方法保存参数
        for (let i = 0, len = res.data.length; i < len; i++) {
          that.data.articleIdList.push( res.data[i].id);
        }
        if(that.data.page<=that.data.total){
          that.getArticleIDList(that.data.page)
        }else { 
          wx.setStorageSync('articleIdList', that.data.articleIdList)
          that.data.articleIdList.sort(function(a, b){return a - b})
          // 根据今天的日期推荐一篇文章
          let d = new Date();
          console.log(d.getTime())
          let luckyday = parseInt(d.getTime()/1000/24/60/60)%that.data.articleIdList.length
          that.getContentByID(that.data.articleIdList[luckyday]);
        }
      }
    })
  },
  getluckyday:function() {
    let articleIdList = wx.getStorageSync('articleIdList');
    let randID = Math.ceil(Math.random()*articleIdList.length)
    return articleIdList[randID]
  },
  onPullDownRefresh: function () {
    this.getContentByID(this.getluckyday());
    wx.setNavigationBarTitle({
      title: '千年思想家'
    });
    // 停止下拉动作  
    wx.stopPullDownRefresh();
  },
  
  nextRandom: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1
    })
    this.getContentByID(this.getluckyday());
    wx.setNavigationBarTitle({
      title: '千年思想家'
    });
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
        if(res.data.author==2){
          res.data.author = '任正非'
        }else if(res.data.author==3){
          res.data.author = '毛泽东'
        }
        that.setData({
          title: res.data.title.rendered.split('_')[1],
          author: res.data.author,
          article: res.data.content.rendered,
          publish_date: res.data.title.rendered.split('_')[0],
          id: res.data.id,
        });
        wx.hideLoading()
        wx.hideNavigationBarLoading();
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.title,
      path: '/pages/index/index' + '?id=' + this.data.id,
    }
  },
  showModal: function () {
    wx.showModal({
      content: '下拉刷新，精选推荐',
      showCancel: false,
      confirmText: '知道了',
      success: function (res) {
        if (res.confirm) {
          wx.setStorage({
            key: "not_prompt_load",
            data: "true",
          })
        }
      }
    })
  },
})
