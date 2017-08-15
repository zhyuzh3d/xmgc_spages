$('#fileInput').bind('change', function(evt) {
    $('#percentDiv').html(0);
    $QUNP.upload(evt.target.files[0], {
        complete: function(evt) {
            $('#fileInput').files = [];
        },
        progress: function(evt) {
            $('#percentDiv').html(Math.floor(evt.loaded / evt.total * 100) + '%');
        },
    }, 'myphotos')
})
