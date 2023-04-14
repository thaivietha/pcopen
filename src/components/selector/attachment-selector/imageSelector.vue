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
    <Button type="dashed" @click="addImage">点击选择图片</Button>

    <Modal
        class="image-selector"
        title="图片选择器"
        v-model="showModel"
        @on-ok="modelOk"
        @on-cancel="modelCancel"
        :mask-closable="false"
        :width="1000"
        :loading="loading"
    >

      <div class="image-selector-modal">
        <!-- 附件分组 Start -->
        <div class="group">
          <Poptip title="添加分组" placement="bottom" v-model="group.add.show" @on-popper-hide="addGroupCancel">
            <Button class="default-primary btn-add">+添加分组</Button>
            <template #content>
              <div class="group-add-input">
                <Input v-model="group.add.name" placeholder="请输入分组名称" :maxlength="10"/>
              </div>
              <div class="group-add-button">
                <ButtonGroup>
                  <Button @click.s.stop="addGroupCancel">取消</Button>
                  <Button type="primary" :disabled="group.add.name===''" @click.s.stop="addGroupOk">确认</Button>
                </ButtonGroup>
              </div>
            </template>
          </Poptip>
          <ul>
            <li v-for="(row, index) in group.list" v-bind:key="index" @click="switchGroup(row.id)"
                :class="{active: group.activeId === row.id, is_default: row.is_default}">
              <span class="title" v-text="row.name"></span>
              <span class="num" v-text="row.num"></span>
              <span class="option">
                <span class="option-btn" @click.stop="editGroup(row.id, row.name)">编辑</span>
                <Poptip title="编辑分组" width="190" placement="bottom" @on-popper-hide="editGroupCancel"
                        :value="row.id === group.edit.id">

                  <template #content>
                    <div class="group-add-input">
                      <Input v-model="group.edit.name" placeholder="请输入分组名称" :maxlength="10"/>
                    </div>
                    <div class="group-add-button">
                      <ButtonGroup>
                        <Button @click.s.stop="editGroupCancel">取消</Button>
                        <Button type="primary" :disabled="group.edit.name===''" @click.stop="editGroupOk">确认</Button>
                      </ButtonGroup>
                    </div>
                  </template>
                </Poptip>
                <span class="option-btn default">|</span>
                <Poptip title="确定删除此分组？" width="190" placement="bottom" confirm @on-ok="deleteGroup(row.id)">
                  <span class="option-btn">删除</span>
                </Poptip>
              </span>
            </li>
          </ul>
        </div>
        <!-- 附件分组 End -->

        <!-- 附件列表 Start -->
        <div class="image-content">
          <div class="image-head">

            <!-- 附件列表 Upload -->
            <Button type="primary"
                    :loading="image.uploading"
                    @click="$refs['upload_input'].click()"
            >{{ getUploadBtnText }}
            </Button>
            <input ref="upload_input" type="file" :accept="limitFileType" multiple class="display-none"
                   @change="addImageChangeFile"/>
            <span class="tips">大小不要超过10M <Icon type="ios-help-circle"/></span>

            <!-- 附件列表 Search -->
            <Input class="width-175 margin-right-20" placeholder="输入名称进行过滤" v-model="searchFields.keywords"
                   :search="true" @on-search="getImageList"/>
            <DatePicker
                type="daterange"
                placement="bottom-end"
                format="yyyy-MM-dd"
                placeholder="选择后过滤上传日期"
                class="width-215"
                :confirm="true"
                @on-change="searchFields.date = $event"
                @on-ok="getImageList"
                @on-clear="getImageList"/>
          </div>
          <div class="image-list">

            <!-- 附件列表 Empty -->
            <span v-show="image.list.length === 0" class="empty-list">
              <Icon type="ios-paper-outline"/>
              <span>暂无数据</span>
            </span>

            <!-- 附件列表 Image -->
            <ul>
              <li v-for="(row, index) in image.list" v-bind:key="index" @click="switchImage(index)"
                  :class="{active: row.checked}">
                <span class="img">
                  <img :src="row.url"/>
                  <span class="delete" @click.stop="deleteImage(row.id)">
                    <Icon type="ios-close-circle"/>
                  </span>
                  <span class="info" v-if="row.extend">{{ row.extend.width }} x {{ row.extend.height }}</span>
                  <span class="active-layer" v-if="row.checked">
                    <Icon type="md-checkmark-circle"/>
                  </span>
                </span>
                <span class="text" v-text="row.name"></span>
              </li>
            </ul>
          </div>
          <div class="image-foot">

            <!-- 附件列表 Multi Delete -->
            <Poptip title="确定删除选中图片？" placement="top" confirm @on-ok="deleteImage(false)">
              <Button class="default-primary btn-add" :disabled="!selectedImageNum">
                <span>删除选中</span>
                <span v-show="selectedImageNum">({{ selectedImageNum }})</span>
              </Button>
            </Poptip>

            <!-- 附件列表 Pager -->
            <Page size="small"
                  :total="image.count"
                  :current="image.page"
                  :page-size="image.pageSize"
                  show-total
                  show-elevator
            />
          </div>
        </div>
        <!-- 附件列表 End -->
      </div>

    </Modal>
  </div>
