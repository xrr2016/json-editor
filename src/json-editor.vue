<template>
  <section class="json-editor">
    <el-tree
      :data="tree"
      :indent="10"
      :expand-on-click-node="false"
      node-key="key"
      default-expand-all
    >
      <el-row class="flex" :gutter="8" slot-scope="{ node, data }">
        <el-col :span="5">
          <el-input
            placeholder="key"
            v-model="data.key"
            :disabled="node.parent.data.type === 'array' || data.isRoot"
          ></el-input>
        </el-col>
        <el-col :span="5">
          <el-select v-if="data.isRoot" v-model="data.type" @change="() => onChangeType(data)">
            <el-option
              v-for="type of ROOT_TYPES"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            ></el-option>
          </el-select>

          <el-select v-else v-model="data.type" @change="() => onChangeType(data)">
            <el-option
              v-for="type of VALUE_TYPES"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="11">
          <el-input
            type="text"
            v-if="data.type === 'string'"
            placeholder="value"
            v-model="data.value"
            @input="() => emitJson()"
          ></el-input>

          <el-input
            v-else-if="data.type === 'number'"
            type="number"
            placeholder="value"
            v-model="data.value"
            @input="() => emitJson()"
          ></el-input>

          <el-select
            v-else-if="data.type === 'boolean'"
            v-model="data.value"
            @change="() => emitJson()"
          >
            <el-option label="true" value="{true}"></el-option>
            <el-option label="false" value="{false}"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <i
            class="el-icon-plus"
            v-if="data.type === 'object' || data.type === 'array'"
            @click="() => append(data)"
          />
          <i v-if="!data.isRoot" class="el-icon-delete" @click="() => remove(node, data)" />
        </el-col>
      </el-row>
    </el-tree>
  </section>
</template>

<script>
import {travelNode, randomId} from './util'
import {ROOT_TYPES, VALUE_TYPES} from './type'

export default {
  name: 'JsonEditor',
  props: {},
  data() {
    return {
      ROOT_TYPES,
      VALUE_TYPES,
      tree: [
        {
          key: 'root',
          value: [],
          type: 'array',
          isRoot: true,
          children: []
        }
      ]
    }
  },
  methods: {
    emitJson() {
      const json = travelNode(this.tree[0]).root
      /**
       * 数据发生变化时
       * @property {array || object} json - 已生成的 json 数据
       */
      this.$emit('change', json)
    },
    onChangeType(data) {
      const {type} = data

      if (type === 'number') {
        data.value = 0
      } else if (type === 'string') {
        data.value = 'value'
      } else if (type === 'boolean') {
        data.value = true
      } else if (type === 'array') {
        data.value = []
      } else if (type === 'object') {
        data.value = {}
      }

      data.children = []
      this.emitJson()
    },
    append(node) {
      const newChild = {
        key: node.type === 'array' ? node.children.length : randomId(),
        value: 'value',
        type: 'string',
        children: []
      }

      if (!node.children) {
        this.$set(node, 'children', [])
      }

      node.children.push(newChild)
      this.emitJson()
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.key === data.key)

      children.splice(index, 1)
      this.emitJson()
    }
  }
}
</script>

<style>
.json-editor {
  padding: 8px;
  color: #303133;
  border: 1px solid #ebeef5;
  background-color: #fff;
}

.el-tree-node__content {
  height: auto;
  padding-top: 6px;
  padding-bottom: 6px;
}

.flex {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.el-icon-plus {
  padding: 4px;
  color: #409eff;
  font-weight: 500;
}

.el-icon-delete {
  padding: 4px;
  color: #f56c6c;
  font-weight: 500;
}
</style>
