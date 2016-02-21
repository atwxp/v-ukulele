<template>
    <section class="player">
        <header class="header">
            <div class="content">
                <h1 class="title">{{song.title}}</h1>
                <h3 class="author">{{song.author}}</h3>
            </div>
        </header>

        <div class="track" v-bind:class="paused ? '' : 'in'"></div>

        <div class="disk">
            <img v-bind:src="song.cover" class="cover" v-bind:class="paused ? 'in out' : 'in'">
        </div>

        <div class="process">
            <span class="used">{{currentTime | timeFormat 'mm:ss'}}</span>
            <span class="total">{{duration | timeFormat 'mm:ss'}}</span>
            <div class="process-bar" v-on:click="seeking($event)">
                <div class="loading-bar" style="width: {{loadper}};">
                </div>
                <div class="play-bar" style="width: {{playper}};"></div>
            </div>
        </div>
        
        <div class="controls">
            <span class="mode" v-on:click="toggleMode">
                <i class="ukulele-queue" title="列表循环" v-show="mode == 'queue'"></i>
                <i class="ukulele-loop" title="单曲循环" v-show="mode == 'loop'"></i>
                <i class="ukulele-random" title="随机播放" v-show="mode == 'random'"></i>
            </span>

            <span class="prev" v-on:click="prev"></span>
            <span class="play" v-bind:class="paused ? 'playing' : 'pause'" v-on:click="togglePlay"></span>
            <span class="next"  v-on:click="next"></span>

            <span class="like" v-on:click="expand=!expand">
                <i class="ukulele-like" title="赞"></i>
            </span>
        </div>
    </section>
</template>

<script>

    module.exports = {
        props: ['song', 'mode', 'paused', 'duration', 'currentTime', 'loadper', 'playper', 'expand'],

        data: function () {
            return {

            }
        },

        methods: {
            prev: function () {
                this.$dispatch('prev');
            },

            next: function () {
                this.$dispatch('next');
            },

            togglePlay: function () {
                if (this.song.title && this.song.author && this.duration) {
                    this.paused = !this.paused;
                }
                else {
                    this.$dispatch('load');
                    console.log('select first song');
                }
            },

            toggleMode: function () {
                var mode = ['queue', 'loop', 'random'];

                var i = mode.indexOf(this.mode);

                this.mode = i > -1 ? mode[(i + 1) % mode.length] : 'queue';
            },

            seeking: function (e) {
                this.currentTime = (e.offsetX ? e.offsetX : e.layerX ) / parseInt(window.getComputedStyle(e.currentTarget, null).width, 10) * this.duration;

                this.$dispatch('seeking');
            }
        }
    };
</script>

