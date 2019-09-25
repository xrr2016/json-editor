<template>
  <section class="json-editor">
    <el-tree
      node-key="key"
      default-expand-all
      :data="tree"
      :indent="10"
      :expand-on-click-node="false"
      :render-content="renderContent"
    />
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
    },
    renderContent(h, {node, data, store}) {
      const isRoot = data.isRoot
      const parentType = node.parent.data.type

      return (
        <el-row class="flex" gutter={8}>
          <el-col span={5}>
            <el-input
              placeholder="key"
              v-model={data.key}
              disabled={parentType === 'array' || isRoot}
            ></el-input>
          </el-col>
          <el-col span={5}>
            {isRoot ? (
              <el-select
                v-model={data.type}
                on-change={() => this.onChangeType(data)}
              >
                {ROOT_TYPES.map(type => (
                  <el-option
                    key={type.value}
                    label={type.label}
                    value={type.value}
                  ></el-option>
                ))}
              </el-select>
            ) : (
              <el-select
                v-model={data.type}
                on-change={() => this.onChangeType(data)}
              >
                {VALUE_TYPES.map(type => (
                  <el-option
                    key={type.value}
                    label={type.label}
                    value={type.value}
                  ></el-option>
                ))}
              </el-select>
            )}
          </el-col>
          <el-col span={11}>
            {data.type === 'string' && (
              <el-input
                type="text"
                placeholder="value"
                v-model={data.value}
                on-input={() => this.emitJson()}
              ></el-input>
            )}
            {data.type === 'number' && (
              <el-input
                type="number"
                placeholder="value"
                v-model={data.value}
                on-input={() => this.emitJson()}
              ></el-input>
            )}
            {data.type === 'boolean' && (
              <el-select v-model={data.value} on-change={() => this.emitJson()}>
                <el-option label="true" value={true}></el-option>
                <el-option label="false" value={false}></el-option>
              </el-select>
            )}
          </el-col>
          <el-col span={3}>
            {data.type === 'object' && (
              <i class="el-icon-plus" on-click={() => this.append(data)} />
            )}

            {data.type === 'array' && (
              <i class="el-icon-plus" on-click={() => this.append(data)} />
            )}

            {!isRoot && (
              <i
                class="el-icon-delete"
                on-click={() => this.remove(node, data)}
              />
            )}
          </el-col>
        </el-row>
      )
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
