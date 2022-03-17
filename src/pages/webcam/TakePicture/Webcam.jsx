import React, { useState } from 'react';
import Webcam from "react-webcam";
import {Button} from 'antd';
import axios from 'axios'


// const WebcamComponent = () => <Webcam />;

const videoConstraints = {
    width: 500,
    height: 300,
    facingMode: "user"
};

export const WebcamCapture = () => {

    const [image,setImage]=useState('');
    const webcamRef = React.useRef(null);

    
    const capture = React.useCallback(
        () => {
        const imageSrc = webcamRef.current.getScreenshot();
        var ret = imageSrc.replace('data:image/jpeg;base64,','');
        axios({
            method: 'post',
            url: 'https://api.iuresearchteam.online/algo',
            headers: {
                'Content-Type': 'text/plain'
            }, 
            data: ret,
          }).then(response=>console.log(response));
        // console.log(ret)
        // setImage(imageSrc)
        });


    return (
        <div className="webcam-container">
            <div className="webcam-img">

                {image === '' ? <Webcam
                    audio={false}
                    height={300}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={500}
                    videoConstraints={videoConstraints}
                /> : <img src={image} alt=""/>}
            </div>
            <div>
                {image !== '' ?
                    <Button type='primary' onClick={(e) => {
                        e.preventDefault();
                        setImage('')
                    }}
                        className="webcam-btn">
                        Retake Image</Button> :
                    <Button type='primary' onClick={(e) => {
                        e.preventDefault();
                        capture();
                    }}
                        className="webcam-btn">Capture</Button>
                }
            </div>
        </div>
    );
};