<style lang="less">
    @import '../util/reset.less';
    
    @-webkit-keyframes rotate {
        from {
            .transform(rotate(0));
        }
        to {
            .transform(rotate(360deg));
        }
    }
    @-moz-keyframes rotate {
        from {
            .transform(rotate(0));
        }
        to {
            .transform(rotate(360deg));
        }
    }
    @-o-keyframes rotate {
        from {
            .transform(rotate(0));
        }
        to {
            .transform(rotate(360deg));
        }
    }
    @keyframes rotate {
        from {
            .transform(rotate(0));
        }
        to {
            .transform(rotate(360deg));
        }
    }
    .player {
        position: relative;
        height: 100%;
        background: url(/v-ukulele/assets/img/bg.png) no-repeat center;
        -webkit-background-size: cover;
        background-size: cover;
        z-index: 1;

        .header {
            position: relative;
            z-index: 2;
            height: 60px;
            line-height: 60px;
            border-bottom: 1px solid rgba(255, 255, 255, .3);
            color: #fff;

            .content {
                margin: 0 50px;
                text-align: center;
                line-height: 1;
                .title {
                    .single-line();
                    padding: 14px 0 10px 0;
                    font-size: 16px;
                }
                .author {
                    .single-line();
                    font-weight: normal;
                    font-size: 13px;                
                    line-height: 1;
                }
            }
        }

        .track {
            position: absolute;
            left: 50%;
            top: 54px;
            margin-left: -75px;
            width: 150px;
            height: 150px;
            .transform(rotate(30deg));
            .transform-origin(50% 0);
            background: url(/v-ukulele/assets/img/track.png) no-repeat 0 0;
            -webkit-background-size: contain;
            background-size: contain;
            z-index: 1;
            .transition(transform .4s linear);
            &.in {
                .transform(rotate(5deg));
            }
        }

        .disk {
            margin: 60px auto 0;
            width: 200px;
            height: 200px;
            background: url(/v-ukulele/assets/img/coverall.png) no-repeat center;
            -webkit-background-size: 200px 200px;
            background-size: 200px 200px;
            .cover {
                width: 140px;
                height: 140px;
                border-radius: 50%;
                float: left;
                margin: 30px 0 0 30px;
                &.in {
                    .animation(rotate 8s infinite linear);
                }

                &.out {
                    animation-play-state: paused;
                }
            }
        }

        .process {
            position: absolute;
            bottom: 80px;
            width: 100%;
            .vertical-align(30px);
            color: #fff;
            .used {
                float: left;
                margin-left: 10px;
            }
            .total {
                float: right;
                margin-right: 10px;
            }
            .process-bar {
                height: 2px;
                background-color: rgba(0, 0, 0, 0.2);
                margin: 15px 60px 0;
                .loading-bar {
                    width: 0;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.4);
                }
                .play-bar {
                    position: relative;
                    width: 0;
                    height: 100%;
                    top: -100%;
                    background-color: #f47474;
                    &::before {
                        content: '';
                        position: absolute;
                        right: 0;
                        top: -4px;
                        .circle(10px);
                        background-color: #fff;
                    }
                    &::after {
                        content: '';
                        position: absolute;
                        .circle(4px);
                        background-color: #f47474;
                        right: 3px;
                        top: 50%;
                        margin-left: -2px;
                        margin-top: -2px;
                    }
                }
            }
        }

        .controls {
            position: absolute;
            bottom: 20px;
            width: 100%;
            .vertical-align(60px);
            .flexbox();
            text-align: center;

            > span {
                .flex(1);
                display: inline-block;
                width: 40px;
            }

            i::before {
                color: #fff;
                font-size: 20px;
                vertical-align: middle;
            }
            .ukulele-loop::before {
                content: '\e904';
            }
            .ukulele-queue::before {
                content: '\e903';
            }
            .ukulele-random::before {
                content: '\e905';
            }
            .ukulele-like::before {
                content: '\e902';
                font-size: 24px;
            }

            .prev {
                &::before {
                    content: '';
                    display: inline-block;
                    vertical-align: middle;
                    width: 3px;
                    height: 16px;
                    background-color: #fff;
                }
                &::after {
                    content: '';
                    display: inline-block;
                    vertical-align: middle;
                    .left-triangle(10px, #fff);
                    margin-left: -3px;
                }
            }
            .play {
                .flex(none);
                .circle(60px);
                border: 1px solid #fff;
                &::after {
                    content: '';
                    display: inline-block;
                    vertical-align: middle;
                }
                &.playing {
                    &::after {
                        .right-triangle(14px, #fff);
                        margin-left: 18px;
                    }
                }
                &.pause {
                    &::after {
                        .pause(5px, 15px, 3px, #fff);
                    }
                }
            }
            .next {
                &::before {
                    content: '';
                    display: inline-block;
                    margin-right: -3px;
                    .right-triangle(10px, #fff);
                    vertical-align: middle;
                }
                &::after {
                    content: '';
                    display: inline-block;
                    width: 3px;
                    height: 16px;
                    background-color: #fff;
                    vertical-align: middle;
                }
            }
        }
    }
</style>
