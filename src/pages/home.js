
import React, { Component } from "react";


export default function Home() {
      
      var websock = new WebSocket("ws://192.168.8.138/tcp_proxy")
      websock.binaryType = 'arraybuffer';
      websock.onopen = function (event){
        console.log("Here2")
        websock.send("*IDN?\n")
        
      }
      websock.onmessage = (message) => {
        console.log(message.data)
      }
      websock.onerror = function(evt) { 
        console.log("Here3")
        console.log(evt) 
     };

     function activateLasers(){
         console.log("Here3")
        //  websock.send(":CHAN1:OFFS?\n")
                  // await ( websock.send("WAV:FORM ASCii\n"))
          // await (websock.send(':WAV:MODE Raw\n'))
          // await (websock.send(':WAV:POIN 1000\n'))
        websock.send("WAV:FORM ASCii\n")
         websock.send(":waveform:data?\n")

       
     }
    
    return (
      <div>       
        <h2 >List of screengrabs</h2>
        <button onClick={activateLasers}>
        Activate Lasers
      </button>

      </div>

    )

    
  }
  