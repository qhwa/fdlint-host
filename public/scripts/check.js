jQuery(function($){

  function preparePage(){
    $('.submit').bind('click', function(){
      check($('.input').val());
    });
  }

  function check(code){
    if(code){
      //TODO: err event handlers
      send(code, function(data){
        var obj = $.parseJSON(data);
        parseCheckResult(obj.src, obj.success, obj.info);
      });
    }
  }

  function send(code, handler){
    $.post('', {
      data: code
    }, handler);
  }

  function parseCheckResult(source, success, infos) {
    var escaped = $('<pre />').text(source).html();
    var pre = $('#src pre').remove();
    $('<pre />').html('<code>'+escaped+'</code>').appendTo('#src');
    if(success){
      congraturations();
    } else {
      showResult(infos);
    }
  }

  function congraturations(){
    alert('good');
  }

  function showResult(infos){
    var pre = $('#src pre code:first'),
    src     = pre.html(),
    lines   = src.split("\n");

    $.each(infos, function(idx, info){
      console.log(info);
      var row = info.row,
      col     = info.column,
      level   = info.level,
      msg     = info.msg,
      space   = new Array(col+1).join(' '),
      pattern = [
        '$1<span class="', level, '" ', 'data-msg="', msg, '">',
        '$2</span>',
        '$3\n', '$1', space,
        '^ <span class="msg">', msg, '</span>'
      ].join('');

      lines[row] = lines[row].replace(/^(\s*)(\S.*)(\s*)$/, pattern);
    });

    src     = lines.join("\n");
    pre.html(src);
      
  }

  preparePage();
  return;

  //Tests:
  var results = [];
  results.push({row:1, col:1, type:'warning', msg: '反正这里就是不能这样写'});
  parseCheckResult($(document.body).html(), false, results);

});
