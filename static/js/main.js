import Menu from './menu.js';
import { pauseSpaceMessages, pauseStreetMessages, spaceConslusion, streetConslusion } from './message.js';
import Render from './render.js';
import {
  resource,
  toggleMusic
} from './util.js';

//視窗出現
window.onload = () => {
  const containerCanvas = document.querySelector('.container');
  containerCanvas.height = Math.min(window.innerHeight, (0.5625 * window.innerWidth));
};

let isPageVisible = !document.hidden;
let allowToCheck = true;
let alarmSoundPlayed = false;
let inQuestions = false;
let inInstruction = true;

// 定義基本參數
let nextPauseTime = 0;
let nextAlertTime = 0;
let requestID = null;
let loopParams;
let intervalId = null;
let pauseAnimation = true;
let plot = "";


//問題&警示＿時間
const pauseStreetTimes = [24.430, 54.830, 67.187, 91.962, 107.094, 128.493, 144.507, 158.441, 178.00, 194.100, 211.80, 233.84, 252.330, 264.450, 282.990, 306.10, 325.48, 346.000, 387.00, 415.30, 445.20, 465.00, 484.64, 502.26, 530.22, 561.440, 583.00, 594.35, 617.24, 633.33];
const alertStreetTimes = [52.35, 89.90, 142.427, 176.23, 231.78, 262.45, 323.00, 385.02, 463.10, 481.81, 580.98, 614.87];
const pauseSpaceTimes = [18.56, 41.21, 73.11, 104.41, 132.00, 175.37, 219.01, 246.15, 293.52, 317.28, 349.00, 392.20, 430.50, 461.00, 497.03];
const alertSpaceTimes = [38.32, 102.18, 216.52, 291.0, 389.50, 458.60];

// 每個場景的播放起始和結束時間
const sceneTimes = {
  "城市": {
    startTimes: [11.03, 115.10, 198.01, 291.95, 431.91, 548.89],
  },
  "太空": {
    startTimes: [0, 150.92, 334.26],
  }
};


let allCollectedObservations = [];

let userReply = "";
let userReplyList = [];

let ftd5_question = "";
let ftd5_questionList = [];

let replayAgain = false;
let firstTimePlay = true;

let chatgpt_observation = "";

const streetVideo = document.getElementById("streetview");
const spaceVideo = document.getElementById("spaceview");
const streetMusic = document.getElementById('streetMusic');
const spaceMusic = document.getElementById('spaceMusic');
const pauseBtn = document.getElementById('pauseBtn');
const alarmAudio = document.getElementById('alarmMusic');
const questionAudio = document.getElementById('questionMusic');
const countDownMusic = document.getElementById('countdownMusic')
// var muteBtn = document.getElementById('muteBtn');

function pauseMedia() {
  alarmAudio.pause();
  questionAudio.pause();
  countDownMusic.pause();
  streetVideo.pause();
  spaceVideo.pause();
  streetMusic.pause();
  spaceMusic.pause();
  // Add other media pause actions as needed...
}

//超時就返回錯誤
function timeout(ms) {
  return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('An error occurred due to timeout.')); 
      }, ms);
  });
}

//偵測切換視窗
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    pauseMedia();
  } else {
      if(isStreet && !inQuestions && !inInstruction){
        streetMusic.play();
        streetVideo.play();
      }
      else if(isSpace && !inQuestions && !inInstruction){
        spaceMusic.play();
        spaceVideo.play();
      }
    startLoop();
  }
  console.log("isPageVisible", !document.hidden);
});

var video;
let isStreet = false;
let isSpace = false;

let streetEntryCount = 5;
let spaceEntryCount = 0;


// 設定開始時間
const setVideoStartTime = (currentScene) => {

  if (currentScene === "城市") {
    let streetStartTimes = sceneTimes[currentScene].startTimes;
    if (streetEntryCount < streetStartTimes.length) {
      streetVideo.currentTime = streetStartTimes[streetEntryCount];
    } else {
      // 如果超過設定的次數，則從第一次開始
      streetEntryCount = 0;
      streetVideo.currentTime = streetStartTimes[streetEntryCount];
    }
  }
  else if (currentScene === "太空") {
    let spaceStartTimes = sceneTimes[currentScene].startTimes;
    if (spaceEntryCount < spaceStartTimes.length) {
      spaceVideo.currentTime = spaceStartTimes[spaceEntryCount];
    } else {
      // 如果超過設定的次數，則從第一次開始
      spaceEntryCount = 0;
      spaceVideo.currentTime = spaceStartTimes[spaceEntryCount];
    }
  }
};

