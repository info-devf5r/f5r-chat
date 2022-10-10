import React from "react";
import About from "../../components/About/About";
import pointIcon from "../../assets/pointFinger.svg";
import errSpaceship from "../../assets/errSpaceship.svg";
import "./NotFound.scss";

function NotFound() {
    return (
        <main className="main">
            <div className="main__about">
                <About />
            </div>
            <div className="notfound">
                <img className="notfound__img" src={errSpaceship} alt="404 image" />
                <div className="notfound__text">
                    <h1 className="notfound__title">Oops! </h1>
                    <h2 className="notfound__subtitle">Seems like you got lost.. 😢</h2>
                </div>
            </div>
            <div className="direct">
                <img className="direct__icon" src={pointIcon} alt="point icon" />
                <p className="direct__text">Click here to join a chat room</p>
            </div>
        </main>
    )
}

export default NotFound;