import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import "./About.scss";


function About() {

    const popover = (
        <Popover id="popover-basic" className="about__overlay">
            <Popover.Header as="h3" className="about__title">Welcome to LiteChat~</Popover.Header>
            <Popover.Body className='about__body'>
                <div className="about__text">
                    <p>
                        This is Nancy. 🫡 I built this fullstack project with React & Node.js.
                    </p>
                    <p>
                        Know more or reach me at:
                    </p>
                </div>
                <div className="about__contact">
                    <a href="https://github.com/nancy-sun" target="_blank" className="about__github"></a>
                    <a href="https://www.linkedin.com/in/-nancy-sun/" target="_blank" className="about__linkedin"></a>
                    <a href="mailto:nancysnx1110@gmail.com" target="_blank" className="about__email"></a>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <button className="about"></button>
        </OverlayTrigger>
    )
}

export default About;