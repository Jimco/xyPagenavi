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
        var data = this.data('_xyPagenavi');
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
    theme: 'default',
    first: '&lt;&lt;',
    prev: '&lt;',
    next: '&gt;',
    last: '&gt;&gt;',
    spread: 5,
    total: 400,
    index: 0,
    limit: 20,
    url:  function(i){
            $('#pagenavi1_contents').html('Yay, you have reached page ' + (i+1) + ', and index ' + i*this.settings.limit);
          },
    ajax: true
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

      console.log(totalPages, visiblePages, currentPage);

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
        return $('<a href="javascript:void(0);" class="_xyPagenavi_link '+ (key ? '_xyPagenavi_link_' + key : '') +'></a>')
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
      this.$elem.removeDate('_xyPagenavi');
    }
  }

})(window, jQuery);
