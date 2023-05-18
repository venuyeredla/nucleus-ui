import express from 'express';
const app = express()
const port =2023

// Setting middleware
app.get('/hello', (req, res) => {
  res.send('Hello World!')
})
app.get('/app/suggest', (req, res) => {
  var array=["venu","gopal","Reddy"]
  res.send(array)
})
app.use(express.static("./")); //serves resources from public folder

/*
app.get('/', function (req, res) {
  res.send('Hello World')
})
*/
app.listen(port,()=> {
  console.log("Listening at localhost:%d",port);
  var counter=0;
  /* setInterval(()=>{
      console.log("Waiting...");
      counter++;
      if(counter>=4){
        console.clear()
      }

   },200); */
})


