// components/search/search.js
const app = getApp()
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'apply-shared'
  },
   properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    history: [],
    searchList: [],
    searchValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus(){
      wx.getStorage({
        key: 'searchHistory',
        success:(res)=>{
         this.setData({
           history: res.data
         })
        }
      })
      this.setData({
        isFocus: true
      })
    },
    handleCancel(){
      this.setData({
        isFocus: false,
        searchValue: ''
      })
    },
    handleConfirm(e){
      // console.log(e.detail.value);
      let value = e.detail.value;
      let cloneHistory = [...this.data.history]
      cloneHistory.unshift(value)
      wx.setStorage({
        data: [...new Set(cloneHistory)],
        key: 'searchHistory',
      })
      this.changeSearchList(value)
    },
    handleDel(){
     wx.removeStorage({
       key: 'searchHistory',
       success:(res)=>{
         this.setData({
           history: []
         })
       }
     })
    },
    changeSearchList(value){
      db.collection('users').where({
        nickName: db.RegExp({
          regexp: value,
          options: 'i',
        })
      }).field({
        userPhoto: true,
        nickName: true
      }).get().then(res => {
        this.setData({
          searchList: res.data
        })
      })
    },
    handleHistoryItemDel(e){
      let value = e.target.dataset.text
      this.setData({
        searchValue: value
      }, ()=> {
        this.changeSearchList(value)
      })
      
    }
  }
})
