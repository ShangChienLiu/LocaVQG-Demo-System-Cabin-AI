if (menu.state === '城市') {

    isStreet = true;

    menuMusic.muted = true;
    streetVideo.classList.remove('hidden');

    if (firstTimePlay) {
      streetVideo.pause();
      streetMusic.pause();

      if (nextAlertTime === Infinity) {
        nextAlertTime = 49.35;
      }
      if (nextPauseTime === Infinity) {
        nextPauseTime = 21.43;
      }
      updateNextStreetPauseTime(streetVideo.currentTime + 1);
      updateNextStreetAlertTime(streetVideo.currentTime + 1);
      console.log("Begin !!");
      showGameInstruction('static/images/instruction.gif');
      firstTimePlay = false;
    }

    if (replayAgain) {
      menu.state = 'title';
      streetVideo.classList.add('hidden');
    }

    if (Math.abs(streetVideo.currentTime - nextAlertTime) <= 0.2 && !alarmSoundPlayed) {
      console.log("in function alarmSoundPlayed", alarmSoundPlayed);

      alarmAudio.currentTime = 0;
      alarmAudio.loop = true;
      alarmAudio.play();

      alarmSoundPlayed = true;
      console.log("in alarm function: alarmSoundPlayed", alarmSoundPlayed);

      updateNextStreetAlertTime(streetVideo.currentTime + 1);

      setTimeout(() => {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
      }, 6000);
    }

    if (Math.abs(streetVideo.currentTime - nextPauseTime) <= 0.2) {
      if (allowToCheck) {
        checkVideoTime(isStreet);
        updateNextStreetPauseTime(streetVideo.currentTime + 1);
      }
    } else {
      allowToCheck = true;
      pauseAnimation = false;
    }
  }