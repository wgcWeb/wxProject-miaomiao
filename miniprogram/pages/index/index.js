// miniprogram/pages/index.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [
      'https://yuehui1.nosdn.127.net/images/cms/20181018/20181018160152598E5w.png', 
      'https://yuehui1.nosdn.127.net/images/cms/20180803/20180803141353938laf.jpg', 
      'https://yuehui1.nosdn.127.net/images/cms/20181022/20181022101915616DK1.png'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    circular: true,

    listData: [],
    current: 'links'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  handleLinks(e){
    let id = e.target.dataset.id;
    wx.cloud.callFunction({
      name: 'update',
      data: {
        collection: 'users',
        doc: id,
        data: "{links: _.inc(1)}"
      }
    }).then(res => {
      console.log(res);
      let updated = res.result.stats.updated;
      if(updated){
        let cloneListData = [...this.data.listData];
        for(let i = 0; i < cloneListData.length; i++){
          if(cloneListData[i]._id == id){
            cloneListData[i].links++;
          }
        }
        this.setData({
          listData: cloneListData
        })
      }
    })
  },

  handleCurrent(e){
    let current = e.target.dataset.current;
    if(current == this.data.current){
      return false;
    }
    this.setData({
      current: current
    })
  },

  getListData(){
    db.collection('users').field({
      userPhoto: true,
      nickName: true,
      links: true
    })
    // 按links排序
    .orderBy(this.data.current, 'desc')
    .get().then(res => {
      this.setData({
        listData: res.data
      })
    })
  },

  handleDetail(e){
    let id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?userId=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getListData()
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