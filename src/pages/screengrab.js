import { useParams } from "react-router-dom";
import React, { Component } from "react";
import Iframe from 'react-iframe'
import { db } from "../services/firebase";

export default function ScreenGrab() {
    let { screenGrabId } = useParams();
    var ScreenshotId ='23423412'
    var metadata = 'loading'
    db.ref(`Screenshots/${ScreenshotId}/metadata`).once('value')
    .then(function(snapshot) {
      metadata=snapshot.val()
      console.log(snapshot.val())
    })
    return (
      <div>
        <h3>Requested ScreenGrab ID: {screenGrabId} : {metadata}</h3>
        { <Iframe url="https://docs.google.com/presentation/d/140RzC9S8Z3a2h2T0rJTFYTafvLS5T5stOPCAkADLm3k?usp=sharing+embedded=true"
              width="1450px"
              height="1s450px"
              id="myId"
              className="myClassname"
              display="initial"
              position="relative"/>
        /* <GoogleDocsViewer
          width="600px"
          height="780px"
          fileUrl="https://docs.google.com/document/d/1lyQdIgrO8yKC0aGHFTqtrAYNYC6W1YUCgH4dn03Kl3w"
        /> */} 
      </div>
    );
    
  }