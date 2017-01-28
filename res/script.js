    //get the input value of radio button
    var radioFormat = 24;
    var timeformat = 23;
    var low = 0;

    $('.radioGroup1 input').on('change', function() {
        radioFormat = $('input[name=radio]:checked', '.radioGroup1').val();
        hours = parseInt($('.htime').val());
        if (radioFormat === '12') {
            timeformat = 12;
            low = 1;
            $('.radioGroup2').css('opacity', '1');
            if (hours > 12) {
                hours = hours - 12;
                hours = (hours < 10 ? "0" : "") + hours;
                $('.htime').val(hours);
            }
        } else {
            timeformat = 23;
            low = 0;
            $('.radioGroup2').css('opacity', '0');
        }

    });


    var flag = 0;
    var extraflag = 1;
    var reHr = 0;
    var reMin = 0;
    var filename = 'Bells.mp3'; //here give the name of the alarm tone
    //get the alarm tone
    $('.tone').click(function() {
        filename = $(this).text();
        audioElement.setAttribute('src', filename + '.mp3');
        $('.chosen').text(filename);
    });

    //intialize the alarm tone
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', filename);
    // loop the tone infinitely
    audioElement.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    //if - for hour clicked
    $('.hbtn').click(function() {

        hours = parseInt($('.htime').val());
        hours += 1;
        if (hours > timeformat) {
            hours = low;
        }
        hours = (hours < 10 ? "0" : "") + hours;
        $('.htime').val(hours);
        extraflag = 1;
    });

    //if + for hour clicked
    $('.hbtn2').click(function() {

        hours = parseInt($('.htime').val());
        hours -= 1;
        if (hours < low) {
            hours = timeformat;
        }
        hours = (hours < 10 ? "0" : "") + hours;
        $('.htime').val(hours);
        extraflag = 1;
    });

    //if - for minutes clicked
    $('.mbtn').click(function() {
        minutes = parseInt($('.mtime').val());
        minutes += 1;
        if (minutes > 59) {
            minutes = 0;
            $('.hbtn').click();
        }
        minutes = (minutes < 10 ? "0" : "") + minutes;
        $('.mtime').val(minutes);
        extraflag = 1;
    });

    //if + for minutes clicked
    $('.mbtn2').click(function() {
        minutes = parseInt($('.mtime').val());
        minutes -= 1;
        if (minutes < 0) {
            minutes = 59;
            $('.hbtn2').click();
        }
        minutes = (minutes < 10 ? "0" : "") + minutes;
        $('.mtime').val(minutes);
        extraflag = 1;
    });


    //if set button is cliked -> alarm is set
    // set the alarm. start displaying current time & Remaining time. Also set flag as true
    $('.set').click(function() {
        flag = 1;
        alarmHour = $('.htime').val();
        alarmMin = $('.mtime').val();

        alarmMin = parseInt(alarmMin);
        alarmHour = parseInt(alarmHour);

        x = '';
        y = ''; //get AM or PM from radiobutton
        if (radioFormat === '12') {
            y = $('input[name=radio2]:checked', '.radioGroup2').val();
        }
        alarmMin = (alarmMin < 10 ? "0" : "") + alarmMin;
        alarmHour = (alarmHour < 10 ? "0" : "") + alarmHour;

        $('.ctime').text('Alarm scheduled at ' + alarmHour + ' : ' + alarmMin + " " + y);


        $('.stopBtn').css('opacity', '1');
        extraflag = 0;
    });


    // this function is called every second
    function updateClock() {
        var dt = new Date();

        alarmHour = $('.htime').val();
        alarmMin = $('.mtime').val();

        alarmMin = parseInt(alarmMin);
        alarmHour = parseInt(alarmHour);


        chour = dt.getHours();
        cmin = dt.getMinutes();

        z = ''; //get AM or PM from radiobutton
        if (radioFormat === '12') {
            z = $('input[name=radio2]:checked', '.radioGroup2').val();
            if ((z === 'PM' && alarmHour != 12) || (z === 'AM' && alarmHour === 12)) {
                alarmHour = 12 + alarmHour;
                alarmHour = alarmHour === 24 ? 0 : alarmHour;
            }
        }


        if (alarmHour === chour && alarmMin === cmin && flag === 1 && extraflag === 0) {
            // alarm goes NOW!!
            audioElement.play();
            $('.ctime').text('Alarm Ringing !!');
            $('.remain').text('');
        } else if (flag === 1) {

            // Calculate Remaining time for the alarm to go
            reHr = 0;
            reMin = 0;

            if (chour < alarmHour) {

                if (cmin <= alarmMin) {

                    reHr = alarmHour - chour;
                    reMin = alarmMin - cmin;
                } else {

                    reMin = (alarmMin + 60) - cmin;
                    reHr = (alarmHour - chour) - 1;
                }
            } else if (chour > alarmHour) {

                if (cmin > alarmMin) {

                    reHr = 23 - (chour - alarmHour);
                    reMin = (alarmMin + 60) - cmin;
                } else {

                    reMin = alarmMin - cmin;
                    reHr = 24 - (chour - alarmHour);
                }
            } else {
                if (cmin > alarmMin) {
                    reHr = 23;
                    reMin = (alarmMin + 60) - cmin;
                } else {
                    reHr = 0;
                    reMin = alarmMin - cmin;
                }
            }
            $('.remain').text(reHr + ' hrs & ' + reMin + ' mins more to go !!');
        }
    }

    //if stop button is clicked , flag is set to false , and also both reminder texts are re-initialized
    $('.stopBtn').click(function() {
        audioElement.pause();
        flag = 0;
        extraflag = 1;
        $('.ctime').text('');
        $('.remain').text('');
        $(this).css('opacity', '0');
    });

    //when page is loaded call the fucntion mentioned every 1 second
    $(document).ready(function() {
        setInterval('updateClock()', 1000);
    });
