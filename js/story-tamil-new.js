'use strict';
/* Original fiction; cultural background and sources: docs/replacement-stories.md. */
(() => {
  const scene = (stage, variant = 'a') => (paper) => (paper ? PaperScenes : Illustration).scene('lamps', stage, variant);
  const icon = () => `<path d="M-24 3Q0 27 24 3Z" fill="#b56141"/><path d="M4 1Q-7 -12 4 -26Q15 -12 4 1Z" fill="#efbf61"/>`;
  STORIES.push({
    painted: true, id: 'tamil-lamps', title: 'Anu and the Last Little Lamp', place: 'Karthigai Deepam in Tamil Nadu', ink: '#593347', paper: '#fff5e4', accent: '#b65b39', length: 6, start: 'al1', cover: scene(4),
    pages: {
      al1: {title: 'One lamp left', next: 'al2', text: ["Little clay lamps, all in a row.","Soon it is time for their golden glow.","Anu helps her grandmother, Paatti, count them. Karthigai Deepam is here! One tiny lamp is left on the tray."], scene: scene(0)},
      al2: {title: 'Someone is missing', next: 'al3', text: ["The sun slips low. The lane grows dark.","Across the lane, Revathi's windows are dark too.","She is late from the market. Anu looks for her. Who will welcome her home?"], scene: scene(1)},
      al3: {title: 'A light at the bend', next: 'al4', text: ["Paatti lights the waiting row.","One by one, the small flames glow.","\"Revathi aunty!\" Anu calls. Ding-ding! A loud bicycle bell rings over her voice. The last little lamp still waits."], scene: scene(2)},
      al4: {title: 'Choose a place', ask: 'Where will Anu welcome Revathi?', text: ["\"Let's save a light for her,\" says Anu.","By the door, it can say hello. In the courtyard, it can glow beside a chair.","\"You choose,\" says Paatti. \"I'll light it.\""], choice: [{label: 'A light beside the doorway', to: 'al5a', icon}, {label: 'A welcome in the courtyard', to: 'al5b', icon}], scene: scene(3)},
      al5a: {title: 'The little golden hello', next: 'al6a', text: ["Paatti lights the lamp on a safe ledge.","Anu waves beside the door.","Step, step, rustle! Here comes Revathi with her shopping bag. \"A little light! Is that for me?\""], scene: scene(4, 'a')},
      al6a: {title: 'Just in time', end: {id: 'lamp-doorway', name: 'The golden doorstep welcome'}, back: 'al4', text: ["\"For you!\" calls Anu. \"Come and see!\"","Revathi smiles. \"You waited for me.\"","Big lamps, small lamps, all shine bright. The tiniest one says, \"Welcome home tonight!\""], scene: scene(5, 'a')},
      al5b: {title: 'A place in the circle', next: 'al6b', text: ["Anu brings a chair. Paatti lights the lamp on a clear stone ledge.","\"Come in, come in! We saved a seat!\"","Revathi hears and smiles. She follows Anu into the courtyard."], scene: scene(4, 'b')},
      al6b: {title: 'The brightest place', end: {id: 'lamp-courtyard', name: 'A place in the lamp-lit courtyard'}, back: 'al4', text: ["A chair, a sweet, a little light.","A friend comes home this starry night.","Revathi sits beside Anu. The last little lamp glows close by. Nobody is left out."], scene: scene(5, 'b')}
    }
  });
})();
