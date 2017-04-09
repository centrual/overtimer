'use strict';

$(function () {
  var clipboardBtn = $('#clipboard');
  var copyTimer = null;

  $('#package-manager-selection').dropdown({
    on: 'hover',
    delay: { show: 0 },
    onChange: function onChange(value) {
      var val = 'yarn add overtimer';

      if (value === 'yarn') {
        $('.command').text('add');
        clipboardBtn.prop('data-clipboard-text', val).attr('data-clipboard-text', val);
      } else {
        $('.command').text('install');
        val = value + ' install overtimer';
        clipboardBtn.prop('data-clipboard-text', val).attr('data-clipboard-text', val);
      }
    }
  });

  clipboardBtn.on('click', function () {
    clipboardBtn.find('.icon').removeClass('clipboard').addClass('checkmark');

    if (copyTimer !== null && !copyTimer.bump()) copyTimer.start();else if (copyTimer === null) {
      copyTimer = new Overtimer(1000, function () {
        clipboardBtn.find('.icon').removeClass('checkmark').addClass('clipboard');
      });
    }
  });

  new Clipboard('#clipboard');
  $('.ui.sticky').sticky({
    offset: 100,
    bottomOffset: 80,
    context: '#documentation'
  });

  $('pre code').each(function (i, block) {
    hljs.highlightBlock(block);
  });

  $('.message .close').on('click', function () {
    $(this).closest('.message').transition('slide down');
  });

  var example2Timer = null;

  // Example 1
  $('#example1-button').on('click', function () {
    $('#example1-success-box').transition('hide');

    new Overtimer(1000, function () {
      $('#example1-success-box').transition('slide down');
    });
  });

  // Example 2
  $('#example2-button').on('click', function () {
    if (example2Timer === null) {
      example2Timer = new Overtimer(4000, { repeat: 3, start: false });
      example2Timer.on('poll', function () {
        $('#example2-current-repeat').text(example2Timer.currentRepeat);
        $('#example2-current-repeat-elapsed').text(example2Timer.elapsedTime + ' ms');
        $('#example2-total-elapsed').text(example2Timer.totalElapsedTime + ' ms');
        $('#example2-current-repeat-remaining-time').text(example2Timer.remainingTime + ' ms');
        $('#example2-total-remaining-time').text(example2Timer.totalRemainingTime + ' ms');
        $('#example2-total-paused').text(example2Timer.pausedTime + ' ms');

        $('#example2-current-repeat-remaining-time-percentage').progress({ percent: Math.ceil(example2Timer.currentRepeatPercent) });
        $('#example2-total-remaining-time-percentage').progress({ percent: Math.ceil(example2Timer.totalPercent) });
      });

      example2Timer.on('finish', function () {
        $('#example2-pause-button, #example2-resume-button').transition('hide');
        $('#example2-button').transition('show');
      });
    }

    if (example2Timer.state !== Overtimer.STATES.RUNNING) {
      $('#example2-button').transition('hide');
      $('#example2-pause-button').transition('show');
      example2Timer.start();
    }
  });

  $('#example2-pause-button').on('click', function () {
    example2Timer.pause();
    $(this).transition('hide');
    $('#example2-resume-button').transition('show');
  });

  $('#example2-resume-button').on('click', function () {
    example2Timer.resume();
    $(this).transition('hide');
    $('#example2-pause-button').transition('show');
  });
});

//# sourceMappingURL=custom.js.map