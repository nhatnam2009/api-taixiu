const express = require("express")
const fetch = require("node-fetch")

const app = express()

const API = "https://jakpotgwab.geightdors.net/glms/v1/notify/taixiu?platform_id=g8&gid=vgmn_101"

// lưu kết quả phiên trước
let last = {
 phien:null,
 d1:null,
 d2:null,
 d3:null,
 tong:null,
 ket_qua:null
}

// lưu lịch sử 100 phiên
let history = []

app.get("/taixiu", async (req,res)=>{

 try{

  const response = await fetch(API,{
   headers:{
    "User-Agent":"Mozilla/5.0"
   }
  })

  const data = await response.json()

  const d = data.data[0]

  let d1 = d.d1 || null
  let d2 = d.d2 || null
  let d3 = d.d3 || null

  let tong = (d1 && d2 && d3) ? d1+d2+d3 : null
  let ket_qua = tong ? (tong >= 11 ? "tai":"xiu") : null

  // nếu null thì giữ kết quả cũ
  if(d1 === null) d1 = last.d1
  if(d2 === null) d2 = last.d2
  if(d3 === null) d3 = last.d3
  if(tong === null) tong = last.tong
  if(ket_qua === null) ket_qua = last.ket_qua

  // nếu phiên mới thì lưu history
  if(last.phien !== d.sid && ket_qua){

   history.unshift({
    phien:d.sid,
    ket_qua,
    tong,
    xuc_xac:[d1,d2,d3]
   })

   if(history.length > 100){
    history.pop()
   }

  }

  last = {
   phien:d.sid,
   d1,
   d2,
   d3,
   tong,
   ket_qua
  }

  const result = {

   phien:d.sid,

   xuc_xac:{
    d1,
    d2,
    d3,
    tong
   },

   ket_qua,

   // chuỗi TX (phiên mới bên phải)
   chuoi: history
   .slice()
   .reverse()
   .map(x => x.ket_qua === "tai" ? "T":"X")
   .join("")

  }

  res.json(result)

 }catch(err){

  console.log(err)

  res.json({
   loi:"khong lay duoc api"
  })

 }

})


// API lịch sử

app.get("/history",(req,res)=>{
 res.json(history)
})


// API chuỗi TX

app.get("/pattern",(req,res)=>{

 const pattern = history
 .slice()
 .reverse()
 .map(x => x.ket_qua === "tai" ? "T":"X")
 .join("")

 res.json({
  chuoi:pattern
 })

})

app.listen(3000,()=>{
 console.log("API tai xiu dang chay port 3000")
})
