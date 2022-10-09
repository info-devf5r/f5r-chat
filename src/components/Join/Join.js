import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";
import readingBook from "../../icons/readingBook.svg"; 
// import InfoComponent from "./components/InfoComponent"
// import FormComponent from "./components/FormComponent";

const Join = () => {
  
  const [viewInfo, setViewInfo] = useState(0); 
  const toggle = () => { setViewInfo(!viewInfo); }

  const FormComponent = ()=> {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    return (<div>
      <div>
        <input
          placeholder="Name"
          className="joinInput bgtert"
          type="text"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </div>
      <div>
        <input
          placeholder="Room"
          className="joinInput mt-20 bgtert"
          type="text"
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
      </div>
      <Link
        onClick={(e) => (!room || !name) && e.preventDefault()}
        to={`/chat?name=${name}&room=${room}`}
      >
        <button className="button mt-20 fontprime bgbutton" type="submit">
          Sign In
        </button>
      </Link>
      <p className="helpbutton" onClick={ toggle }> مساعدة / كيفية الاستخدام</p>
  </div>)
  }

  const InfoComponent = ()=> {
    return (<div className="helptext ">
      <p> 
        <u>كيف تستعمل</u>: اختر معرّف غرفة فريدًا بنفسك وشاركه مع أصدقائك.
        انضموا إلى الغرفة وادرسوا معًا باستخدام القنوات النصية والصوتية.
        لا يتطلب التسجيل.
      </p> 
      <p>
        <u>Info</u>: يهدف التطبيق إلى وضع القنوات النصية والصوتية على نفس الصفحة لذا
        يصبح هذا التعاون مع الأصدقاء أثناء الدراسة أمرًا سهلاً. 
      </p>
      <div style={ {display:"flex", justifyContent:"space-between" }}> 
        <a style={{ color:"grey" }} target="blank" href="http://devf5r.com/">قابلني هنا </a>
        <span onClick={toggle} style={{ marginRight:0, color:"#7289dA"}}> <u> Back</u> </span>
      </div>
    </div>)
  } 
  return (
    <div className="joinOuterContainer bgprime">      
      <div className="joinInnerContainer bgsec">
        <h1 className="chatHeading">F5R2CHAT</h1>
        { viewInfo ? ( <InfoComponent /> ) : <FormComponent /> }
      </div>
    </div>
  );
};

export default Join;


/*
Link tag sends the data to /room 
*/
