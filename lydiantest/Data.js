import { tryRef } from './Database';

let Data = {
  
  UserData: {
    username: 'TempUsername',
    userId: '000000'
  },

  Conversation: [
    {
    author: "example", 
    date: "example",
    message: "example"
    }
  ],

  Version: "1.0.0",
}

export function updateData(data1, data2){  
  let data = []
  data1.length != undefined ? data1.map((arr) => {data.unshift(arr)}) : false
  data2.length != undefined ? data2.map((arr) => {data.unshift(arr)}) : false

  return new Promise((Resolve, Reject) => {
    Data.Conversation = data;
    Resolve()
  });
}

export default Data;



/* Conversations: [
    
    {
      index: 0, 
      name: 'Joe',
      messages: [
        {
          author: "Joe",
          index: 0,
          message: "Hi",
        },
        {
          author: "TempUsername",
          index: 1,
          message: "Hola"
        },
      ]
    },
    {
      index: 1, 
      name: "Thanos",
      messages: [
        {
          author: "Thanos",
          index: 0,
          message: "Hi"
        },
        {
          author: "Me",
          index: 1,
          message: "Hola"
        },
      ]
    }
  ]*/