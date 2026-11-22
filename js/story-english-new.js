'use strict';
/* Original English-language fantasy. */
(() => {
  const scene = (stage, variant = 'a') => (paper) => (paper ? PaperScenes : Illustration).scene('dragon', stage, variant);
  const icon = () => `<path d="M0 -26L21 0L0 22L-21 0Z" fill="#cc775c"/><path d="M0 -26v48M-21 0h42M0 22q-12 8 0 13" stroke="#f9d594" stroke-width="2" fill="none"/>`;
  STORIES.push({
    painted: true, id: 'english-dragon', title: 'Moss and the Kite That Sneezed', place: 'A dragon’s very windy afternoon', ink: '#41545d', paper: '#fff8ed', accent: '#b86447', length: 6, start: 'mk1', cover: scene(4),
    pages: {
      mk1: {title: 'A customer with a tail', next: 'mk2', text: ["Moss mends kites, large and small.","His tiny shop has room for all.","Mouse brings a red one. \"It dips! It dives! It keeps landing in the cabbages!\" Moss takes a look."], scene: scene(0)},
      mk2: {title: 'The sneeze', next: 'mk3', text: ["A feather tickles Moss's nose.","\"Ah... ah... ATCHOO!\" Up the kite goes!","It catches on a hook. Rrrip! No fire. Just one huge puff. \"Oh dear,\" whispers Moss. Mouse stares."], scene: scene(1)},
      mk3: {title: 'We can fix it', next: 'mk4', text: ["\"I tore it. I'm sorry,\" says Moss.","\"We can fix it,\" says Mouse.","Paper and paste. Ribbon and string. Moss lays out everything they need. \"We can make it even better!\""], scene: scene(2)},
      mk4: {title: 'Choose a new kite', ask: 'What shape shall they give the kite?', text: ["Moss draws a comet with a long red tail.","Mouse draws a bird that can swoop and sail.","\"Which shall we make?\" asks Moss. \"Something that flies above the cabbages, please!\" says Mouse."], choice: [{label: 'A comet with a ribbon tail', to: 'mk5a', icon}, {label: 'A bird with broad wings', to: 'mk5b', icon}], scene: scene(3)},
      mk5a: {title: 'The ribbon test', next: 'mk6a', text: ["Patch it. Press it. Let it dry.","Tie on ribbons. Time to try!","Moss holds the string. Mouse gives a cheer. The comet wobbles, then climbs into the wind."], scene: scene(4, 'a')},
      mk6a: {title: 'A comet above the cabbages', end: {id: 'kite-comet', name: 'The red ribbon comet'}, back: 'mk4', text: ["Red kite high. Green cabbages low.","Two bright ribbons stream and flow.","\"Your patch looks like a medal!\" says Mouse. Moss beams. His nose twitches. This time, he turns away. \"Achoo!\""], scene: scene(5, 'a')},
      mk5b: {title: 'Wings for a windy day', next: 'mk6b', text: ["A light new frame. Two paper wings.","Two long ribbons trail behind.","When the paste is dry, they test it on the hill. Up it swoops! Mouse squeaks with joy."], scene: scene(4, 'b')},
      mk6b: {title: 'The bird that borrowed the wind', end: {id: 'kite-bird', name: 'The bright paper bird'}, back: 'mk4', text: ["A real bird circles. \"Who are you?\"","Mouse laughs. Moss does too.","Back at the shop, they paint a sign: KITES MENDED HERE. Moss adds a rule: \"Sneeze the other way!\""], scene: scene(5, 'b')}
    }
  });
})();
