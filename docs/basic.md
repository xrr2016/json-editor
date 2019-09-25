基本用法

```vue
<template>
  <section class="basic">
    <json-editor class="editor" @change="renderJson" />
    <pre class="pre" v-text="json"></pre>
  </section>
</template>

<script>
export default {
  name: 'Basic',
  data() {
    return {
      json: '[]'
    }
  },
  methods: {
    renderJson(data) {
      console.log(data)
      this.json = JSON.parse(JSON.stringify(data))
    }
  }
}
</script>

<style>
.basic {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.editor {
  flex: 2;
}

.pre {
  flex: 1;
  margin: 0;
  margin-left: 1rem;
}
</style>
```
