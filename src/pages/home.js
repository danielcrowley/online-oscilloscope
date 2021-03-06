
import _ from 'lodash/array';
import React from "react";
import { pushWaveformData } from '../services/firebase';

export default function Home() {

  var metadata = {}
  var channeldata = {}
  var waveformData = []
  var waveformDataAll = []
  var data_type = "Snap" //Snap, Channel, Waveform 
  var data_field = "" 
  var MessageReceived=false
  
  var websock = new WebSocket("ws://192.168.8.155/tcp_proxy")
  websock.binaryType = 'arraybuffer';
  websock.onopen = function (event){
    websock.send("*IDN?\n")
    data_field="id"
  }
  websock.onmessage = (message)=>{
    if (data_type === 'Snap') {
      metadata[data_field]=message.data
      MessageReceived=true}
    else if (data_type === 'Channel'){
      channeldata[data_field]=message.data
      MessageReceived=true}
    else if (data_type === 'Waveform'){

      var waveformPacket = message.data.split(',') //split string to array
      waveformPacket.shift()  //remove gumpf at start of array
      var lastelement=waveformPacket.pop() //remove gumpf at start of array, 
   
      waveformData.push(...waveformPacket) //push clean packet into array    
      if (lastelement==="\n") { //if new line, it's the last packet and the full message has been received
        MessageReceived=true
      }
    }
    else if (data_type === 'Screenshot'){
      console.log(message.data)
    }
    else {
      console.log("Empty: "+ message.data)
      MessageReceived=true}
  }

  async function sendWithDelay(command,name,dataType,expectResponse=true){
    expectResponse? MessageReceived = false : MessageReceived = true
    var delay=50
    data_type=dataType
    data_field = name

    websock.send(command)

    await new Promise(r => {
      var check=()=>{
        if (MessageReceived) r()
        delay=delay*5
        setTimeout(check, delay)
      }
      setTimeout(check, delay)

    })
  }
   async function saveWaformData( Mode="screen"){
    metadata = {}
    channeldata = {}
    waveformData = []
    waveformDataAll = []
    
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
      Mode="Screen"
      await sendWithDelay(`:waveform:source ${Channels[i]}\n`,"","",false)
      switch(Mode) {
        case "Screen":
          await sendWithDelay(`:WAV:MODE Normal\n`,"","",false)
          break
        case "All":
          await sendWithDelay(`:WAV:MODE Raw\n`,"","",false)
          await sendWithDelay(`:WAV:POIN 10000000\n`,"","",false)
          break
        case "Test":
          await sendWithDelay(`:WAV:MODE Raw\n`,"","",false)
          await sendWithDelay(`:WAV:POIN 100\n`,"","",false)
          break
        default:
          await sendWithDelay(`:WAV:MODE Normal\n`,"","",false)
          break
      }
      await sendWithDelay(`:WAV:FORM ASCii\n`,"","",false)
      await sendWithDelay(":waveform:data?\n","","Waveform")
      channeldata={}
      waveformDataAll.push(waveformData)
      waveformData = []
      await sendWithDelay(":DISP:DATA?\n","","Screenshot")
      
    }   
    metadata.DataPoints=waveformDataAll[0].length
    var timestamps= Array.from({length: metadata.DataPoints}, (_, i) => i)
    waveformDataAll.unshift(timestamps)
    var csvwaveform = _.zip(...waveformDataAll)
    
    // bmp_bin = inst.query_binary_values(':DISP:DATA?', datatype='B', container=bytes)
    // img = Image.open(io.BytesIO(bmp_bin))
    // img.save(output, output.split('.')[-1])
      
    // with open('some.csv', 'w', newline='') as f:
    //     writer = csv.writer(f)
    //     writer.writerows(csvwaveform)
    //  }
      console.log("metadata")
      console.log(metadata)

      console.log("waveformDataAll")
      console.log(csvwaveform)
      let csvContent = "data:text/csv;charset=utf-8," 
      + csvwaveform.map(e => e.join(",")).join("\n");

      pushWaveformData(csvContent,"ID1")
      var encodedUri = encodeURI(csvContent);
      window.open(encodedUri);
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
  