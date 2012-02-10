jQuery(function($){

  function preparePage(){
    $('.submit').bind('click', function(){
      check($('.input').val());
    });

    $('.locator-content .prev').click(function(e){
        e.preventDefault();
        prevMsg();
    });

    $('.locator-content .next').click(function(e){
        e.preventDefault();
        nextMsg();
    });

    $('.submit').ajaxStart(function(){
      $(this).attr('disabled', true);
    }).ajaxComplete(function(){
      $(this).attr('disabled', false);
    });

  }

  function check(code){
    if(code){
      clearResult();
      //TODO: err event handlers
      send(code, onReceiveResult);
    }
  }

  function clearResult () {
    $('#src').empty();
    $('div.locator').addClass('hide');
  }

  function send(code, handler){
    $.ajax({
      url: '',
      type: 'POST',
      data: {
        data: code,
        type: $('select').val()
      },
      timeout: 60000,
      success: handler
    });
  }

  function onReceiveResult(data) {
    var obj = $.parseJSON(data);
    parseCheckResult(obj.filename, obj.src, obj.success, obj.info);
    buildMsgList();
  }

  function parseCheckResult(filename, source, success, infos) {
    filename = filename || 'This file';
    var escaped = $('<pre />').text(source).html();
    var node = $('<li />').append('<p class="summ" />').appendTo('#src');
    $('<pre />').html('<code>'+escaped+'</code>').appendTo(node);
    if(success){
      congraturation(filename, node);
    } else {
      $('p.summ', node).text(filename+' has '+ infos.length+ ' message(s)');
      showResult(infos, node);
      $('div.locator').removeClass('hide');
    }
  }

  function congraturation(filename, node) {
    var summ = $('p.summ', node);
    summ.text(filename+' is Good! ');
    summ.addClass('good');
    $('<a href="#viewsrc">查看源码</a>').bind('click', function(event){
      event.preventDefault();
      $(this).parent().next().toggle();
    }).appendTo(summ);
    summ.next().hide();
  }

  function showResult(infos, node){
    var pre = $('pre code:first', node),
    src     = pre.html(),
    lines   = src.split("\n");

    $.each(lines, function(idx, line){
      lines[idx] = wrap( line, 'li' );
    });

    $.each(infos, function(idx, info){
      var row = info.row,
      col     = info.column,
      level   = info.level,
      msg     = info.msg,
      space   = new Array(col+1).join(' '),
      pattern = [
        '$1<span class="src ', level, '" ', 'data-msg="', msg, '">',
        '$2</span>',
        '$3\n', '$1', space,
        '^ <span class="msg ', level, '">', msg, '</span>'
      ].join('');


      if (row > 0) {
        row --;
      }
      var code = lines[row].replace(/^<li[^>]*>|<\/li>$/g, '');
      code = code.replace(/^(\s*)(\S.*)(\s*)$/m, pattern);
      lines[row] = wrap( code, 'li', 'err' );
    });

    src     = "<ol>"+lines.join("")+"</ol>";
    pre.html(src);
      
  }

  function wrap(code, tag, cls){
    return '<' + tag + (cls?' class="'+cls+'"' : '' ) + '>' + code + '</' + tag + '>';
  }

  function buildMsgList(){
    $.msgs = $('li.err', '#src');
    $.msgs.current = 0;
  }

  function nextMsg(){
    setMsgIndex( getCurrentMsgIndex() +1);
  }


  function prevMsg(){
    setMsgIndex( getCurrentMsgIndex() -1);
  }

  function setMsgIndex(i){
      var el = $.msgs[i];
      if(el){
        $('body').scrollTo(el, 500, {offset:-50});
        $($.msgs[$.msgs.current]).removeClass('cur');
        $(el).addClass('cur');
        $.msgs.current = i;
      }
  }

  function getCurrentMsgIndex(){
    var cur = 0, msgs = $.msgs;
    for(var i=0,len=msgs.length;i<len;i++){
        var el = msgs[i];
        if($(el).offset().top > document.body.scrollTop + 40){
            cur = i;
            break;
        }
    }
    return cur;
  }

  preparePage();

  $('textarea.input')
    .acceptDndFiles('')
    .bind('drop', function(){
      $(this).removeClass('over');
      clearResult();
    })
    .bind('dragenter', function(){
      $(this).addClass('over').blur();
      var self = this;
      setTimeout(function(){
        self.blur();
      }, 50);
    })
    .bind('dragover', function(){
      this.blur();
    })
    .bind('dragleave', function(){
      $(this).removeClass('over');
    })
    .bind('uploaded', function(evt, data){
      onReceiveResult(data);
    });

  window.nextMsg = nextMsg;

});
