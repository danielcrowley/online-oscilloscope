import React from 'react';
import { render } from '@testing-library/react';
//import readMetaData from './db';
const db = require('./db');

test('get json meta data', () => {
  db.readMetaData("23423412").then(res=>{
    console.log(res)
  })
});
