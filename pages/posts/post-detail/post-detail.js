var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({
    data:{
        isPlayingMusic:false
    },
    onLoad:function(option){
        var globalData = app.globalData
        var postId = option.id;
        // console.log(postId);
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        // console.log(postData);
        // this.data.postData = postData;
        this.setData({
            postData:postData
        })

        var postsCollected = wx.getStorageSync('posts_collected');
        if(postsCollected) {
            var postsCollected = postsCollected[postId];
            this.setData({
                collected: postsCollected
            })
        }
        else{
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        if (app.globaData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
            // this.data.isPlayingMusic = true;
            this.setData({
                isPlayingMusic : true
            })
        }
        this.setMusicMonitor();
    },


    setMusicMonitor:function() {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic : true
            })
            app.globaData.g_isPlayingMusic = true;
            app.globaData.g_currentMusicPostId = that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic : false
            })
            app.globaData.g_isPlayingMusic = false;
            app.globaData.g_currentMusicPostId = null;
        });
    },

    onCollectionTap:function (event) {
        // this.getPostsCollectedSyc();
        this.getPostsCollectedAsy();
    },

    getPostsCollectedAsy(){
        var that = this;
        wx.getStorage({
            key:"posts_collected",
            success:function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                // 收藏变成未收藏，未收藏变成收藏
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);
            }
        });
    },

    getPostsCollectedSyc:function(event){
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        //收藏、未收藏之间切换
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected,postCollected);
    },

    showModal:function(postsCollected,postCollected){
        var that = this;
        wx.showModal({
            title:"收藏",
            content: postCollected?"收藏该文章?":"取消收藏该文章?",
            showCancel:"true",
            cancelText:"取消",
            cancelColor:"#333",
            confirmText:"确认",
            confirmColor:"#405f80",
            success:function (res) {
                if(res.confirm){
                    //更新文章是否的缓存值
                    wx.setStorageSync('posts_collected', postsCollected);
                    //更新数据绑定变量，从而实现切换图片
                    that.setData({
                        collected:postCollected
                    })
                }
            }
        })
    },
    showToast:function(postsCollected,postCollected){
        //更新文章是否的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据绑定变量，从而实现切换图片
        this.setData({
            collected:postCollected
        })
        wx.showToast({
            title: postCollected?'收藏成功':'取消成功',
            duration:1000,
            icon:'success'
        })
    },

    onShareTap:function (event) {
        var itemList = [
            "微信好友",
            "朋友圈",
            "QQ",
            "微博"
        ]
        wx.showActionSheet({
            itemList: itemList,
            itemColor:"#405f80",
            success:function (res) {
                // res.cancel 用户不是点击了取消按钮
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title:"用户分享到了"+itemList[res.tapIndex],
                    content:"用户是否取消？"+res.cancel+"现在还无法实现分享功能"
                })
            }
        })
    },

    onMusicTap:function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic:false
            })
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
            })
            this.setData({
                isPlayingMusic:true
            })
        }
    }
})