//Gradient example and tutorial by designers decode on youtube: https://youtu.be/1F_QKGrwsNo?si=IPjGla4iqXghGnwp. It uses p5js Instance Mode to import p5 as an ES module, and also uses the Fette Palette library from NPM.

import p5 from "p5";
import {generateRandomColorRamp} from "fettepalette";

//stringify hsl palette to hsl strings
let toHSLstring = (col, a=1) =>
  `hsla(${col[0] | 0}, ${(col[1] * 100) | 0}%, ${(col[2] * 100) | 0}%, ${a})`;

//In Instance Mode, always add "p." in front of any variable or function name
/** @param {p5} p */ 
const sketch = (p) => {
  let ctx;

  // Create an array of gradients
  let gradData = []; // {pos1, r1, c1, pos2, r2, c2}
  let numGrad = 25;

  // Create a random color generator from fette palette
  let palette = generateRandomColorRamp({
    total: numGrad,
    centerHue: Math.random() * 300,
    hueCycle: Math.random()*0.8 + 0.2,
    offsetTint: 0.8,
    offsetShade: 0.2,
    minSaturationLight: [0, 0.6],
    colorModel: "hsl" 
  }).base;

  console.log(palette);

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    //use canvas code (?)
    ctx = p.drawingContext; 

    // generate random gradient data and push to gradData
    for (let i = 0; i <numGrad; i++){
      let pos1 = [Math.random()*p.width, Math.random()*p.height];
      let pos2 = pos1;
      let r1 = Math.random()*5 + 8; //+1 so that it will at least be 1 pixel
      let r2 = Math.random()*30 + p.width/3; //at least width/5
      let c1 = toHSLstring(palette[Math.floor(Math.random() * palette.length)]);
      let c2 = toHSLstring(palette[Math.floor(Math.random() * palette.length)], 0);

      gradData.push ({pos1, r1, c1, pos2, r2, c2});

      console.log(gradData);
    }
  };

  p.draw = () => {
    p.background(200);

    gradData.forEach((g, i) =>{
      let grad = ctx.createRadialGradient(g.pos1[0], g.pos1[1], g.r1, g.pos2[0], g.pos2[1], g.r2);
      grad.addColorStop(0, g.c1);
      grad.addColorStop(1, g.c2);

      p.push();
      ctx.fillStyle = grad;
      p.noStroke();
      p.rect(0, 0, p.width, p.height);
      p.pop();
    });

    // //grad 1
    // let grad = ctx.createRadialGradient(p.width/4,p.height/3, 1, p.width/4,p.height/3, p.width/3)
    // grad.addColorStop(0, "blue");
    // grad.addColorStop(0.5, "pink");
    // grad.addColorStop(1, "rgba(255, 255, 0, 0");

    // p.push();
    // ctx.fillStyle = grad;
    // p.noStroke();
    // p.rect(0, 0, p.width, p.height);
    // p.pop();

    // //grad 2
    // let grad2 = ctx.createRadialGradient(p.width/4*3,p.height/3*2, 0.1, p.width/4*3,p.height/3*2, p.width/2)
    // grad2.addColorStop(0, "green");
    // grad2.addColorStop(0.5, "violet");
    // grad2.addColorStop(1, "rgba(255, 0, 0, 0");

    // p.push();
    // ctx.fillStyle = grad2;
    // p.noStroke();
    // p.rect(0, 0, p.width, p.height);
    // p.pop();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);

