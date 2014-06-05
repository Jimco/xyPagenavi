/**
 * jquery分页插件
 * Author: xjiancong@gmail.com
 * Date: 2013-07-29
 * Version: 0.0.1
 */
(function(window, $, undefined){

  $.fn.xyPagenavi = function(option, settings){

    if(typeof option === 'string'){
      var values = [];
      var elements = this.each(function(){
        var data = $(this).data('_xyPagenavi');
        if(data){
          if(option === 'destroy'){
            data.destroy();
          }
          else if($.fn.xyPagenavi.defaultSettings[option] !== undefined){
            if(settings !== undefined){ data.settings[option] = settings; }
            else{ values.push(data.settings[option]); }
          }
        }
      });

      if(values.length === 1){ return values[0]; }
      if(values.length > 0){ return values; }
      else{ return elements; }
    }

    return this.each(function(){
      var $this = $(this)
        , data = $this.data('_xyPagenavi')
        , options = typeof option === 'object' && option;

      if(!data) $this.data('_xyPagenavi', (data = new Pagenavi(options, $this)));
    });
  }

  $.fn.xyPagenavi.defaultSettings = {
    theme: 'default',           // 皮肤设置
    first: '&lt;&lt;',          // 首页字符设置，false 或留空为不显示
    prev: '&lt;',               // 上一页字符设置，false 或留空为不显示
    next: '&gt;',               // 下一页字符设置，false 或留空为不显示
    last: '&gt;&gt;',           // 最后一页字符设置，false 或留空为不显示
    spread: 2,                  // 控制分页显示(展示的分页数为 spread*2 + 1)
    total: 400,                 // 总数据数目
    index: 0,                   // 当前第一条数据索引
    limit: 20,                  // 每页数据数目
    ajax: false,                // 设置是否为ajax
    url:  '#'                   // 如果 ajax=true, 则为相应页面的执行函数
  }

  function Pagenavi(settings, $elem){
    this.pagenavi = null;
    this.settings = $.extend({}, $.fn.xyPagenavi.defaultSettings, settings || {});
    this.$elem = $elem;

    this.generate();
  }

  Pagenavi.prototype = {
    generate: function(){

      // if(this.pagenavi) return this.pagenavi;

      this.pagenavi = $('<div class="_xyPagenavi_holder _xyPagenavi_theme_'+ this.settings.theme +'"></div>');

      this.generateLinks();

      this.$elem.html(this.pagenavi);
      // return this.pagenavi;
    },

    generateLinks: function(){
      var me = this
        , settings = me.settings
        , pagenavi = me.pagenavi
        , totalPages = Math.ceil(settings.total/settings.limit)
        , visiblePages = settings.spread*2 + 1
        , currentPage = Math.ceil(settings.index/settings.limit)
        , start = 0
        , end = 0;

      // console.log(totalPages, visiblePages, currentPage);
      if(totalPages < visiblePages){
        start = 0;
        end = totalPages;
      }
      else if(currentPage < settings.spread){
        start = 0;
        end = visiblePages;
      }
      else if(currentPage > totalPages - settings.spread - 1){
        start = totalPages - visiblePages;
        end = totalPages;
      }
      else{
        start = currentPage - settings.spread;
        end = currentPage + settings.spread + 1;
      }

      pagenavi.html('');
      if(settings.first) pagenavi.append(this.getLink(0, 'first'));
      if(settings.prev) pagenavi.append(this.getLink(currentPage === 0 ? 0 : currentPage-1, 'prev'));

      for(i = start; i < end; i++){
        pagenavi.append(this.getLink(i, i*settings.limit === settings.index ? 'active' : null));
      }

      if(settings.next) pagenavi.append(this.getLink(currentPage === totalPages-1 ? totalPages-1 : currentPage+1, 'next'));
      if(settings.last) pagenavi.append(this.getLink(totalPages-1, 'last'));
    }, 

    getLink: function(i, key){
      if(this.settings.ajax){
        var me = this;
        return $('<a href="javascript:void(0);" class="_xyPagenavi_link '+ (key ? '_xyPagenavi_link_' + key : '') +'"></a>')
          .html('<span>'+ (this.settings[key] || (i+1)) +'</span>')
          .click(function(){
            me.settings.index = i*me.settings.limit;
            me.generateLinks();
            me.settings.url.apply(me, [i]);
          });
      }
      else{
        var url = typeof(this.settings.url) === 'function' ? this.settings.url.apply(this, [i]) : this.settings.url + '/' + i*this.settings.limit;

        return $('<a href="'+ url +'" class="_xyPagenavi_link '+ (key ? '_xyPagenavi_link_' + key : '') +'"></a>').html('<span>'+ (this.settings[key] || (i+1)) +'</span>');
      }
    },

    destroy: function(){
      this.pagenavi.remove();
      this.$elem.removeData('_xyPagenavi');
    }
  }

})(window, jQuery);
