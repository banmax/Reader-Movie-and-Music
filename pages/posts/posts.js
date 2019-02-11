var postData = require('../../data/posts-data.js');

Page({
    /*页面的初始数据*/
    data: {

    },
    /*生命周期函数--监听页面加载*/
    onLoad: function () {
        
        // this.data.postList = postsData.postList
        this.setData({
            posts_key:postData.postList
        });
    },

    onPostTap: function (event) {
        var postId = event.currentTarget.dataset.postid;
        // console.log("on post id is" + postId);
        wx.navigateTo({
            url: "post-detail/post-detail?id=" +postId
        })
    }
})