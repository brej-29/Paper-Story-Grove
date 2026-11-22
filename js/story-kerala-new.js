'use strict';
/* Original fiction; cultural background and sources: docs/replacement-stories.md. */
(() => {
  const scene = (stage, variant = 'a') => (paper) => (paper ? PaperScenes : Illustration).scene('feast', stage, variant);
  const icon = () => `<path d="M-29 5Q-12 -25 30 -9Q16 24 -29 5Z" fill="#548b52"/><path d="M-25 5L26 -8" stroke="#d5dd8e" stroke-width="2"/>`;
  STORIES.push({
    painted: true, id: 'kerala-feast', title: 'Dev and the Extra Banana Leaf', place: 'An Onam sadya in Kerala', ink: '#345844', paper: '#fff9e8', accent: '#a56a2f', length: 6, start: 'df1', cover: scene(4),
    pages: {
      df1: {title: 'The leaf inspector', next: 'df2', text: ["Green banana leaves, neat in a row.","Dev lays them down. His tummy rumbles.","It is Onam. The sadya feast is nearly ready. \"Pointy ends left,\" says Grandmother. Dev checks."], scene: scene(0)},
      df2: {title: 'Knock, knock, one more', next: 'df3', text: ["Curry bubbles in the kitchen.","Knock, knock! Who has come to eat?","It is Leela, off the early bus! Dev hugs his cousin. Then he counts the leaves."], scene: scene(1)},
      df3: {title: 'The pappadam problem', next: 'df4', text: ["One more cousin. One more place.","But the long row has no more space!","Dev tucks in his elbows. Leela laughs. \"Will you eat with your nose? Let's move the mats!\""], scene: scene(2)},
      df4: {title: 'Make room for Leela', ask: 'How will Dev arrange the feast?', text: ["The leaves are empty. There is time.","\"We could make one longer line,\" says Dev.","\"Or two short rows,\" says Leela. \"With room to serve between!\" How shall they make a place?"], choice: [{label: 'Make one lovely long row', to: 'df5a', icon}, {label: 'Make two friendly rows', to: 'df5b', icon}], scene: scene(3)},
      df5a: {title: 'A row with room to grow', next: 'df6a', text: ["Move the stool. Unroll the mat.","\"There!\" says Dev. \"A place to chat!\"","Leela sits beside him. Little piles of vegetables go on each leaf. Next comes the rice."], scene: scene(4, 'a')},
      df6a: {title: 'The best extra', end: {id: 'feast-long-row', name: 'The lovely long Onam row'}, back: 'df4', text: ["Dev bites his pappadam. CRUNCH!","Sweet payasam comes at last.","\"What is best?\" asks Leela. Dev grins. \"You! Lunch is twice as nice with you beside me.\""], scene: scene(5, 'a')},
      df5b: {title: 'Hello across the leaves', next: 'df6b', text: ["Two short rows, face to face.","A clear path runs down the middle.","Dev checks each leaf: pointy end left. Dishes arrive, then rice. Leela gives him a smile."], scene: scene(4, 'b')},
      df6b: {title: 'A feast full of faces', end: {id: 'feast-facing-rows', name: 'The two friendly Onam rows'}, back: 'df4', text: ["Leela crunches. Dev goes CRUNCH!","Happy faces, happy lunch.","Now comes sweet payasam. Dev looks at the two full rows. There is room for everyone, and Leela is smiling back."], scene: scene(5, 'b')}
    }
  });
})();