</template>

<script>
import groupApi from "../../../api/attachment/group";
import attachmentApi from "../../../api/attachment";
import util from "../../../util/util";
import attachment from "../../../util/attachment";

export default {
  name: "imageSelector",
  props: {
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },

    // 最大数量
    max: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {
      // 是否显示
      showModel: true,

      // 附件选择器类型
      type: 10,

      // 加载中
      loading: false,

      // 搜索字段
      searchFields: {
        keywords: '',
        date: '',
      },

      // 附件分组
      group: {
        activeId: '',
        list: [],
        // 分组添加
        add: {
          show: false,
          name: '',
        },
        // 分组编辑
        edit: {
          id: 0,
          name: '',
        },
      },

      // 图片
      image: {
        list: [],
        page: 1,
        pageSize: 10,
        count: 0,
        uploading: false,
        uploadNum: {
          current: 0,
          total: 0,
        }
      },

      // TODO likexin 参数
      settings: {
        maxSize: 1024,
      }
    }
  },
  computed: {

    // 选中图片数量
    selectedImageNum() {
      let num = 0
      this.image.list.forEach((item) => {
        if (item.checked) {
          num++;
        }
      });
      return num
    },

    // 选中图片ids
    selectedImageIds() {
      let ids = []
      this.image.list.forEach((item) => {
        if (item.checked) {
          ids.push(item.id)
        }
      });
      return ids
    },

    // 获取上传按钮文字
    getUploadBtnText() {
      if (!this.image.uploading) {
        return '+上传图片'
      }
      return '正在上传(' + this.image.uploadNum.current + '/' + this.image.uploadNum.total + ')'
    },

    // 文件限制类型
    limitFileType() {
      return ''
    },
  },
  methods: {
    // 添加图片
    addImage() {
      this.showModel = true;
    },

    // 确认选择
    modelOk: () => {

    },

    // 取消选择
    modelCancel: () => {

    },

    // 添加分组-确认
    addGroupOk() {
      groupApi.add({
        type: this.type,
        name: this.group.add.name,
      }, {
        success: () => {
          // 重置添加分组信息
          this.addGroupCancel()

          // 重新加载分组列表
          this.getGroupList(true)
        }
      })
    },

    // 添加分组-取消
    addGroupCancel() {
      this.group.add.show = false
      this.group.add.name = ''
    },

    // 编辑分组
    editGroup(id, name) {
      this.group.edit.name = name
      this.group.edit.id = id
    },

    // 编辑分组-确认
    editGroupOk() {
      groupApi.edit({
        type: this.type,
        id: this.group.edit.id,
        name: this.group.edit.name,
      }, {
        success: () => {
          // 重置添加分组信息
          this.editGroupCancel()

          // 重新加载分组列表，编辑名称不需要重新加载图片
          this.getGroupList(false)
        }
      })
    },

    // 编辑分组-取消
    editGroupCancel() {
      this.group.edit.name = ''
      this.group.edit.id = 0
    },

    // 删除分组
    deleteGroup(id) {
      groupApi.delete({
        type: this.type,
        id: id,
      }, {
        success: () => {
          // 如果删除的是激活的，将激活ID置为all
          if (id === this.group.activeId) {
            this.group.activeId = ''
          }

          // 重新加载分组列表，如果当前删除的是激活的，重新加载图片列表
          this.getGroupList(id === this.group.activeId)
        }
      })
    },

    // 切换分组
    switchGroup(id) {
      if (this.group.activeId === id) {
        return
      }

      this.group.activeId = id;

      // 重置右侧筛选项
      this.searchFields.keywords = ''
      this.searchFields.date = []

      // 重新加载图片列表
      this.getImageList()
    },

    // 获取分组列表
    getGroupList(reloadList) {
      this.loading = true

      groupApi.getList({
        type: this.type,
      }, {
        hideSuccessTip: true,
        success: (res) => {
          this.group.list = res.list

          this.loading = false

          // 重新加载图片列表
          if (reloadList) {
            this.getImageList()
          }
        }
      })
    },

    // 添加图片，文件修改
    addImageChangeFile(e) {
      this.loading = true;

      // 定义数据
      let fileArr = e.target.files, formArr = [];

      // 遍历验证数据，组成表单
      for (let file of fileArr) {

        // 验证文件大小
        if (file.size > this.settings.maxSize * 1024) {
          this.$Message.error(`上传的图片不能大于${util.toFixed(this.settings.maxSize / 1024)}M`);
          return;
        }

        // TODO likexin 验证扩展名

        // 创建form对象
        let form = new FormData();
        form.append('file', file);
        form.append('type', this.type);
        form.append('group_id', this.group.activeId);
        formArr.push(form);
      }

      let uploadFun = formArr.map(params => {
        return new Promise((resolve) => {
          attachmentApi.upload(params, {
            raw: true,
            success: () => {
              resolve()
            },
          });
        })
      });

      // 置为上传中
      this.image.uploading = true
      this.image.uploadNum.current = 0
      this.image.uploadNum.total = fileArr.length

      // 异步上传
      Promise.all(uploadFun).then(res => {
        let message = [];
        res.forEach(item => {
          if (item.error !== 0) {
            message.push(item.message);
            this.$Message.error(item.message);
          }
        })

        alert('ddd')

        this.loading = false;
        this.image.uploading = false;
        if (message.length === 0) {
          this.$Message.success('图片上传成功');
        }
        if (message.length === res.length) {
          this.$refs['upload_input'].value = '';
          return;
        }

        // 重新获取分组信息、图片列表
        this.getGroupList(true);

        // 上传信息置空
        this.$refs['upload_input'].value = '';

      }).catch(err => {
        console.log('file upload fail:', err);
      })
    },

    // 删除图片
    deleteImage(id) {

      // 传入false时说明删除选中的
      if (!id) {
        id = this.selectedImageIds
      }

      // 调用接口删除
      attachmentApi.delete({
        id: id,
        type: this.type,
      }, {
        success: () => {
          // 重新加载图片列表
          this.getImageList()
        },
      })
    },

    // 切换选中
    switchImage(index) {
      this.image.list.forEach((item, i) => {
        if (i === index) {
          this.$set(this.image.list[i], 'checked', !item.checked);
        }
        // TODO likexin 判断批量选择是否超出
      });
    },

    // 获取图片列表
    getImageList() {
      this.loading = true

      attachmentApi.getList({
        type: this.type,
        group_id: this.group.activeId,
        keywords: this.searchFields.keywords,
        create_time: this.searchFields.date,
      }, {
        hideSuccessTip: true,
        success: (res) => {
          this.loading = false

          this.image.list = attachment.formatUrls(res.list, 'path', 'url')
          this.image.count = res.count
          this.image.page = res.page
          this.image.pageSize = res.page_size
        }
      })
    },
  },
  mounted() {

    // 加载分组列表并且加载图片列表
    this.getGroupList(true)
  },
}
</script>

