
import React, { Component } from "react";
import _ from 'lodash/array'; 


export default function Home() {

  var metadata = {}
  var channeldata = {}
  var waveformData = []
  var waveformDataAll = []
  var data_type = "Snap" //Snap, Channel, Waveform 
  var data_field = "" 
  var MessageReceived=false
  
  var websock = new WebSocket("ws://192.168.8.138/tcp_proxy")
  websock.binaryType = 'arraybuffer';
  websock.onopen = function (event){
    websock.send("*IDN?\n")
    data_field="id"
  }
  websock.onmessage = (message)=>{
    
    if (data_type === 'Snap') {
      metadata[data_field]=message.data
      MessageReceived=true}
    if (data_type === 'Channel'){
      channeldata[data_field]=message.data
      MessageReceived=true}
    if (data_type === 'Waveform'){
      var waveformPacket = message.data.split(',')
      console.log(waveformPacket)
      waveformPacket.shift()
      var lastelement=waveformPacket.pop()
      waveformData.push(...waveformPacket)
      console.log("waveform saving..")
      
      if (lastelement==="\n") {
        console.log(waveformData)
        MessageReceived=true
      }
    }
    if (data_type === '') {
      console.log(message.data)
      MessageReceived=true}

  }
  async function wait(ms){
    await new Promise(r => setTimeout(r, ms))
  }

  async function sendWithDelay(command,name,dataType,delay=50){
    MessageReceived=false
    data_type=dataType
    data_field = name
    websock.send(command)
    await new Promise(r => setTimeout(r, delay))
  }


      
   async function saveWaformData( Mode="screen"){
     console.log("saving..")
      await sendWithDelay(":TIM:SCAL?\n","timeScale","Snap")
      await sendWithDelay(`:ACQ:SRAT? Channel1\n`,"SampleRate","Snap") 

      metadata['Channels']=[]
      var Channels=["CHAN1","CHAN2"]
    for (const i in Channels) {
      await sendWithDelay(`:${Channels[i]}:SCAL?\n`,"Scale","Channel")
      await sendWithDelay(`:${Channels[i]}:OFFS?\n`,"Offset","Channel")
      await sendWithDelay(`:${Channels[i]}:UNIT?\n`,"Unit","Channel")
      metadata['Channels'].push(channeldata)
      Mode="All"
      await sendWithDelay(`:waveform:source ${Channels[i]}\n`,"","")
      switch(Mode) {
        case "Screen":
          await sendWithDelay(`:WAV:MODE Normal\n`,"","")
          break
        case "All":
          await sendWithDelay(`:WAV:MODE Raw\n`,"","")
          await sendWithDelay(`:WAV:POIN 1000\n`,"","")
          break
        case "Test":
          await sendWithDelay(`:WAV:MODE Raw\n`,"","")
          await sendWithDelay(`:WAV:POIN 100\n`,"","")

          break
        default:
          await sendWithDelay(`:WAV:MODE Normal\n`,"","")
          break
      }
      await sendWithDelay(`:WAV:MODE ASCii\n`,"","")
      await sendWithDelay(`:waveform:data?\n`,"","Waveform",6000)
      channeldata={}
      waveformDataAll.push(waveformData)
      waveformData = []
    }   
    var csvwaveform = _.zip(...waveformDataAll)
    console.log(csvwaveform)
    
    // timestamps=range(1,int(metadata['DataPoints']) )
    // waveformdata.insert(0,timestamps)

    // bmp_bin = inst.query_binary_values(':DISP:DATA?', datatype='B', container=bytes)
    // img = Image.open(io.BytesIO(bmp_bin))
    // img.save(output, output.split('.')[-1])
    
    // print (metadata)
    
    // csvwaveform = zip(*waveformdata)
    
    // with open('some.csv', 'w', newline='') as f:
    //     writer = csv.writer(f)
    //     writer.writerows(csvwaveform)
    //  }
      console.log("metadata")
      console.log(metadata)

      console.log("waveformDataAll")
      console.log(waveformDataAll)
      console.log(waveformDataAll.length)

    }
    
    return (
      <div>       
        <h2 >List of screengrabs</h2>
        <button onClick={saveWaformData}>
        Activate Lasers
      </button>

      </div>

    )

    
  }
  