// 更新下一次space暫停時間
const updateNextSpacePauseTime = (currentTime) => {
  const upcomingPauseTimes = pauseSpaceTimes.filter(time => time > currentTime);
  nextPauseTime = upcomingPauseTimes[0] || Infinity;
};

// 更新下一次space alert暫停時間
const updateNextSpaceAlertTime = (currentTime) => {
  const upcomingPauseTimes = alertSpaceTimes.filter(time => time > currentTime);
  nextAlertTime = upcomingPauseTimes[0] || Infinity;
};

// 更新下一次street暫停時間
const updateNextStreetPauseTime = (currentTime) => {
  const upcomingPauseTimes = pauseStreetTimes.filter(time => time > currentTime);
  nextPauseTime = upcomingPauseTimes[0] || Infinity;
};

// 更新下一次street alert暫停時間
const updateNextStreetAlertTime = (currentTime) => {
  const upcomingPauseTimes = alertStreetTimes.filter(time => time > currentTime);
  nextAlertTime = upcomingPauseTimes[0] || Infinity;
};

///////////////////////
async function showMessage(index) {
  let messageItem = "";
  let options = "";
  let loadingMessage = "";
  let questionAudioPlay = false;
  let plot = "";

  const messageConfiguration = {
      'street': {
          plot: "城市",
          messages: pauseStreetMessages
      },
      'space': {
          plot: "太空",
          messages: pauseSpaceMessages
      }
  };

  function configureMessages(source) {
      plot = messageConfiguration[source].plot;
      messageItem = messageConfiguration[source].messages[index];

      if (messageItem.type === "question") {
          loadingMessage = '模型正在尋找有趣的問題...';
          questionAudioPlay = true;
      } else if (messageItem.type === "warning") {
          loadingMessage = '模型正在產生警示...';
      }

      options = {
          title: messageItem.message,
          icon: messageItem.type,
          allowOutsideClick: false,
          showCloseButton: false,
          allowEnterKey: false,
          showConfirmButton: false,
          didClose: () => Promise.resolve(messageItem.type)
      };
  }

  if (isStreet) {
      configureMessages('street');
  }

  if (isSpace) {
      configureMessages('space');
  }

  // Play the audio if it's a question for 6 seconds
  if (questionAudioPlay) {
      playQuestionAudio();
  }

  // Display the loading message
  Swal.fire({
      text: loadingMessage,
      imageUrl: 'static/images/data-transfer.gif',
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: 'Custom image',
      allowOutsideClick: false,
      showConfirmButton: false,
      allowEnterKey: false
  });

  try {
      await Promise.race([
      saveText2sound(messageItem.message),
      timeout(5000) // 5秒超時
      ]);

      setOptionsForAudioPlayback(options);
      await Swal.fire(options);
  } catch (error) {
      console.log("save voice failed");
      setOptionsForAudioPlayback(options, `${index}`, plot, "0");
      await Swal.fire(options);
  } finally {
      return Promise.resolve(messageItem.type);
  }
}

function playQuestionAudio() {
  questionAudio.currentTime = 0;
  questionAudio.loop = true;
  questionAudio.play();

  setTimeout(() => {
      questionAudio.pause();
      questionAudio.currentTime = 0; // Reset the audio playback to the start
  }, 6000);
}

function setOptionsForAudioPlayback(options, index, plot, errorCode) {
  Swal.close();
  options.didOpen = async () => {
      pauseAudios();
      try {
          await playSoundOfText(index, plot, errorCode);
      } finally {
          Swal.close();
      }
  };
}

function pauseAudios() {
  questionAudio.pause();
  alarmAudio.pause();
  alarmAudio.currentTime = 0;
}


//////////////////
async function initMediaStream() {
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    console.error("初始化媒體流錯誤:", error);
    throw error;
  }
  return stream;
}

