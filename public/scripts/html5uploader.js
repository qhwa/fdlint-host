/*
 *	Upload files to the server using HTML 5 Drag and drop the folders on your local computer
 *
 *	Tested on:
 *	Mozilla Firefox 3.6.12
 *	Google Chrome 7.0.517.41
 *	Safari 5.0.2
 *	Safari na iPad
 *	WebKit r70732
 *
 *	The current version does not work on:
 *	Opera 10.63 
 *	Opera 11 alpha
 *	IE 6+
 */

(function($){

  var self;

  function prepare(){
    var pl = self, el =  pl.get(0);
    el.addEventListener("dragover", function(event){
      event.preventDefault();
    }, true);
    el.addEventListener("drop", function(event){
      event.preventDefault();
      uploadFiles(event.dataTransfer.files);
    }, false); 
  }

  function uploadFiles (files) {
    $.each(files, function(idx,file){
      upload(file);
    });
  }

  function upload(file) {
    var data = new FormData();
    data.append('data', file);

    $.ajax({
      url: self.data('target-url'),
      type: "POST",
      data: data,
      processData: false,
      contentType: false,
      success: function(data){
        self.trigger('uploaded', data);
      }
    });
  }

  $.fn.acceptDndFiles = function(targetUrl) {
    self = this;
    self.data('target-url', targetUrl);
    prepare();
    return this;
  };

})(jQuery);
