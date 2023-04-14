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
    <div>
        <VueUeditorWrap :config="config" v-model="content" @ready="onReady" :init="onInit"></VueUeditorWrap>
    </div>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap';

    export default {
        name: 'ueditor',
        components: {VueUeditorWrap},
        props: {
            id: {
                type: String,
                default: 'ueditor'
            },
            value: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'web'
            },
            height: {//高度
                type: Number,
                default: 240
            },
            width: { //宽度
                type: [String, Number],
                default: '100%'
            },
            autoHeight: {
                type: Boolean,
                default: false
            },
            autoSave: {
                type: Boolean,
                default: false
            },
            maxWords: {
                type: Number,
                default: 65534
            },
            toolbars: {
                type: Array,
                default: () => {
                    return [['fullscreen', 'source', 'preview', '|', 'bold', 'italic', 'underline', 'strikethrough', 'forecolor', 'backcolor', '|',
                        'justifyleft', 'justifycenter', 'justifyright', '|', 'insertorderedlist', 'insertunorderedlist', 'blockquote', 'emotion',
                        'link', 'removeformat', '|', 'rowspacingtop', 'rowspacingbottom', 'lineheight', 'indent', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol',
                        'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|', 'anchor', 'map', 'drafts']];
                },
            }
        },
        data() {
            return {
                editor: null,
                content: '',
                config: {
                    serverUrl: false,
                    UEDITOR_HOME_URL: '/static/dist/ueditor/',
                    toolbars: this.toolbars,
                    autoHeightEnabled: this.autoHeight,
                    initialFrameHeight: this.height,
                    initialFrameWidth: this.width,
                    enableAutoSave: this.autoSave,
                    maximumWords: this.maxWords
                }
            };
        },

        watch: {
            content() {
                this.$emit('input', this.content);
            },
            value(newValue) {
                if (this.editor) {
                    if (this.content !== newValue) {
                        this.content = newValue;
                    }
                }
            },
        },

        methods: {
            // 准备
            onReady(editor) {
                this.editor = editor;
                if (this.value) {
                    this.content = this.value;
                    this.editor.setContent(this.value);
                }
            },

            // 初始化
            onInit() {
                // TODO likexin 注册图片选择器
                // TODO likexin 注册视频选择器
            },

            // 设置编辑器内容
            setEditorContent() {
                this.setContentTimer1 = setInterval(() => {
                    if (this.editor && typeof (this.value) !== 'undefined') {
                        this.content = this.value;
                        clearInterval(this.setContentTimer1);
                    }
                }, 10);
            },
        },

        mounted() {
            this.$nextTick(() => {
                this.setEditorContent();
            });
        }
    };
</script>

<style scoped>

</style>