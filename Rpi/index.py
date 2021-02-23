# from firebase import firebase
import pyvisa as visa
import argparse
from PIL import Image
import io,time
import csv

output="screen.png"
address="TCPIP::192.168.8.138::INSTR"

inst = visa.ResourceManager().open_resource(address)
inst.timeout = 6000
print(inst.query('*IDN?').strip())

def saveWaveform(Channels=['CHAN1'],Mode="screen"):
    
    waveformdata=[]
    metadata = {
        "TimeScale": inst.query(':TIM:SCAL?'),
        "DataPoints": 1200,
        "Channels":[
            
        ]

    }
    metadata['Channels']=[]
    for Chan in Channels:
        channelMetaData ={}
        inst.write(f':waveform:source {Chan}')
        if Mode=="Screen":
            inst.write(':WAV:MODE Normal')
        elif Mode=="All":
            inst.write(':WAV:MODE Raw')
            inst.write(':WAV:POIN 100000000')
        elif Mode=="Test":
            inst.write(':WAV:MODE Raw')
            print(inst.write(':WAV:POIN 10000'))
        
        inst.write(':WAV:FORM BYTE')
        print(inst.query(':WAV:POIN?'))
        metadata['DataPoints'] = inst.query(':WAV:POIN?')
        waveformdata.append(inst.query_binary_values(':waveform:data?'))
        channelMetaData['Name'] = Chan
        channelMetaData['SampleRate'] = inst.query(':ACQ:SRAT? CHANNEL1')
        channelMetaData['Scale'] = inst.query(f':{Chan}:SCAL?')
        channelMetaData['Offset'] = inst.query(f':{Chan}:OFFS?')
        channelMetaData['Unit'] = inst.query(f':{Chan}:UNIT?')
        metadata['Channels'].append(channelMetaData)

    timestamps=range(1,int(metadata['DataPoints']) )
    waveformdata.insert(0,timestamps)

    bmp_bin = inst.query_binary_values(':DISP:DATA?', datatype='B', container=bytes)
    img = Image.open(io.BytesIO(bmp_bin))
    img.save(output, output.split('.')[-1])
    
    print (metadata)
    
    csvwaveform = zip(*waveformdata)
    
    with open('some.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(csvwaveform)


saveWaveform(['CHAN1','CHAN3','CHAN4'],"All")



# firebase = firebase.FirebaseApplication('https://online-oscilloscope.firebaseio.com/', None)
# data =  { 'Name': 'John Doe',
#           'RollNo': 3,
#           'Percentage': 70.02
#           }
# result = firebase.post('/python-example-f6d0b/Students/',data)
# print(result)
# import pyvisa,time
# rm = pyvisa.ResourceManager('@py')
# osc = rm.open_resource('USB0::6833::1301::MS5A223003210::0::INSTR',query_delay=1.0)
# print(osc)
# osc.query(':HARDcopy')
# # print(osc.read())

