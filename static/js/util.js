import HandleInput from './handleInput.js';
import Resource from './resource.js';

const fieldOfView = (120 / 180) * Math.PI;
const theta = fieldOfView * 0.5;

const handleInput = new HandleInput();
const resource = new Resource();

const addItens = (liId, text) => {
  const li = document.querySelector(liId);
  li.textContent = text;
};

const toggleMusic = (_e, toggle, volume = '5') => {
  const menu = document.getElementById('menuMusic');
  const alarm = document.getElementById('alarmMusic');
  const question = document.getElementById('questionMusic');
  const space = document.getElementById('spaceMusic');
  const street = document.getElementById('streetMusic');
  const countDown = document.getElementById('countdownMusic')

  const mute = document.getElementById('muteBtn');

  let soundLevel = Number(volume) / 10;

  menu.volume = soundLevel;
  alarm.volume = soundLevel;
  question.volume = soundLevel;
  space.volume = soundLevel;
  street.volume = soundLevel;
  countDown.volume = soundLevel;

  if (!toggle) {
    menu.play();
    mute.classList.toggle('off');
    menu.muted = !menu.muted;
  }

  if (toggle === 'musicOn') {
    menu.play();
    mute.classList.remove('off');
    menu.muted = false;
  } else if (toggle === 'musicOff') {
    mute.classList.add('off');
    menu.muted = true;
  }
};

const playMusic = () => {
  const menu = document.getElementById('menuMusic');
  const mute = document.getElementById('muteBtn');
  menu.loop = true;
  menu.volume = 0.3;
  menu.muted = 'true';
  mute.classList.toggle('off');
  mute.addEventListener('click', toggleMusic);
};

export {
  handleInput, resource, fieldOfView, theta, addItens, toggleMusic, playMusic
};
