import typeSoft from "../../../../public/assets/sound/typeSoft.wav";
import keyboard from "../../../../public/assets/sound/keyboard.wav";
import cherryBlue from "../../../../public/assets/sound/cherryBlue.wav";

const SOUND_MAP = {
    "keyboard" : keyboard,
    "typewriter": typeSoft,
    "cherry": cherryBlue
}

const soundOptions = [
  { label: "keyboard" },
  { label: "typewriter" },
  { label: "cherry" },
];

const soundConverter = {
  "keyboard" : "SOUND_KEYBOARD",
  "typewriter" : "SOUND_WRITER",
  "cherry" : "SOUND_CHERRY"
}

const SOUND_CHERRY = "cherry";
const SOUND_MODE = "sound";
const SOUND_WRITER = "typewriter";
const SOUND_KEYBOARD = "keyboard";

export { soundOptions, SOUND_CHERRY, SOUND_WRITER, SOUND_MODE, SOUND_KEYBOARD, SOUND_MAP, soundConverter };
