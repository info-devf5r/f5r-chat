import React from 'react';
import styles from 'index.module.css'
import PropTypes from 'prop-types';

const Badge = props => {
    return (
        <div className={styles.Badge} onClick={props.onClick}>
            <div className={styles.number} style={{backgroundColor: props.backgroundColor,color:props.color}}>{props.number}</div>
            <img src={props.img} alt="" />
        </div>
    );
};

Badge.defaultProps = {
    number: null,
    img: null,
    backgroundColor: null,
    color:null,
    onClick: _ => null
}

Badge.propTypes = {
    number: PropTypes.number,
    img: PropTypes.string,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func
};

export default Badge;
