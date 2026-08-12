/* ===========================================================
    SoleAI
    GSAP Initialization

    File : gsap-init.js
    Version : 1.0
=========================================================== */

"use strict";

/* ===========================================================
                    REGISTER PLUGINS
=========================================================== */

gsap.registerPlugin(

    ScrollTrigger,

    ScrollToPlugin

);


/* ===========================================================
                    GSAP DEFAULTS
=========================================================== */

gsap.defaults({

    ease:"power3.out",

    duration:1

});


/* ===========================================================
                    REFRESH
=========================================================== */

window.addEventListener("load",()=>{

    ScrollTrigger.refresh();

});


/* ===========================================================
                HERO ANIMATION
=========================================================== */

const heroTimeline = gsap.timeline();

heroTimeline

.from(".hero-badge",{

    y:40,

    opacity:0

})

.from(".hero-content h1",{

    y:60,

    opacity:0

},"-=0.5")

.from(".hero-content p",{

    y:40,

    opacity:0

},"-=0.5")

.from(".hero-buttons",{

    y:30,

    opacity:0

},"-=0.5")

.from(".hero-stats",{

    y:30,

    opacity:0

},"-=0.5")

.from(".hero-image img",{

    scale:.8,

    opacity:0,

    duration:1.4

},"-=0.8");


/* ===========================================================
                FLOATING SHOE
=========================================================== */

gsap.to(".hero-image img",{

    y:-20,

    repeat:-1,

    yoyo:true,

    duration:2.5,

    ease:"sine.inOut"

});


/* ===========================================================
                SECTION TITLES
=========================================================== */

gsap.utils.toArray(".section-title").forEach(title=>{

    gsap.from(title,{

        scrollTrigger:{

            trigger:title,

            start:"top 85%"

        },

        y:50,

        opacity:0

    });

});


/* ===========================================================
                CARDS
=========================================================== */

gsap.utils.toArray(

    ".collection-card,.category-card,.ai-card,.product-card,.why-card,.testimonial-card"

).forEach(card=>{

    gsap.from(card,{

        scrollTrigger:{

            trigger:card,

            start:"top 90%"

        },

        y:60,

        opacity:0,

        duration:.8

    });

});


/* ===========================================================
                BRAND LOGOS
=========================================================== */

gsap.from(".brand",{

    scrollTrigger:{

        trigger:".brands",

        start:"top 80%"

    },

    opacity:0,

    y:40,

    stagger:.15

});


/* ===========================================================
                NEWSLETTER
=========================================================== */

gsap.from(".newsletter-content",{

    scrollTrigger:{

        trigger:".newsletter",

        start:"top 80%"

    },

    scale:.9,

    opacity:0

});


/* ===========================================================
                CTA
=========================================================== */

gsap.from(".cta-content",{

    scrollTrigger:{

        trigger:".cta-banner",

        start:"top 80%"

    },

    y:70,

    opacity:0

});


/* ===========================================================
                PARALLAX HERO
=========================================================== */

gsap.to(".hero-image",{

    yPercent:15,

    ease:"none",

    scrollTrigger:{

        trigger:".hero",

        scrub:true

    }

});


/* ===========================================================
                END OF FILE
=========================================================== */