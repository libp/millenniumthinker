// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    author: '',
    id:'',
    total:1,
    page:1,
    categories:7,
    articleIdList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    let categories = parseInt(res.id);
    console.log(res)
    // this.getArticleIDList(this.data.page,categories);
  },

  getArticleIDList: function(page,categories){
    let that = this;
    let categories = categories
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.nichuiniu.cn/wp-json/wp/v2/posts?per_page=20&order=asc&_fields=id,title&page=' + page + '&categories=' + categories,
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
          console.log(that.data.articleIdList)
        }
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})