/* ===========================================================
   SoleAI Footer
   File : footer.js
   Version : 1.0
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeFooter();

});

/* ===========================================================
                INITIALIZE FOOTER
=========================================================== */

function initializeFooter(){

    footerAnimation();

    smoothFooterLinks();

    footerCopyright();

}

/* ===========================================================
                GSAP FOOTER ANIMATION
=========================================================== */

function footerAnimation(){

    if(typeof gsap === "undefined") return;

    gsap.from(".footer-column",{

        scrollTrigger:{

            trigger:".footer",

            start:"top 85%"

        },

        opacity:0,

        y:60,

        duration:.8,

        stagger:.2,

        ease:"power3.out"

    });

}

/* ===========================================================
                SMOOTH SCROLL
=========================================================== */

function smoothFooterLinks(){

    const links=document.querySelectorAll('a[href^="#"]');

    links.forEach(link=>{

        link.addEventListener("click",(e)=>{

            const target=document.querySelector(
                link.getAttribute("href")
            );

            if(target){

                e.preventDefault();

                window.scrollTo({

                    top:target.offsetTop-80,

                    behavior:"smooth"

                });

            }

        });

    });

}

/* ===========================================================
                COPYRIGHT YEAR
=========================================================== */

function footerCopyright(){

    const year=new Date().getFullYear();

    const copyright=document.querySelector(".footer-bottom p");

    if(copyright){

        copyright.innerHTML=
        `© ${year} SoleAI. All Rights Reserved.`;

    }

}

/* ===========================================================
                    END OF FILE
=========================================================== */