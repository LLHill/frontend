import React, {  } from 'react'
import './TakePicture.css'
import { WebcamCapture} from './Webcam'
import {Button} from 'antd'


const TakePicture = () => {



    const submitForm = () => {
        alert("Form submitted");
    }


    return (
        <div className="home-container">
            <div className="container">
                <div className="text">
                    <h2>Check attendance using Webcam</h2>
                    <form className="form">
                        <WebcamCapture/>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default TakePicture