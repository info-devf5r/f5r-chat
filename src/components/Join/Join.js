import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GenerateRoom from "./GenerateRoom/GenerateRoom";
import queryString from "query-string";
import "./Join.css";
import readingBook from "../../icons/readingBook.svg"; 
// import InfoComponent from "./components/InfoComponent"
// import FormComponent from "./components/FormComponent";

const Join = ({location}) => {
  
  const [state, setState] = useState(2); 
  const toggle = (x) => { setState(x) }

  useEffect(()=>{
    console.log(location.pathname)
    if(location.pathname === "/join") { 
      setState(0)
    }
  },[location]);

  const FormComponent = ()=> {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    useEffect(()=>{
      console.log(location.pathname)
      if(location.pathname === "/join") {
        const {roomId} = queryString.parse(location.search); 
        console.log(roomId)
        if(roomId !== ""){
          console.log(roomId); 
          setRoom(roomId); 
        }
      }
    },[]);
    
    return (<div>
      <div>
        <input
          placeholder="ادخل اسمك هنا"
          className="joinInput bgtert"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </div>
      <div>
        <input
          placeholder="اسم او معرف الغرفة"
          className="joinInput mt-20 bgtert"
          value={room}
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
          انضم
        </button>
      </Link>
      <div style={{textAlign:"left", fontSize:"2rem"}} className="mt-20"> 
        <span onClick={() => { toggle(2) }} style={{ marginRight:0, color:"#7289dA"}}> <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> </span>
      </div>
  </div>)
  }

  const GenerateRoomOrJoinRoom = () => {
    return (
      <>
        <button className="button mt-20 fontprime bgbutton" type="submit" onClick = {()=>{toggle(3)}}>
          توليد الغرفة
        </button> 
        <button className="button mt-20 fontprime bgbutton" type="submit" onClick = {()=>{toggle(0)}}>
           الانضمام إلى الغرفة الموجودة
        </button>
        <p className="helpbutton" onClick={ () => { toggle(1) } }>
          <i class="fa fa-question-circle" aria-hidden="true"></i>
        </p>
      </>
    )
  }

  const InfoComponent = ()=> {
    return (<div className="helptext ">
      <p> 
        <u>كيف تستعمل</u> : 
        <ul> 
          <li>قم بإنشاء معرف غرفة عن طريق النقر فوق زر إنشاء غرفة</li>
          <li>انقر <i className="fa fa-share-alt" aria-hidden="true"></i> للمشاركة رابط الانضمام مع الأصدقاء.</li>
          <li>انقر <i className="fa fa-clone" aria-hidden="true"></i> لنسخ معرف الغرفة</li>
          <li>انضموا إلى الغرفة وادرسوا معًا باستخدام القنوات النصية والصوتية. لا يتطلب التسجيل.</li>
        </ul>
         
      </p> 
      <p>
        <u>حول</u>: يهدف التطبيق إلى وضع القنوات النصية والصوتية على نفس الصفحة لذا
        يصبح هذا التعاون مع الأصدقاء أثناء الدراسة أمرًا سهلاً.       </p>
      <div style={ {display:"flex", justifyContent:"space-between", fontSize:"2rem"}}> 
        <span onClick={() => { toggle(2) }} style={{ marginRight:0, color:"#7289dA"}}> <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> </span>
        <a style={{ color:"grey",fontSize:"1.5rem" }} target="blank" href="https://www.linkedin.com/in/sudheer-tripathi-384239147/">قابلني </a>
      </div>
    </div>)
  } 

  const getAppropriateComponent = (num) => {
    if(num === 0) {
      return <FormComponent /> 
    }
    if(num === 1) {
      return <InfoComponent /> 
    }
    if(num === 2) {
      return <GenerateRoomOrJoinRoom /> 
    }
    if(num === 3) {
      return <GenerateRoom toggle={toggle}/> 
    }
    return <></>  
  }

  return (
    <div className="joinOuterContainer bgprime">      
      <div className="joinInnerContainer bgsec">
        <h1 className="chatHeading" onClick={()=>{setState(2)}}> F5R2CHAT </h1>
        <div className="belowHeading"> 
          {getAppropriateComponent(state)}
        </div>
      </div>
    </div>
  );
};

export default Join;


/*
Link tag sends the data to /room 
*/
