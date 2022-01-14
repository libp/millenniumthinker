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
    articleList:[],
    end:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    this.data.categories = parseInt(res.id);
    this.getarticleList(this.data.page,this.data.categories);
    
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

  preview: function(e){
    // console.log(e.currentTarget.dataset.field)
    wx.navigateTo({
      url: '/pages/article/article'+'?id='+e.currentTarget.dataset.field,
    })
  },

  getarticleList: function(page,categories){
    console.log(page,categories)
    let that = this;
    wx.request({
      url: 'https://www.nichuiniu.cn/wp-json/wp/v2/posts?per_page=20&orderby=id&order=asc&_fields=id,title&page=' + page + '&categories=' + categories,
      header: {
        'content-type': 'application/json',
        'dataType': 'json'
      },
      success: function (res) {
        that.data.total = parseInt(res.header['X-WP-TotalPages'])
        that.data.articleList = that.data.articleList.concat(res.data)
        console.log(that.data.articleList)
        that.setData({
          articleList: that.data.articleList,
          page: that.data.page + 1
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.page<=this.data.total){
      this.getarticleList(this.data.page,this.data.categories);
    }else{
      this.setData({
        end:true
      })
    }
  },


})