async function startVoiceInput() {
  return new Promise(async (resolve, reject) => {
    let mediaRecorder;
    let audioChunks = [];
    let recordingState = 'idle';
    let stream; // Declare stream variable here


    function toggleRecording(event) {
      if (event.code === 'Enter') {
        if (recordingState === 'idle') {
          startRecording();
          Swal.update({
            title: 'CabinAI正在聆聽，請說出您的回答。',
            confirmButtonText: `
                  <div id="recording-container">
                    <div id="recording-circle">
                      <div id="recording-animation"></div>
                    </div>
                  </div>
                  <div class="custom-text">按下🔴鍵結束</div>
                  `
          });
        } else if (recordingState === 'recording') {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());  // Move this line here
        }
      }
    }

    function isStreamActive(stream) {
      if (!stream || !stream.getTracks) {
        return false;
      }
      return stream.getTracks().some(track => track.readyState === 'live');
    }


    function startRecording() {
      if (mediaRecorder && mediaRecorder.state !== 'recording') {
        if (isStreamActive(stream)) {
          audioChunks = [];
          mediaRecorder.start();
          recordingState = 'recording';
        } else {
          console.warn('The media stream is not active.');
        }
      } else {
        console.warn('MediaRecorder is already in recording state.');
      }
    }

    try {
      stream = await initMediaStream();

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        
      try{
        recordingState = '';
        Swal.update({
        confirmButtonText: `
                <div id="recording-container">
                  <div id="recording-circle">
                    <div id="recording-animation"></div>
                  </div>
                </div>
                <div class="custom-text">錄製已結束！</div>
                `
        });

        if (!navigator.onLine) {
          Swal.close();
          console.error("You are currently offline. Voice processing requires internet connection.");
          resolve();
        }

        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

        let text;
        text = await Promise.race([
          sendToWhisper(audioBlob),
          timeout(5000) // 5秒超時
        ]);
        userReplyList.push(text);
        userReply = text;

        Swal.close();
        resolve(text);
      } catch (err) {
        console.error("Failed to process the recorded audio:", err.message);
        Swal.close();
        resolve();
      } 

      };

      Swal.fire({
        title: '告訴CabinAI您的想法💭',
        showConfirmButton: true,
        customClass: {
          confirmButton: 'custom-confirm-button'
        },
        confirmButtonText: `
              <div id="recording-container">
                <div id="recording-circle">
                    <div id="red-circle"></div>
                </div>
              </div>
              <div class="custom-text">按下🔴鍵開始</div>
              `,
        allowOutsideClick: false,
        willOpen: () => {
          setTimeout(() => {
            document.activeElement.blur();
            document.addEventListener('keydown', toggleRecording);
          }, 100);
        },
        didClose: () => {
          document.removeEventListener('keydown', toggleRecording);
        },
        preConfirm: () => {
          return false; // Prevent Swal from closing
        }
      });
    } catch (error) {
      Swal.close();
      resolve();
      console.error('錯誤:', error.message);
      if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
        mediaRecorder.stop();
      }
      if (stream) {
          stream.getTracks().forEach(track => track.stop());
      }
      throw new Error('An error occurred while fetching GptReply.'); // 抛出一个新的Error对象
    }
  });
}

async function stopMicrophone() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const tracks = stream.getTracks();
  tracks.forEach(track => track.stop());
}

//////////////////////
async function saveText2sound(userText) {
  if (!navigator.onLine) {
      console.error("You are currently offline. Loading from local might be faster.");
      throw new Error('An error occurred while fetching audio.'); // 抛出一个新的Error对象
  }

  try {
      const response = await fetch('/get_speech', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              userText: userText.replace(/🤔|⚠️|🤨|🧐|📞|🦆|🐵|🏯|🐕|🗺️|🐚|💰|🤩|🍜|🏙️|🍦|🎨|🎵|🗺/g, '') 
          })
      });
      let result = await response.json();
      if (result.success){
          console.log("saveText2sound successful");
      } else {
          throw new Error('An error occurred while fetching audio.'); // 抛出一个新的Error对象
      }
  } catch (error) {
      console.error('An error occurred while fetching audio:', error); // Show the error in the console.
  }
}


