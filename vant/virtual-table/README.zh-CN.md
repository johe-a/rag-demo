# 虚拟表格组件

### 介绍

虚拟表格组件，支持横向固定列，纵向虚拟列表。

横向固定列使用 better-scroll 实现。

### 引入

```typescript
// 1. 引入组件
import Vue from 'vue'
import { VirtualTable } from '@fe/zand'

Vue.use(VirtualTable)
```

## 代码演示

### 基础用法

```html
<virtual-table
  class="virtual-table"
  @clickBodyRow="clickBodyRow"
  :header="header"
  :table-data="tableData"
>
  <template v-slot:header-col="{ column }">
    <div class="header-item">{{ column.field }}</div>
  </template>
  <template v-slot:body-col="{ row, column }">
    <div class="body-col">{{ row[column.field] }}</div>
  </template>
</virtual-table>
```

> 注意：表格列的宽度单位是`vw`，盒子模型为`border-box`，这里`paddingLeft`不占据额外的宽度。

```javascript
export default {
  data() {
    return {
      header: [
        {
          field: 'id',
          width: '18.69',
          name: 'ID',
          paddingLeft: '5',
        },
        {
          field: 'name',
          width: '18.69',
          name: '名称',
        },
        {
          field: 'price',
          width: '18.69',
          name: '现价',
        },
        {
          field: 'upAndDown',
          width: '18.69',
          name: '涨跌幅',
        },
        {
          field: 'upAndDownRate',
          width: '18.69',
          name: '涨跌额',
        },
      ],
      tableData: [
        {
          id: '1',
          name: '股票A',
          price: 100.23,
          upAndDown: 2.34,
          upAndDownRate: 2.5,
        },
        {
          id: '2',
          name: '股票B',
          price: 50.67,
          upAndDown: -1.21,
          upAndDownRate: -1.8,
        },
        ...
      ],
    }
  },
  methods: {
    clickBodyRow(info: BodyData) {
      console.log('行数据', info.data);
      console.log('行下标', info.row);
      console.log('列下标', info.col)
    },
  },
}
```

```scss
.virtual-table {
  height: 450px;
  background-color: #fff;
  .header-item {
    color: #999;
    font-size: 12px;
    line-height: 1.5;
    text-align: center;
  }
  .body-col {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    color: rgb(34, 34, 34);
    font-size: 15px;
  }
}
```

### 左右列 fixed

通过 `列`的 `fixed` 属性来设置左、右侧列是否冻结。

复用基础用法的组件：

```javascript
    ...
    header: [
        {
          field: 'id',
          width: '18.69',
          name: 'ID',
          paddingLeft: '5',
          fixed: 'left',
        },
        {
          field: 'name',
          width: '18.69',
          name: '名称',
        },
        {
          field: 'price',
          width: '18.69',
          name: '现价',
        },
        {
          field: 'upAndDown',
          width: '24',
          name: '涨跌幅',
          paddingLeft: '8',
        },
        {
          field: 'upAndDownRate',
          width: '20',
          name: '涨跌额',
          paddingLeft: '5'
        },
      ],
    ...
```

> `fixed` 不生效？ 确认列 `width` 的总和，需要大于表格容器的宽度。

### 动态高度

由于虚拟表格的容器必须明确设置 `height`，如果 `height` 不是固定的，例如表格的高度由最终的表格行数决定。那么需要在确定高度后，设置到容器上，并且调用组件的`resize`方法，让组件感知到高度变化，否则虚拟表格无法正确得到可视区域高度。

