/**
 * jquery分页插件
 * Author: xjiancong@gmail.com
 * Date: 2013-07-29
 * Version: 0.0.1
 */
(function(window, $, undefined){

  $.fn.xyPagenavi = function(option, settings){
    if(typeof option === 'object'){
      settings = option;
    }else if(typeof option === 'string'){
      var values = [];
      var elements = this.each(function(){
        var data = $(this).data('_xyPagenavi');
        if(data){
          if(option === 'destroy'){
            data.destroy();
          }else if($.fn.xyPagenavi.defaultSettings[option] !== undefined){
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
      var $elem = $(this)
        , _settings = $.extend({}, $.fn.xyPagenavi.defaultSettings, settings || {})
        , pagenavi = new Pagenavi(_settings, $elem)
        , $el = pagenavi.generate();

      $elem.append($el);
      $elem.data('_xyPagenavi', pagenavi);
    });
  }

  $.fn.xyPagenavi.defaultSettings = {
    theme: 'default',           // 皮肤设置
    first: '&lt;&lt;',          // 首页字符设置
    prev: '&lt;',               // 上一页字符设置
    next: '&gt;',               // 下一页字符设置
    last: '&gt;&gt;',           // 最后一页字符设置
    spread: 5,                  // 控制分页显示(展示的分页数为 spread*2 + 1)
    total: 400,                 // 总数据数目
    index: 0,                   // 当前第一条数据索引
    limit: 20,                  // 每页数据数目
    ajax: false,                // 设置是否为ajax
    url:  '#'                   // 如果 ajax=true, 则为相应页面的执行函数
  }

  function Pagenavi(settings, $elem){
    this.pagenavi = null;
    this.settings = settings;
    this.$elem = $elem;

    return this;
  }

  Pagenavi.prototype = {
    generate: function(){
      if(this.pagenavi) return this.pagenavi;

      this.pagenavi = $('<div class="_xyPagenavi_holder _xyPagenavi_theme_'+ this.settings.theme +'"></div>');
      this.generateLinks();
      return this.pagenavi;
    },

    generateLinks: function(){
      var totalPages = Math.ceil(this.settings.total/this.settings.limit)
        , visiblePages = this.settings.spread*2 + 1
        , currentPage = Math.ceil(this.settings.index/this.settings.limit)
        , start = 0
        , end = 0;

      // console.log(totalPages, visiblePages, currentPage);
      if(totalPages < visiblePages){
        start = 0;
        end = totalPages;
      }else if(currentPage < this.settings.spread){
        start = 0;
        end = visiblePages;
      }else if(currentPage > totalPages - this.settings.spread - 1){
        start = totalPages - visiblePages;
        end = totalPages;
      }else{
        start = currentPage - this.settings.spread;
        end = currentPage + this.settings.spread + 1;
      }

      this.pagenavi.html('');
      if(this.settings.first) this.pagenavi.append(this.getLink(0, 'first'));
      if(this.settings.prev) this.pagenavi.append(this.getLink(currentPage === 0 ? 0 : currentPage-1, 'prev'));

      for(i = start; i < end; i++){
        this.pagenavi.append(this.getLink(i, i*this.settings.limit === this.settings.index ? 'active' : null));
      }

      if(this.settings.next) this.pagenavi.append(this.getLink(currentPage === totalPages-1 ? totalPages-1 : currentPage+1, 'next'));
      if(this.settings.last) this.pagenavi.append(this.getLink(totalPages-1, 'last'));
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
      }else{
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
