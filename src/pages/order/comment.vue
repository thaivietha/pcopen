/**
 * 开店星公众版
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <Container>
        <div class="breadcrumd-css">
            <Breadcrumbs :list="list"></Breadcrumbs>
        </div>
        <div style="background: #ffffff">
            <div class="goods-info">
                <ul class="goods">
                    <li class="flex title">
                        <div>商品信息</div>
                        <div>购买件数</div>
                        <div>实付款</div>
                    </li>
                    <div class="goosItem">
                        <li class="flex">
                            <div class="flex" style="justify-content: flex-start">
                                <div class="goods-img ">
                                    <img :src="$utils.mediaUrl(goods_info.thumb)">
                                </div>
                                <div style="text-align: left" class="goods-msg">
                                    <p class="line2">{{ goods_info.title }}</p>
                                    <p class="info"> {{ goods_info.option_title || '默认' }}</p>
                                </div>
                            </div>
                            <div class="goods-msg">
                                <span class="cart-num">{{ goods_info.total }}</span>
                            </div>
                            <div>￥{{ goods_info.price }}</div>
                        </li>
                    </div>
                </ul>
            </div>
        </div>
        <div class="refund-box">
            <div class="box">
                <div class="box-item flex">
                    <div class="box-title">评分</div>
                    <div class="rate">
                        <Rate v-model="valueCustomText">
                            <span style="color: #f5a623">{{ valueCustomText }}</span>
                        </Rate>
                    </div>
                </div>
                <div class="box-item flex">
                    <textarea v-model="refundRemark" placeholder="宝贝满足你的期待吗？快来评论" maxlength="100"
                              class="textarea"></textarea>
                </div>

                <div class="box-item flex" style="margin-top: 20px">
                    <div class="box-title">快来晒图</div>
                    <div class="flex" style="margin-left: 30px">
                        <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index"
                             style="width: 86px;height: 86px">
                            <template v-if="item.status === 'finished'">
                                <div style="width:86px;height:86px;">
                                    <img style="width:86px;height:auto;display: block"
                                         :src="$utils.mediaUrl(item.response.path)">
                                </div>
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(item.response.path)"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                </div>
                            </template>
                            <template v-else>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template>
                        </div>
                    </div>
                    <Upload
                        v-if="defaultList.length < 4"
                        ref="upload"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="5120"
                        :data="{type:10}"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        :headers="headers"
                        multiple
                        type="drag"
                        :action="action"
                        style="display: inline-block;width:86px;">
                        <div style="width: 86px;height:86px;line-height: 86px;">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                </div>
            </div>
        </div>
        <div class="flex" style="justify-content: flex-end;background-color: #ffffff;padding: 20px">
            <Button @click="submit" size="large" type="error">发布评价</Button>
        </div>

        <Modal title="预览" v-model="visible">
            <img :src="$utils.mediaUrl(imgName)" v-if="visible" style="width: 100%">
        </Modal>
    </Container>

</template>

<script>
import orderApi from '@/api/order'

export default {
    name: "refund",
    data() {
        return {
            list: [{
                name: '首页',
                path: '/'
            }, {
                name: '我的订单',
                path: '/member/order'
            }, {
                name: '商品评价',
            }],
            refundRemark: '',
            goods_info: [],
            refund_info: '',
            refund_price: {},
            refund_type: {},
            defaultList: [],
            imgName: '',
            visible: false,
            refundImgList: [],
            uploadList: [],
            valueCustomText: 0
        }
    },
    created() {
        this.getCommentData()
    },

    methods: {
        submit() {
            if (this.valueCustomText === 0) {
                this.$Message.error('请选择评价等级');
                return;
            }
            if (this.refundRemark == '' || this.refundRemark.length <= 0) {
                this.$Message.error('请填写商品评价');
                return
            }
            let images = []
            this.uploadList.forEach(item => {
                images.push(item.response.path)
            })
            orderApi.submitComment({
                order_goods_id: this.$route.query.id,
                level: this.valueCustomText,
                content: this.refundRemark == '' || this.refundRemark.length <= 0 ? '此用户没有填写评价' : this.refundRemark,
                images: images,
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.$Message.success('评价成功');
                    if(this.$route.query.back){
                        setTimeout(() => {
                            this.$router.go(-2)
                        }, 1200)
                    }else{
                        setTimeout(() => {
                            this.$router.go(-1)
                        }, 1200)
                    }

                }
            })

        },
        getCommentData() {
            if (!this.$route.query.id) return
            orderApi.getCommentGoods({
                order_goods_id: this.$route.query.id
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error != 0) return
                    this.goods_info = res.goods
                }
            })
        },
        handleView(name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove(file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess(res, file, fileList) {
            console.log(res, file)
            if (res.error == -1) {
                this.$Message.error(res.message);
                // this.$refs.upload.clearFiles()
                this.uploadList.length--
                // eslint-disable-next-line no-empty

            }
            if (res.error === 0) {
                console.log(fileList, '上传后')

            }


            // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        },
        handleFormatError(file) {
            this.$Message.warning('格式错误:请检查文件' + file.name + ' 是否是jpg、jpeg、png格式')
        },
        handleMaxSize(file) {
            this.$Message.warning('文件超出指定大小:' + file.name + '最大不超过5M.')
        },
        handleBeforeUpload(file) {
            console.log(file)
            const check = this.uploadList.length < 3;
            if (!check) {
                this.$Message.warning('最多可以上传3张图片');
            }
            // return false;
            return check;
        }
    },
    computed: {
        action() {
            let url = '/h5/api/utility/attachment/upload'
            if (process.env.NODE_ENV === "development") url = '/api/utility/attachment/upload' //开发环境
            return url
        },
        headers() {
            let id = JSON.parse(localStorage.getItem('userSessionId'))
            let headers = {
                'Session-Id': id.session_id,
                'Client-Type': 70
            }
            return headers
        }
    },
    mounted() {
        this.uploadList = this.$refs.upload.fileList;
    },
}
</script>

<style scoped lang="scss">

.common-title {
    padding: 18px 22px;
    font-size: 18px;
    color: #282828;
    background-color: #FFFFFF;
    border-bottom: 1px dashed #cecece;
}

.goods-info {
    background-color: #FFFFFF;

    ul {
        padding: 2px 22px 22px;
        font-size: 16px;
        color: #282828;
        padding-top: 20px;

        .goosItem {
            li > div {
                padding: 10px 0;
                border-left: 1px solid #ececec;
            }
        }

        li {
            border: 1px solid #ececec;

            &.title {
                line-height: 36px;
                font-size: 14px;
                font-weight: bold;
                background-color: #ececec;

                > div {
                    justify-content: center;
                }
            }

            > div {
                text-align: center;
                flex-shrink: 0;
                display: flex;
                justify-content: center;
                align-items: center;

            }

            > div:nth-child(1) {
                width: 640px;
            }

            > div:nth-child(2) {
                width: 260px;
            }

            > div:nth-child(3) {
                flex: 1;
            }

            .goods-img {
                margin-left: 20px;
                margin-right: 20px;

                img {
                    min-width: 86px;
                    height: 86px;
                    display: block;
                }
            }

            .goods-msg {
                > p {
                    font-size: 16px;
                    color: #282828;
                    margin-bottom: 10px;
                }

                .info {
                    font-size: 12px;
                    color: #aaa;
                    margin-top: 4px;

                    .cart-num {
                        color: $theme-color;
                    }
                }
            }

            .price {
                margin-top: 10px;
                font-size: 14px;
                color: #919191;

                del {
                    margin-left: 12px;
                    font-size: 14px;
                    color: #919191;
                    position: relative;
                    top: 1px
                }
            }

            .money {
                color: $theme-color;
            }

        }
    }

    > .info {
        border-top: 1px dashed #cecece;
    }

}

.refund-box {
    background-color: #ffffff;
    //overflow: hidden;
    padding: 0 20px 20px;

    .box {
        border: 1px solid #ececec;
        padding: 20px;

        .box-item {
            margin-bottom: 20px;

            .box-title {
                font-size: 18px;
                line-height: 32px;
            }

            .rate {
                margin-left: 25px;
            }

            .textarea {
                width: 100%;
                height: 120px;
                background-color: #f7f7f7;
                border: 0;
                outline: none;
                resize: none;
                padding: 12px 14px;

            }
        }
    }
}


.demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
}

.demo-upload-list img {
    width: 100%;
    height: 100%;
}

.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}

.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>