<style lang="scss">

.image-selector {
  .ivu-modal-body {
    padding: 0;
  }

  .ivu-modal-footer {
    text-align: center;
  }
}

.image-selector-modal {
  height: 522px;
  overflow: hidden;
  display: flex;

  .group {
    width: 200px;
    padding: 20px 0;
    border-right: 1px solid #e9edef;
    overflow-x: inherit;
    overflow-y: auto;
    overflow: visible;

    .btn-add {
      margin: 0 20px;
      width: 160px;
      border-radius: 0;
    }

    .group-add-button {
      margin: 8px 0 2px;

      .ivu-btn-group {
        display: flex;
      }

      button {
        display: block;
        flex: 1;
      }
    }

    ul {
      margin-top: 20px;
    }

    li {
      position: relative;
      padding-left: 20px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      font-size: 12px;
      width: 100%;
      display: flex;

      &.active {
        color: #2D8CF0;

        &:after {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          border-right: 2px solid #2D8CF0;
          background-color: #E8EEFF;
          content: '';
        }
      }

      .title {
        padding-right: 2px;
        flex: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .num {
        display: inline-block;
        padding-left: 5px;
      }

      .option {
        width: auto;
        background: white;
        padding-right: 10px;
        font-size: 8px;
        color: #666;

        .option-btn {
          color: $primary-color;
          display: none;

          &.default {
            color: #666;
            padding: 0px 4px;
          }
        }
      }

      &:hover .num {
        display: none;
      }

      &:hover .option-btn {
        display: inline-block;
      }

      &.is_default:hover .num {
        display: block;
      }

      &.is_default:hover .option-btn {
        display: none;
      }
    }
  }

  .image-content {
    padding: 0 20px;
    flex: 1;

    .image-head {
      padding-top: 20px;
      display: flex;

      .tips {
        width: 100%;
        flex: 1;
        height: 32px;
        line-height: 32px;
        padding-left: 10px;

        i {
          color: #999;
        }
      }
    }

    .image-list {
      overflow-y: auto;
      overflow-x: hidden;
      height: 420px;
      padding-top: 20px;

      .empty-list {
        display: block;
        padding-top: 150px;
        text-align: center;
        color: #999;

        i {
          font-size: 70px;
        }

        span {
          display: block;
          padding-top: 10px;
        }
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        margin-right: -10px;
      }

      li {
        padding: 0 12px 20px 0;
        cursor: pointer;

        .img {
          position: relative;
          width: 142px;
          height: 142px;
          border: 1px solid #e9edef;
          border-radius: 2px;
          background-color: #f4f6f8;
          display: block;

          img {
            width: 100%;
            height: 100%;
          }

          .delete {
            position: absolute;
            right: -10px;
            top: -15px;
            font-size: 20px;
            display: none;
            color: #999;
          }

          .info {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            height: 26px;
            line-height: 26px;
            text-align: center;
            color: white;
            display: none;
          }

          .active-layer {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            border: 2px $primary-color solid;

            i {
              display: inline-block;
              font-size: 30px;
              margin: auto;
              color: white;
            }
          }
        }

        .text {
          font-size: 12px;
          line-height: 16px;
          color: #262b30;
          margin-top: 10px;
          width: 138px;
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        &:hover .delete,
        &:hover .info {
          display: block;
        }

        &.active .delete,
        &.active .info {
          display: none;
        }
      }
    }

    .image-foot {
      display: flex;
      flex-wrap: nowrap;
      -webkit-box-pack: justify;
      justify-content: space-between;
      background-color: #ffffff;

      button {
        border-radius: 0;
      }

      .ivu-page {
        line-height: 32px;
      }

    }
  }
}

</style>