/////////////////
function playSoundOfText(index, plot, fakeAnswer) {
  return new Promise((resolve, reject) => {
    console.log("/////////", index, plot, fakeAnswer);
    let audioURL = "";

    if (index == null){
      audioURL = "static/speech/output.wav" + '?t=' + new Date().getTime();
    }
    else if(index == "GPT conclusion"){
      if(plot == "太空"){
        audioURL = `static/speech/backupAudio/SpaceRespond.wav`;
      }
      else if(plot == "城市"){
        audioURL = `static/speech/backupAudio/StreetRespond.wav`;
      }
    }
    else if(fakeAnswer == "1"){
      if(plot == "太空"){
        audioURL = `static/speech/backupAudio/SpaceFakeAnswer${index}.wav`;
      }
      else if(plot == "城市"){
        audioURL = `static/speech/backupAudio/StreetFakeAnswer${index}.wav`;
      }
    }
    else{
      if(plot == "太空"){
        audioURL = `static/speech/backupAudio/SpaceMessages${index}.wav`;
      }
      else if(plot == "城市"){
        audioURL = `static/speech/backupAudio/StreetMessages${index}.wav`;
      }
    }

    console.log("audioURL",audioURL );

    let sound = new Howl({
      src: [audioURL],
      format: ['wav']
    });
    // 使用 'end' 事件，確保在聲音播放完畢後才返回resolve
    sound.once('end', resolve);
    sound.play();
  });
}
///////////////
async function getGptObservation(ftd5_question, user_reply, plot) {
  if (!navigator.onLine) {
      console.error("You are currently offline. Cannot fetch GptObservation.");
      throw new Error('An error occurred while fetching GPT4 observation.'); 
  }

  let data = {
      'ftd5_question': ftd5_question,
      'user_reply': user_reply,
      'plot': plot,
  };

  try {
      let response = await fetch('/getGptObservation', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      let result = await response.json();
      if (!result.success) {
          throw new Error('An error occurred: ' + result.errorMessage || 'Unknown Error');
      }
      allCollectedObservations = allCollectedObservations.concat(result.chatgpt_observation);
      chatgpt_observation = result.chatgpt_observation;
      return result.chatgpt_observation;
  }
  catch (error) {
      throw new Error('An error occurred while fetching GptReply: ' + error.message);
  }
}

//////////////////

async function startGPT4Observation(ftd5_question, user_reply, plot) {
  let reply = "";
  let errorMessage = false;
  
  Swal.fire({
    text: 'CabinAI正在觀察您的回覆...',
    imageUrl: 'static/images/search.gif',
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: 'Custom image',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEnterKey: false
  });

  console.log("About to get GPT observe...");

  try {
    reply = await Promise.race([
      getGptObservation(ftd5_question, user_reply, plot),
      timeout(15000) // 15秒超時
    ]);
  }
  catch (error) {
    errorMessage = true;

    if(plot == "城市"){
      reply = "使用者個性開朗，表現活潑！";
    }
    else if (plot == "太空"){
      reply = "使用者個性開放，表現活潑！";
    }
  }
  
  console.log("About to get GPT observe...", reply);
  
  return new Promise((resolve) => {    // Show the completion Swal
    Swal.fire({
      title: '觀察完成！',
      text: reply,
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      timer: 3000,  // 自動關閉的時間設置為3秒
      timerProgressBar: true,  // 顯示一個倒計時的進度條
    })
    .then(() => {
        Swal.close();
        resolve();
    });
  });

}


//////////////////
async function getGptReply(ftd5_question, user_reply, plot, chatgpt_observation) {
  if (!navigator.onLine) {
      console.error("You are currently offline. Fetching GptReply might not be possible.");
      throw new Error('An error occurred while fetching GPT4.'); 
  }

  let data = {
    'ftd5_question': ftd5_question,
    'user_reply': user_reply,
    'plot': plot,
    'chatgpt_observation': chatgpt_observation
  };

  try {
    let response = await fetch('/getGptReply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    let result = await response.json();
    if (!result.success) {
        throw new Error('An error occurred: ' + result.errorMessage || 'Unknown Error');
    }
    // allCollectedObservations = allCollectedObservations.concat(result.collected_observation);
    return result.reply;
  }
  catch (error) {
    console.error('An error occurred:', error); // Log the error for debugging.
    throw new Error('An error occurred while fetching GptReply: ' + error.message);
  }
}

///////

async function startGPT4Reply(ftd5_question, user_reply, plot, questionRound) {
  let reply = "";
  let errorMessage = false;
  
  Swal.fire({
    text: 'CabinAI收到您的回覆了~ 請稍等⏳',
    imageUrl: 'static/images/download.gif',
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: 'Custom image',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEnterKey: false
  });

  console.log("About to get GPT reply...");

  try {
    reply = await Promise.race([
      getGptReply(ftd5_question, user_reply, plot, chatgpt_observation),
      timeout(15000) // 15秒超時
    ]);
  }
  catch (error) {
    errorMessage = true;

    if(plot == "城市"){
      reply = pauseStreetMessages[questionRound].fakeAnswer;
    }
    else if (plot == "太空"){
      reply = pauseSpaceMessages[questionRound].fakeAnswer;
    }
  }
    console.log("Got GPT reply:", reply);

    // Close the loading Swal
    Swal.close();

    // Show the completion Swal
    Swal.fire({
      title: '回應完成',
      text: reply,
      icon: 'success',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEnterKey: false,
    });

    if(errorMessage){
      await playSoundOfText(`${questionRound}`, plot, "1");
    }
    else{
      // Play the sound and wait for it to finish
      await playSoundOfText();
    }

    // After playing the sound, close the Swal
    Swal.close();
}
/////////////

async function sendToWhisper(audioBlob) {
  if (!navigator.onLine) {
      throw new Error("You are currently offline. Cannot send to Whisper.");
  }

  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.wav');

  try {
      const response = await fetch('/getTextReply', {
          method: 'POST',
          body: formData
      });

      const data = await response.json();
      if (data.success) {
          console.log(data.transcribed_text);
          return data.transcribed_text;
      } else {
          throw new Error(data.error || 'Failed to transcribe');
      }
  } catch (error) {
      throw error;
  }
}

///////
async function getGptConclusion(allCollectedObservations, userReplyList, plot) {
  let response

  try {
      Swal.fire({
          title: '個人化總結...',
          text: '最懂您的CabinAI努力中~🚴‍♀️',
          imageUrl: 'static/images/file.gif',
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: 'Custom image',
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEnterKey: false
      });

      Swal.showLoading();

      console.log("allCollectedObservations userReplyList plot",allCollectedObservations, userReplyList, plot);

      response = await Promise.race([
        fetchDataFromBackend(allCollectedObservations, userReplyList, plot),
        timeout(20000)
      ]);
      
      console.log("result success ???");

      Swal.fire({
        title: '個人化總結',
        imageUrl: `static/images/personality/${response.personality}.gif`,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: 'Custom image',
        text: response.trait_response,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEnterKey: false
      });

      await playSoundOfText();

  } catch (error) {
      Swal.fire({
          title: '個人化總結...',
          text: '最懂您的CabinAI努力中~🚴‍♀️',
          imageUrl: 'static/images/file.gif',
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: 'Custom image',
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEnterKey: false
      });

      Swal.showLoading();
      
      let reply = '';
      let replyPersonality = '';
    
      if (plot == '城市') {
          reply = streetConslusion;
          replyPersonality = 'INTP';
      } else if (plot == "太空") {
          reply = spaceConslusion;
          replyPersonality = 'ISFP';
      }

      console.log("個人化總結場景", plot)
    
      Swal.fire({
          title: '個人化總結',
          imageUrl: `static/images/personality/${replyPersonality}.gif`,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: 'Custom image',
          text: reply,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEnterKey: false
      });      

      await playSoundOfText("GPT conclusion", plot, '0');

  } finally {
      await showCabinAISwal();
  }
}

async function showCabinAISwal() {
  const audioURL = "static/speech/end.wav";
  const sound = new Howl({
      src: [audioURL],
      format: ['wav'],
      onend: () => {
          Swal.close();
      }
  });

  return Swal.fire({
      title: 'CabinAI',
      text: '服務您的心',
      icon: 'info',
      allowOutsideClick: false,
      allowEnterKey: false,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      willOpen: () => {
          sound.play();
      }
  });
}
////////////////////

async function fetchDataFromBackend(allCollectedObservations, userReplyList, plot) {
  if (!navigator.onLine) {
      console.error("You are currently offline. Fetching data from the backend might not be possible.");
      throw new Error('An error occurred while fetching GPT4.'); 
  }

  try {
      const dataToSend = {
          allCollectedObservations: allCollectedObservations,
          userReplyList: userReplyList,
          plot: plot
      };

      const response = await fetch('/getGptConclusion', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
      });

    if (!response.ok) {
        console.error("Server returned an error:", response.statusText);
        throw new Error('Server error: ' + response.statusText);
    }
    
    let result;
    try {
        result = await response.json();
    } catch (e) {
        console.error("Error parsing response as JSON:", e);
        throw new Error('Invalid response from server.');
    }
    
    if (!result.success) {
        console.error("Server error:", result.error);
        throw new Error('An error occurred: ' + result.error);
    }
    
    console.log(result);
    return result;
    

  } catch (error) {
      console.error('An error occurred:', error); // Log the error for debugging.
      throw new Error('An error occurred while fetching the conclusion.');
  }
}

let currentMessageIndex=0

// 檢查影片時間以確定是否需要暫停
const scenes = {
  street: {
    video: streetVideo,
    music: streetMusic,
    plot: "城市",
    times: pauseStreetTimes,
    messages: pauseStreetMessages,
  },
  space: {
    video: spaceVideo,
    music: spaceMusic,
    plot: "太空",
    times: pauseSpaceTimes,
    messages: pauseSpaceMessages,
  }
};

const handleScene = async (scene) => {
  scene.music.pause();
  scene.video.pause();

  const messageIndex = scene.times.indexOf(nextPauseTime);

  ftd5_questionList.push(scene.messages[messageIndex].message);
  ftd5_question = scene.messages[messageIndex].message;

  currentMessageIndex++;

  let messageType;

  try {
    messageType = await showMessage(messageIndex);

    alarmSoundPlayed = false;

    if (messageType !== "warning") {
      try {
        await startVoiceInput();
      } catch {
        console.log("whisper is borken!");
      }
      await startGPT4Observation(ftd5_question, userReply, scene.plot);
      await startGPT4Reply(ftd5_question, userReply, scene.plot, messageIndex);
    }

    if (currentMessageIndex % 5 !== 0) {
      pauseAnimation = false;
      if(scene.plot == "城市" && !document.hidden)
      {
        streetMusic.currentTime = 0
        streetMusic.play();
        streetVideo.play();      
      }
      else if(scene.plot == "太空" && !document.hidden){
        spaceMusic.currentTime = 0
        spaceMusic.play();
        spaceVideo.play();  
      }
    } else {
      console.log("About to call getGptConclusion");
      await getGptConclusion(allCollectedObservations, userReplyList, scene.plot);
      console.log("After calling getGptConclusion");
      
      //reset everything
      resetState();
      if(scene.plot == "城市")
      {
        streetEntryCount += 1;
      }
      else if(scene.plot == "太空"){
        spaceEntryCount += 1;
      }
    }

    inQuestions = false;
    
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const resetState = () => {
  userReply = "";
  userReplyList = [];
  allCollectedObservations = [];
  ftd5_question = "";
  ftd5_questionList = [];
  replayAgain = true;
  currentMessageIndex = 0;
  pauseAnimation = false;
  stopMicrophone();
};

const checkVideoTime = async () => {
  if (!allowToCheck) return;

  allowToCheck = false;
  inQuestions = true;
  if (isStreet) {
    await handleScene(scenes.street);
  } else if (isSpace) {
    await handleScene(scenes.space);
  }
};


// 定義事件處理函數為具名函數
const keysPressed = new Set();

function handleKeyDown(event) {
  keysPressed.add(event.code);
}

function handleKeyUp(event) {
  if (keysPressed.has('Enter')) {
    if (keysPressed.has('Space')) {
      Swal.close();
      countDownMusic.play();

      inInstruction = false;

      if (isStreet) {
        streetVideo.play();
      }
      else if (isSpace) {
        spaceVideo.play();
      }

      countDownMusic.addEventListener('ended', function () {
        if (isStreet) {
          streetMusic.play();
        }
        else if (isSpace) {
          spaceMusic.play();
        }
      });

      // 清除已記錄的按鍵和移除事件監聽器
      keysPressed.clear();
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }
  keysPressed.delete(event.code);
}

function showGameInstruction(imagePath) {
  Swal.fire({
    imageUrl: imagePath,
    imageAlt: 'Game Instructions',
    imageHeight: '85vh',
    imageWidth: '100%',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCloseButton: false,
    returnFocus: false,
    focusConfirm: false,
    width: '100%',
    background: '#000',
    hideClass:{
      popup: 'swal2-hide',
      backdrop: 'swal2-backdrop-hide',
      icon: 'swal2-icon-hide'
    },
    showClass:{
      popup: 'swal2-show',
      backdrop: 'swal2-backdrop-show',
      icon: 'swal2-icon-show'
    },
    customClass:{
      popup: 'popup-adjust',
    }
  });

  document.activeElement.blur();
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}




/*     Main Part     */
//確保menu 100ms 更新率
let lastMenuUpdateTime = 0;
const menuUpdateInterval = 100; // 例如: 更新間隔150毫秒，你可以根據需要調整
let currentTime = Date.now();

let lastKeyPressTime = Date.now();
const keyPressTimeout = 120000; // 2分鐘，以毫秒為單位
document.addEventListener('keydown', function () {
  lastKeyPressTime = Date.now();
});

const loop = (backgroundCanvas, selectionCanvas, menu) => {

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

  if (menu.state === '太空') {

    isSpace = true;


    menuMusic.muted = true;
    spaceVideo.classList.remove('hidden');

    if (firstTimePlay) {
      spaceVideo.pause();
      spaceMusic.pause();

      if (nextAlertTime === Infinity) {
        nextAlertTime = 35.32;
      }
      if (nextPauseTime === Infinity) {
        nextPauseTime = 15.56;
      }
      updateNextSpacePauseTime(spaceVideo.currentTime + 1);
      updateNextSpaceAlertTime(spaceVideo.currentTime + 1);
      console.log("Begin !!");
      showGameInstruction('static/images/instruction.gif');
      firstTimePlay = false;
    }

    if (replayAgain) {
      menu.state = 'title';
      spaceVideo.classList.add('hidden');
    }

    if (Math.abs(spaceVideo.currentTime - nextAlertTime) <= 0.2 && !alarmSoundPlayed) {
      console.log("in function alarmSoundPlayed", alarmSoundPlayed);

      alarmAudio.currentTime = 0;
      alarmAudio.loop = true;
      alarmAudio.play();

      alarmSoundPlayed = true;
      console.log("in alarm function: alarmSoundPlayed", alarmSoundPlayed);

      updateNextSpaceAlertTime(spaceVideo.currentTime + 1);

      setTimeout(() => {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
      }, 6000);
    }

    if (Math.abs(spaceVideo.currentTime - nextPauseTime) <= 0.2) {
      if (allowToCheck) {
        checkVideoTime(isSpace);
        updateNextSpacePauseTime(spaceVideo.currentTime + 1);
      }
      } else {
      allowToCheck = true;
      pauseAnimation = false;
      }
  
  }

  if (menu.state === 'title') {
    currentTime = Date.now();

    if (replayAgain) {
      pauseBtn.classList.add('hidden');

      spaceMusic.pause();
      spaceMusic.currentTime = 0;
      streetMusic.pause();
      streetMusic.currentTime = 0;
      menuMusic.pause();
      menuMusic.currentTime = 0;

      setVideoStartTime("城市");
      setVideoStartTime("太空");
      resource.load(() => init())

      console.log("reset successfully");

      replayAgain = false;
      firstTimePlay = true;
      isSpace = false;
      isStreet = false;
      inInstruction = true;
    }

    if (menu.showMenu === 1) {
      toggleMusic('event', 'musicOn', menu.selectedOptions[0]);
    }

    // 檢查是否超過更新間隔
    if (currentTime - lastMenuUpdateTime > menuUpdateInterval) {
      menu.update();
      lastMenuUpdateTime = currentTime; // 更新上次的時間
    }

    // 檢查自上次按鍵按下是否已經超過2分鐘
    menu.renderSelection(selectionCanvas);
    menu.renderBackground(backgroundCanvas);

  }
  startLoop();

};


const startLoop = () => {
  const { backgroundCanvas, selectionCanvas, menu, background, width, height } = loopParams;
    cancelAnimationFrame(requestID);
    // 使用 requestAnimationFrame 來更新
    requestID = requestAnimationFrame(() => loop(backgroundCanvas, selectionCanvas, menu, background, width, height));
};


/*     init    */

const init = () => {

  const backgroundCanvasElement = document.querySelector('#backgroundCanvas');
  const backgroundCanvas = new Render(backgroundCanvasElement.getContext('2d'));

  const selectionCanvasElement = document.querySelector('#selectionCanvas');
  const selectionCanvas = new Render(selectionCanvasElement.getContext('2d'));

  const {width, height} = (3840, 2160);

  const menu = new Menu(width, height);

  loopParams = {
    backgroundCanvas, selectionCanvas, menu, width, height
  };
  startLoop();
  setVideoStartTime("城市");

};

resource
  .add('arrowKeys', arrowKeysURL)
  .add('enterKey', enterKeyURL)
  .load(() => init())
