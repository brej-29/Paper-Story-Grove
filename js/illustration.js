'use strict';
/* Every page owns one complete painting, including both alternate endings.
   Frame order: 1,2,3,choice,5a,6a,5b,6b. No cropped/repeated contact sheets. */
const Illustration = (() => {
  const files = ['01','02','03','04','05a','06a','05b','06b'];
  // Each tuple is x,y,label,caption,sound. Coordinates belong to this page.
  const details = {
    lamps: [
      [[510,470,'The last lamp','One tiny lamp. One big welcome!','twinkle'],[450,200,'Paatti','Paatti will light the lamps.','bell'],[190,300,'Anu','Count with Anu. One, two, three!','pluck']],
      [[510,430,'The quiet lane','Tiptoe, tiptoe. Who is coming home?','pluck'],[600,260,'The dark house','A little light could say hello.','twinkle'],[270,360,'Anu waiting','Give a little welcoming wave.','giggle']],
      [[350,450,'The lamp row','One by one, the little lights glow.','twinkle'],[740,285,'The bicycle','Ding-ding! Try a little bicycle bell.','bell'],[500,225,'Anu calling','Call a friendly hello!','pluck']],
      [[110,270,'The doorway','A light by the door can say hello.','bell'],[580,390,'The last lamp','Where shall this little light go?','twinkle'],[740,160,'The chair','Who would you save a seat for?','pluck']],
      [[100,470,'The welcome light','A little golden hello!','twinkle'],[650,300,'Revathi','Step, step. Rustle, rustle.','pluck'],[210,210,'Anu waving','Wave hello with Anu!','giggle']],
      [[470,330,'The little lamp','Small can be special.','twinkle'],[610,240,'Revathi smiling','You waited for me!','giggle'],[390,300,'Anu','Who would you welcome home?','pluck']],
      [[300,430,'The extra chair','A chair, a sweet, a little light.','pluck'],[200,130,'The open gate','Come in! We saved a seat.','bell'],[650,250,'Paatti and the lamp','An adult lights the little lamp.','twinkle']],
      [[240,400,'The sweets','What treat would you share?','pluck'],[740,450,'The little light','The night feels warm and bright.','twinkle'],[430,300,'Friends together','Nobody is left out.','giggle']]
    ],
    feast: [
      [[450,440,'The banana leaves','Find the pointy ends!','pluck'],[350,310,'Dev','Can your tummy make a growl?','giggle'],[620,240,'Grandmother','Pointy ends to the left.','bell']],
      [[640,220,'Leela','Knock, knock! One more cousin!','bell'],[570,330,'Dev','Give someone a great big smile.','giggle'],[700,380,'The travel bag','Leela caught the early bus.','pluck']],
      [[570,300,'Dev and his elbows','Tuck your elbows in. Too tight!','giggle'],[430,170,'Leela laughing','Eat with your nose? What a thought!','pluck'],[730,350,'The little stool','Could moving this make room?','bell']],
      [[570,430,'The empty leaves','There is time to make a place.','pluck'],[200,300,'The extra leaf','One more cousin, one more leaf.','bell'],[620,300,'The open floor','One long row, or two short rows?','giggle']],
      [[210,350,'Dev and Leela','Side by side, a place to chat.','giggle'],[580,320,'The long row','Follow the leaves along the row.','pluck'],[700,260,'The rice server','Here comes the rice!','bell']],
      [[500,460,'The pappadam','Make a little CRUNCH!','giggle'],[580,540,'The payasam','A sweet finish to the feast.','bell'],[460,260,'Cousins together','Who makes your lunch more fun?','pluck']],
      [[220,430,'The near row','Find the pointy ends.','pluck'],[610,300,'The far row','Hello across the leaves!','giggle'],[440,380,'The serving space','Room to walk. Room to serve.','bell']],
      [[220,330,'Dev crunching','Crunch! Can you make that sound?','giggle'],[650,300,'Leela smiling','Happy faces, happy lunch!','pluck'],[430,440,'Sweet payasam','One extra leaf. One extra smile.','bell']]
    ],
    dragon: [
      [[300,300,'Moss','Tiny claws. Clever knots!','pluck'],[600,380,'Mouse','One small customer. One big problem.','squeak'],[520,290,'The red kite','Dip! Dive! Up into the sky?','wind']],
      [[220,300,'The tickly nose','Ah... ah... ATCHOO!','wind'],[620,200,'The torn kite','Rrrip! What could mend it?','pluck'],[480,430,'Mouse','Make a surprised mouse face!','squeak']],
      [[270,230,'Moss','I am sorry. I can help.','pluck'],[500,400,'The patch','A patch can be a wonderful thing.','bell'],[610,280,'Mouse','Friends can fix things together.','squeak']],
      [[200,400,'The comet plan','A long red tail to swoosh and sail.','wind'],[560,400,'The bird plan','Spread your arms like paper wings.','pluck'],[380,200,'Two kite makers','What would you make?','squeak']],
      [[650,180,'The ribbon comet','Wobble, wobble. Up it goes!','wind'],[380,330,'Moss','Lift it gently. Catch the breeze!','pluck'],[130,450,'Mouse cheering','Give a tiny mouse cheer!','squeak']],
      [[650,170,'The high kite','Follow the ribbons with your finger.','wind'],[230,330,'Moss turns away','A tiny polite achoo!','pluck'],[450,500,'The cabbages','Green cabbages, safe below!','giggle']],
      [[450,160,'The paper bird','Swoop! It flies without flapping.','wind'],[260,350,'Moss','A patch and wings. A brand-new thing!','pluck'],[490,460,'Mouse','Give a tiny mouse cheer!','squeak']],
      [[340,300,'Moss','Which way should a sneeze go?','giggle'],[550,150,'The paper bird','A mistake became a kite with wings.','wind'],[520,410,'Mouse','What shall these friends mend next?','squeak']]
    ]
  };
  function scene(kind, stage, variant = 'a') {
    const n = stage < 4 ? stage : 4 + (variant === 'b' ? 2 : 0) + stage - 4;
    const painting = `<image class="painting painting-${kind}" href="assets/stories/${kind}/${files[n]}.webp" width="800" height="600" preserveAspectRatio="xMidYMid meet"/>`;
    const discoveries = details[kind][n].map(([x,y,label,caption,sound],i) =>
      F('detail-'+i,label,caption,sound,'reveal',`<circle class="discovery-ring" cx="${x}" cy="${y}" r="18"/><path d="M${x-6} ${y}h12M${x} ${y-6}v12" stroke="#fff8e8" stroke-width="2.5" stroke-linecap="round"/>`,[x,y,48])
    ).join('');
    return [painting, `<g class="illustrated-details">${discoveries}</g>`];
  }
  return {scene};
})();

