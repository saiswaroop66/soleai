/* ===========================================================
    SoleAI
    Animation Library

    File : animations.js
    Version : 1.0
=========================================================== */

"use strict";

/* ===========================================================
                FADE UP
=========================================================== */

function fadeUp(target){

    gsap.from(target,{

        scrollTrigger:{

            trigger:target,

            start:"top 85%"

        },

        y:60,

        opacity:0,

        duration:1

    });

}


/* ===========================================================
                FADE DOWN
=========================================================== */

function fadeDown(target){

    gsap.from(target,{

        scrollTrigger:{

            trigger:target,

            start:"top 85%"

        },

        y:-60,

        opacity:0

    });

}


/* ===========================================================
                FADE LEFT
=========================================================== */

function fadeLeft(target){

    gsap.from(target,{

        scrollTrigger:{

            trigger:target,

            start:"top 85%"

        },

        x:-80,

        opacity:0

    });

}


/* ===========================================================
                FADE RIGHT
=========================================================== */

function fadeRight(target){

    gsap.from(target,{

        scrollTrigger:{

            trigger:target,

            start:"top 85%"

        },

        x:80,

        opacity:0

    });

}


/* ===========================================================
                SCALE IN
=========================================================== */

function scaleIn(target){

    gsap.from(target,{

        scrollTrigger:{

            trigger:target,

            start:"top 85%"

        },

        scale:.8,

        opacity:0

    });

}


/* ===========================================================
                STAGGER
=========================================================== */

function stagger(target){

    gsap.from(target,{

        scrollTrigger:{

            trigger:target,

            start:"top 85%"

        },

        y:50,

        opacity:0,

        stagger:.2

    });

}


/* ===========================================================
                ROTATE
=========================================================== */

function rotate(target){

    gsap.from(target,{

        scrollTrigger:{

            trigger:target,

            start:"top 90%"

        },

        rotation:30,

        opacity:0

    });

}


/* ===========================================================
                COUNTER
=========================================================== */

function counter(target){

    document.querySelectorAll(target).forEach(item=>{

        const end=parseInt(item.innerText);

        const obj={value:0};

        gsap.to(obj,{

            value:end,

            duration:2,

            ease:"power2.out",

            scrollTrigger:{

                trigger:item,

                start:"top 90%"

            },

            onUpdate(){

                item.innerText=Math.floor(obj.value)+"+";

            }

        });

    });

}


/* ===========================================================
                FLOAT
=========================================================== */

function floating(target){

    gsap.to(target,{

        y:-20,

        repeat:-1,

        yoyo:true,

        duration:2,

        ease:"sine.inOut"

    });

}


/* ===========================================================
                PULSE
=========================================================== */

function pulse(target){

    gsap.to(target,{

        scale:1.05,

        repeat:-1,

        yoyo:true,

        duration:1.2

    });

}


/* ===========================================================
                TEXT REVEAL
=========================================================== */

function revealText(target){

    gsap.from(target,{

        scrollTrigger:{

            trigger:target,

            start:"top 85%"

        },

        y:100,

        opacity:0,

        stagger:.05

    });

}


/* ===========================================================
                BUTTON HOVER
=========================================================== */

document.querySelectorAll(".btn").forEach(button=>{

    button.addEventListener("mouseenter",()=>{

        gsap.to(button,{

            scale:1.05,

            duration:.3

        });

    });

    button.addEventListener("mouseleave",()=>{

        gsap.to(button,{

            scale:1,

            duration:.3

        });

    });

});


/* ===========================================================
                CARD HOVER
=========================================================== */

document.querySelectorAll(".card").forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        gsap.to(card,{

            y:-10,

            duration:.3

        });

    });

    card.addEventListener("mouseleave",()=>{

        gsap.to(card,{

            y:0,

            duration:.3

        });

    });

});


/* ===========================================================
                END OF FILE
=========================================================== */