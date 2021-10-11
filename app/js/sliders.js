window.addEventListener('DOMContentLoaded', () => {
    const sliderBreakpoint = window.matchMedia('(max-width: 1200px)');

    const lineupSwiperSettings = {
        slidesPerView: 'auto',
        loop: false,
        speed: 200,
        simulateTouch: true,
        spaceBetween: 8,

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    };

    const newsSwiperSettings = {
        slidesPerView: 1,
        loop: false,
        speed: 500,

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
    };

    let lineupSwiper = new Swiper('.lineup_swiper', lineupSwiperSettings);    
    let newsSwiper = new Swiper('.news_swiper', newsSwiperSettings);

    const increaseSlideOnClick = () => {
        const lineupSwiperSlides = [...document.querySelectorAll('.swiper-slide')];

        for (let i = 0; i < lineupSwiperSlides.length; i++) {
            const item = lineupSwiperSlides[i];
            const itemImage = item.querySelector('.slide_image');

            if (itemImage) {
                itemImage.addEventListener('click', function() {
                    lineupSwiper.update();
    
                    const itemIndex = item.dataset.slideIndex;
                    lineupSwiper.slideTo(itemIndex - 1);
    
                    setTimeout(() => {
                        for (let i = 0; i < lineupSwiperSlides.length; i++) {
                            const item = lineupSwiperSlides[i];
                            item.classList.remove('wide-slide');
                            item.classList.remove('show_content');
                        }
            
                        item.classList.add('wide-slide');
            
                        setTimeout(() => {
                            item.classList.add('show_content');
                        }, 400);
                    }, 300);
                });
            }
        }

        return;
    };

    const breakpointChecker = () => {
        if (sliderBreakpoint.matches === true) {
            if (!lineupSwiper.destroyed) lineupSwiper.destroy(true, true);

            return;
        } else {
            if (lineupSwiper.destroyed) {
                lineupSwiper = new Swiper('.lineup_swiper', lineupSwiperSettings);    
                lineupSwiper.on('slideChange', () => {
                    lineupSwiper.update();
                });
            }

            return;
        }
    };

    if (sliderBreakpoint.matches === false) {
        increaseSlideOnClick();
    }
    
    breakpointChecker();    

    window.addEventListener('resize', () => {
        if (sliderBreakpoint.matches === false) {
            increaseSlideOnClick();
        }
        
        breakpointChecker();
    });

});
