const rots = [ 
  { ry: 0,   rx: 0  }, // 1
  { ry: 90,  rx: 0  }, // 2
  { ry: 180, rx: 0  }, // 3
  { ry: 270, rx: 0  }, // 4
  { ry: 0,   rx: 90 }, // 5
  { ry: 0,   rx:-90 }  // 6
];

let val = [1,1]

gsap.set(".face", {
  position:'absolute',
  userSelect:'none',
  width: '100%',
  height: '100%',
  rotateY: (i) => rots[i].ry,
  rotateX: (i) => rots[i].rx,
  transformOrigin: "50% 50% -150px",
  z: 150,
  background:(i)=>'url(https://assets.codepen.io/721952/dieSprite.svg) 0px -'+String(i*300)+'px'
});

let die2 = document.querySelector('.die').cloneNode(true);
document.querySelector('.tray').append(die2);

gsap.set('.die', {attr:{class:(i)=>'die die'+(i+1)}, width:300, height:300, perspective:999});
gsap.set('.cube', {position:'absolute', width:300, height:300, transformStyle: 'preserve-3d', z:-600});

function roll(){
  val[0] = gsap.utils.random(1,6,1)
  val[1] = gsap.utils.random(1,6,1)
  
  gsap.timeline()
    .to('.sum', {
      duration:0.17,
      overwrite:true,
      opacity:0,
      ease:'power1.inOut'
    }, 0)
    
    .fromTo('.cube', {
      z:-600
    },{
      duration:0.75,
      z:-300,
      ease:'expo',
      yoyoEase:'bounce.out(5)',
      repeat:1
    }, 0)
    
    .fromTo('.cube', {
      rotationX:(i)=>i==0?'-=360':'+=360' //this ensures that even if the new number is the same, it will do some rotation
    },{
      duration:1.5,
      ease:'back',
      rotationX:(i)=>-rots[val[i]-1].rx,
      rotationY:(i)=>-rots[val[i]-1].ry
    }, 0)
    
    .set('.sum', {
      textContent:String(val[0]+val[1])
    }, 0.8)
    
    .to('.sum', {
      opacity:1,
      ease:'power3.inOut'
    }, 0.8)  
}

window.onpointerup = window.onload = roll