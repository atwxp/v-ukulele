<template>
    <div class="song-album">
        <ul>
            <li v-for="song in albums" class="song" v-bind:class="[song.id == playId? 'ukulele-cur' : '']" v-on:click="switchSong(song.id)">
                <span class="info">{{song.author}} - {{song.title}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    module.exports = {
        props: ['albums', 'playId', 'expand'],

        data: function () {
        },

        methods: {
            switchSong: function (id) {
                this.playId = id;
                this.expand = false;
            }
        }
    };
</script>

<style lang="less">
    @import '../util/reset.less';

    .song-album {
        counter-reset: songnum;
        background-color: #fff;
        color: #7c848c;
        font-size: 13px;
        .song {
            border-bottom: 1px solid #e0e0e0;
            .bottom-1px(#e0e0e0);
            margin-left: 30px;
            padding-right: 15px;
            .vertical-align(56px);

            &::before {
                float: left;
                margin-left: -20px;
                counter-increment: songnum;
                content: counter(songnum);
            }

            &.ukulele-cur {
                &::before {
                    content: '\e900';
                    color: #f47474;
                }
            }

            .time {
                float: right;
            }
        }
    }
</style>
