<template>
    <div>
        <v-player :song="song" :expand.sync="expand" :mode.sync="mode" :paused.sync="paused" :duration="duration" :current-time.sync="currentTime" :playper="playper" :loadper="loadper"></v-player>

        <section class="song-list" v-bind:class="expand ? 'expand' : ''">
            <v-song-list :albums="albums" :play-id.sync="playId" :expand.sync="expand" ></v-song-list>
        </section>
        <div class="mask" v-bind:class="expand ? 'expand' : ''" v-on:click="expand=!expand"></div>

        <audio id="ukulele" v-on:durationchange="durationchange" v-on:timeupdate="timeupdate" v-on:progress="progress" v-on:ended="ended" v-on:canplay="canplay"  v-on:playing="playing" v-on:waiting="waiting" v-on:seeking="seeking" v-on:seeked="seeked" v-on:loadeddata="loadedata"></audio>
    </div>
</template>

<script>
    var config = require('./config');

    module.exports = {
        data: function () {
            return {
                player: null,

                albums: [],
                format: '',

                song: {
                    title: '',
                    author: ''
                },
                expand: false,
                mode: 'queue',
                duration: 0,
                currentTime: 0,
                playper: 0,
                paused: true,
                playId: null,
                loadper: 0
            }
        },

        components: {
            'v-player': require('./components/player'),
            'v-song-list': require('./components/song-list')
        },

        watch: {
            paused: function (isPaused) {
                console.log(isPaused)
                if (this.playId) {
                    isPaused ? this.player.pause() : this.player.play();
                }
            },

            playId: function (id) {
                this.load(id);
            },

            mode: function (m) {
                this.player.loop = (m === 'loop');
            }
        },

        compiled: function () {
            // 通过ajax或者其他方式异步获取列表
            this.getSong();

            this.player = document.querySelector('#ukulele');

            if (this.player.canPlayType('audio/mp3')) {
                this.format = '.mp3';
            }

            else if (this.player.canPlayType('audio/ogg')) {
                this.format = '.ogg';
            }
        },

        methods: {
            getSong: function (id) {
                var ret = [];

                config.albums.forEach(function (id) {
                    ret.push(config.songbook[id]);
                });

                this.albums = ret;
            },

            load: function (id) {
                if (!this.format) {
                    console.log('do not support audio');
                    return;
                }

                if (!this.albums) {
                    console.log('loading albums list');
                }

                if (id) {

                    this.song = this.albums.filter(function (sg) {
                        return sg.id == id;
                    })[0];
                }
                else {
                    this.song = this.albums[0];
                }

                this.player.src = this.song.url + this.format;

                this.player.load();
            },

            // 媒体元素开始请求媒体内容的时候触发
            // networkState: NETWORK_LOADING
            loadstart: function () {
                console.log('start to load audio');
            },

            // 音频的时长数据发生变化触发, 初始是NaN
            durationchange: function () {
                console.log('durationchange', this.player.duration);

                this.duration = this.player.duration;
            },

            // 媒体元数据加载完成，可以获取到媒体的时长
            // readyState: HAVE_METADATA
            loadedmetadata: function () {
                console.log('loadedmetadata', this.player.duration);
            },

            // 当前播放位置的媒体内容首次加载完毕
            // readyState: HAVE_CURRENT_DATA
            loadeddata: function () {
                console.log('loadeddata');
            },

            // 正在通过网络加载媒体内容, 返回 audio.buffered 对象
            // networkState: NETWORK_LOADING
            progress: function () {
                if (this.player.seekable && this.player.seekable.length > 0) {
                    var buffered = (this.player.buffered == undefined)
                        ? 0
                        : this.player.buffered.end(this.player.buffered.length - 1);

                    this.loadper = (100 / (this.player.duration || 1) * buffered) + '%';
                }
            },

            // 可以开始播放, 但是可能会暂停去缓冲更多数据
            // readyState: HAVE_ENOUGH_DATA
            canplay: function () {
                this.player.play();

                this.paused = this.player.paused;

                console.log('canplay');
                // removeLoading
            },

            // 所有媒体内容加载完毕，可以流畅播放
            // readyState: CAN_PLAY_THROUGH
            canplaythrough: function () {
                console.log('canplaythrough');
            },

            // currentTime属性发生改变 
            timeupdate: function () {
                this.currentTime = this.player.currentTime;
console.log('timeupdate')
                this.playper = this.currentTime && this.duration
                    ? this.currentTime / this.duration * 100 + '%'
                    : 0;
            },

            // 暂停或者在缓冲后准备重新开始播放时触发
            // playing VS play 的区别，前者强调媒体开始播放（包括第一次播放，暂停后播放，结束重新播放），后者则是因为 pause 事件恢复播放
            playing: function () {
                console.log('playing');
            },

            // seek operation begins
            seeking: function () {
                console.log('seeking');
                this.playper = this.currentTime && this.duration
                    ? this.currentTime / this.duration * 100 + '%'
                    : 0;
            },

            // seek operation done
            seeked: function () {
                console.log('seeked');
            },

            // 播放结束
            ended: function () {
                console.log('ended');

                this.paused = true;

                this.$emit('next');
            },

            // 音量发生改变
            volumechange: function () {

            },

            // 在刚开始播放或者因为缓冲下一帧停止时都会触发
            waiting: function () {
                // addloading
                console.log('waiting');
            }
        },

        events: {
            load: function (id) {
                this.load(id);
            },

            prev: function () {
                console.log('parent prev');

                if (this.mode === 'random') {
                    this.playId = config.albums[parseInt(Math.random() * config.albums.length, 10)];
                }
                else {
                    var i = config.albums.indexOf(this.playId);

                    this.playId = config.albums[(i - 1) < 0 ? config.albums.length - 1 : i - 1];
                }

                this.paused = true;

                this.load(this.playId);
            },

            next: function () {
                console.log('parent next');
                if (this.mode === 'random') {
                    this.playId = config.albums[parseInt(Math.random() * config.albums.length, 10)];
                }
                else {
                    var i = config.albums.indexOf(this.playId);
                    
                    this.playId = config.albums[(i + 1) % config.albums.length]
                }

                this.paused = true;

                this.load(this.playId);
            },

            seeking: function () {
                this.player.currentTime = this.currentTime;
                console.log(this.player.seekable)
            }
        }
    };
</script>

<style lang="less">
    @import './util/reset.less';
    #app {
        position: relative;
        height: 100%;
        overflow: hidden;
    }

    .song-list {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        overflow-y: auto;
        .transform(translate3d(100%, 0, 0));
        .transition(all .4s);
        z-index: 3;
        &.expand {
            .transform(translate3d(0%, 0, 0));
        }
        .song-album {
            height: 100%;
        }
    }

    .mask {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .4);
        z-index: 2;
        opacity: 0;
        visibility: hidden;
        .transition(opacity .2s);
        &.expand {
            opacity: 1;
            visibility: visible;
        }
    }


</style>
