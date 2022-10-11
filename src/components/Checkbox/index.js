import React from 'react';
import PropTypes from 'prop-types';
import './index.module.css'

const Checkbox = props => {
    return (
        <div className={`CheckContainer ${props.checkClassName}`}>
            <input type="checkbox" className={`Checkbox ${props.className}`} name={props.name} id={props.id}
                   checked={props.checked} style={props.style} onChange={props.onChange}/>
            <label htmlFor={props.id}>{props.label}</label>
        </div>
    );
};

Checkbox.defaultProps = {
    id: null,
    label: null,
    className: null,
    checkClassName: null,
    name: null,
    checked: false,
    style: {},
    onChange: _ => null
};

Checkbox.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    checkClassName: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.bool,
    style: PropTypes.object,
    onChange: PropTypes.func
};

export default Checkbox;
