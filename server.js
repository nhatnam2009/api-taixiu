const express = require("express")
const fetch = require("node-fetch")

const app = express()

const API = "https://jakpotgwab.geightdors.net/glms/v1/notify/taixiu?platform_id=g8&gid=vgmn_101"

app.get("/taixiu", async (req,res)=>{

 try{

  const response = await fetch(API,{
   headers:{
    "User-Agent":"Mozilla/5.0"
   }
  })

  const data = await response.json()

  const d = data.data[0]

  const tai = d.bs.find(x => x.eid === 1)
  const xiu = d.bs.find(x => x.eid === 2)

  const d1 = d.d1 || null
  const d2 = d.d2 || null
  const d3 = d.d3 || null

  const tong = d1 && d2 && d3 ? d1 + d2 + d3 : null

  const ket_qua = tong ? (tong >= 11 ? "tai" : "xiu") : null

  const jsonVN = {
   trang_thai: data.status,
   phien: d.sid,

   trang_thai_phien: d.cmd === 2007 ? "dang_cuoc" : "ket_qua",

   cuoc:{
    tai:{
     nguoi: tai.bc,
     tien: tai.v
    },
    xiu:{
     nguoi: xiu.bc,
     tien: xiu.v
    }
   },

   xuc_xac:{
    d1:d1,
    d2:d2,
    d3:d3,
    tong:tong
   },

   ket_qua:ket_qua
  }

  res.json(jsonVN)

 }catch(err){

  console.log(err)

  res.json({
   loi:"khong lay duoc api"
  })

 }

})

app.listen(3000,()=>{
 console.log("API trung gian dang chay port 3000")
})