xyPagenavi
==========

xyPagenavi 是基于jQuery的一个简单分页插件。


Documentation
-------------

###Example
```html
<div id="demo1"></div>
```

```javascript
$('#demo1').xyPagenavi();
```

###API参考
```javascript
$('#demo1').xyPagenavi({
    theme: 'default',           // 皮肤设置
    first: '&lt;&lt;',          // 首页字符设置
    prev: '&lt;',               // 上一页字符设置
    next: '&gt;',               // 下一页字符设置
    last: '&gt;&gt;',           // 最后一页字符设置
    spread: 2,                  // 控制分页显示(展示的分页数为 spread*2 + 1)
    total: 200,                 // 总数据数目
    index: 0,                   // 当前第一条数据索引
    limit: 10,                  // 每页数据数目
    ajax: true,                // 设置是否为ajax
    url:  function(i){
      $('#demo1_contents').html('当前页码： ' + (i+1) + '，当前页获取到的最后一条数据索引：' + i*this.settings.limit);
    }                   // 如果 ajax=true, 则为相应页面的执行函数
});
```
