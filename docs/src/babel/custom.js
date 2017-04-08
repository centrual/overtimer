$( function() {
  const clipboardBtn = $('#clipboard')
  let copyTimer = null
  
  $('#package-manager-selection').dropdown({
    on: 'hover',
    delay: { show: 50 },
    onChange: function(value) {
      let val = 'yarn add overtimer'
      
      if( value === 'yarn') {
        $('.command').text('add')
        clipboardBtn.prop('data-clipboard-text', val).attr('data-clipboard-text', val)
      }
      else {
        $('.command').text('install')
        val = `${value} install overtimer`
        clipboardBtn.prop('data-clipboard-text', val).attr('data-clipboard-text', val)
      }
    }
  })
  
  clipboardBtn.on('click', function() {
    clipboardBtn.find('.icon').removeClass('clipboard').addClass('checkmark')
  
    if( copyTimer !== null && !copyTimer.bump() )
      copyTimer.start()
    else if( copyTimer === null ) {
      copyTimer = new Overtimer(1000, function () {
        clipboardBtn.find('.icon').removeClass('checkmark').addClass('clipboard')
      })
    }
  })
  
  new Clipboard('#clipboard')
})
