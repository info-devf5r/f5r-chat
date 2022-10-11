import React from 'react';
import Slider from 'react-slick'
import PropTypes from 'prop-types';

const Carousel = props => {

    const setting = {
        focusOnSelect: props.focusOnSelect,
        dots: props.dots,
        infinite: props.infinite,
        speed: props.speed,
        slidesToShow: props.slidesToShow,
        slidesToScroll: props.slidesToScroll,
        initialSlide: props.initialSlide,
        center: props.center,
        autoplay: props.autoplay,
        autoplaySpeed: props.autoplaySpeed,
        cssEase: props.transition,
        rtl: props.rtl,
        pauseOnHover: props.pauseOnHover,
        swipeToSlide: props.swipeToSlide,
        beforeChange: props.beforeChange,
        afterChange: props.afterChange,
        vertical: props.vertical,
        verticalSwiping: props.verticalSwiping,
        responsive: props.responsive,
    }

    const HeaderSlider = () => {
        return (
            <div className={props.className}>
                <Slider {...setting}>
                    {props.children}
                </Slider>
            </div>
        )
    }

    if (props.header) {
        return (
            <HeaderSlider/>
        )
    } else {
        return (
            <div className={props.className}>
                <Slider {...setting}>
                    {props.children}
                </Slider>
            </div>
        );
    }

};

Carousel.defaultProps = {
    header: false,
    focusOnSelect: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    center: false,
    autoplay: false,
    autoplaySpeed: 2000,
    cssEase: 'linear',
    rtl: false,
    pauseOnHover: false,
    swipeToSlide: true,
    beforeChange: _ => null,
    afterChange: _ => null,
    vertical: false,
    verticalSwiping: false,
    responsive: [],
    className: '',
}

Carousel.propTypes = {
    header: PropTypes.bool,
    focusOnSelect: PropTypes.bool,
    dots: PropTypes.bool,
    infinite: PropTypes.bool,
    speed: PropTypes.number,
    slidesToShow: PropTypes.number,
    slidesToScroll: PropTypes.number,
    initialSlide: PropTypes.number,
    center: PropTypes.bool,
    autoplay: PropTypes.bool,
    autoplaySpeed: PropTypes.number,
    cssEase: PropTypes.string,
    rtl: PropTypes.bool,
    pauseOnHover: PropTypes.bool,
    swipeToSlide: PropTypes.bool,
    beforeChange: PropTypes.func,
    afterChange: PropTypes.func,
    vertical: PropTypes.bool,
    verticalSwiping: PropTypes.bool,
    responsive: PropTypes.arrayOf[PropTypes.object],
    className: PropTypes.string,
};

export default Carousel;