```javascript
mockData = [
    {
    id: '1',
    name: '股票A',
    price: 100.23,
    upAndDown: 2.34,
    upAndDownRate: 2.5,
  },
  {
    id: '2',
    name: '股票B',
    price: 50.67,
    upAndDown: -1.21,
    upAndDownRate: -1.8,
  },
  ...
]

export default {
  data() {
    header: [
      {
        field: 'id',
        width: '18.69',
        name: 'ID',
        paddingLeft: '5',
      },
      {
        field: 'name',
        width: '18.69',
        name: '名称',
      },
      {
        field: 'price',
        width: '18.69',
        name: '现价',
      },
      {
        field: 'upAndDown',
        width: '18.69',
        name: '涨跌幅',
      },
      {
        field: 'upAndDownRate',
        width: '18.69',
        name: '涨跌额',
      },
    ],
    shortData: mockData.slice(0, 5),
    headHeight: 0,
    rowHeight: 0,
  },
  methods: {
    setHeadAndRowHeight() {
      const tableHead = this.$refs.table.querySelector('.header-item')
      const tableCol = this.$refs.table.querySelector('.body-col')
      if (!tableHead || !tableCol) return
      this.headHeight = tableHead.getBoundingClientRect().height
      this.rowHeight = tableCol.getBoundingClientRect().height
    },
    resetTableHeight() {
      this.setHeadAndRowHeight()
      if (this.headHeight && this.rowHeight) {
        this.$refs.table.style.height =
          this.headHeight + this.rowHeight * this.shortData.length + 'px';
        this.$refs.shortTable.resize()
      }
    },
    addRecord() {
      this.shortData = mockData.slice(0, this.shortData.length + 1)
      this.resetTableHeight()
    },
    deleteRecord() {
      this.shortData = mockData.slice(0, this.shortData.length - 1)
      this.resetTableHeight()
    }
  }
}

```

```html
<div class="virtual-table-short" ref="table">
  <virtual-table
    @clickBodyRow="clickBodyRow"
    :header="header"
    :table-data="shortData"
    ref="shortTable"
  >
    <template v-slot:header-col="{ column }">
      <div class="header-item">{{ column.name }}</div>
    </template>
    <template v-slot:body-col="{ row, column }">
      <div class="body-col">{{ row[column.field] }}</div>
    </template>
  </virtual-table>
</div>
<v-button @click="addRecord" size="mini" plain>增加一行</v-button>
<v-button @click="deleteRecord" size="mini" plain>减少一行</v-button>
```

## API

### Props

<table>
  <thead>
    <tr>
    <th>
      参数
    </th>
    <th>
      说明
    </th>
    <th>
      类型
    </th>
    <th>
      默认值
    </th>
    </tr>
  </thead>
  <tbody>
    <tr><td>header</td><td>表格列设置</td><td>
    <em>
      Array<{
        width: string;
        name: string;
        paddingLeft?: string;
        paddingRight?: string;
        fixed?: 'left' | 'right'
      }>
    </em></td><td><code>[]</code></td></tr>
    <tr><td>tableData</td><td>表格数据</td><td>
    <em>T[]</em></td><td><code>[]</code></td></tr>
    <tr><td>pagination</td><td>是否显示分页器</td><td>
    <em>boolean</em></td><td><code>true</code></td></tr>
    <tr><td>border</td><td>是否显示行边框</td><td>
    <em>boolean</em></td><td><code>true</code></td></tr>
    <tr><td>moreVisible</td><td>大于1页时是否显示更多</td><td>
    <em>boolean</em></td><td><code>true</code></td></tr>
    <tr><td>resetTopOnChange</td><td>表格数据变化时，是否重置到顶部(设置为false后，表格数据变化将不会重置到顶部，需要手动调用组件的resetToTop方法)</td><td><em>boolean</em></td><td><code>true</code></td></tr>
  </tbody>

</table>

### Events

<table>
  <thead>
    <tr>
    <th>
      参数
    </th>
    <th>
      说明
    </th>
    <th>
      回调参数
    </th>
    </tr>
  </thead>
  <tbody>
    <tr><td>clickBodyRow</td><td>点击表格行的回调</td><td>
    <em>
     {
      data: T,
      row: number,
      col: number,
     }
    </em></td></tr>
    <tr><td>indexChange</td><td>下标变化</td><td>
    <em>{ bufferStart: number; bufferEnd: number}</em></td></tr>
    <tr><td>tableScroll</td><td>表格开始滚动,包括纵向和横向</td><td>
    <em>undefined</em></td></tr>
    <tr><td>verticalScroll</td><td>表格纵向滚动</td><td>{bufferStart: number; bufferEnd: number}</td></tr>
  </tbody>
</table>

### Slots

<table>
  <thead>
    <tr>
    <th>
      名称
    </th>
    <th>
      说明
    </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>header-col</td>
      <td>表头列渲染内容</td>
    </tr>
    <tr>
      <td>body-col</td>
      <td>列渲染内容</td>
    </tr>
    <tr>
      <td>no-more</td>
      <td>没有更多了渲染内容，仅在moreVisible为true时有效</td>
    </tr>
  </tbody>
</table>
