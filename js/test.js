import Maths from "./Maths.js";

function swap(x,y){
    console.log("Swap(%i,%i) ",x,y);
     x=x^y;
     y=x^y
     x=x^y
     console.log("=>(%i,%i) ",x,y);
}

function myDisplayer(some) {
     console.log("My displayer is : %s", some)
  }
  
  // Promise provides link between producer and consumer.
  let myPromise = new Promise(function(myResolve, myReject) {
    let x = 0;
  // The producing code (this may take some time)
    if (x == 0) {
      myResolve("OK - form promisse success.");
    } else {
      myReject("Error");
    }
  });
  
  myPromise.then(
    (value)=>myDisplayer(value),
    (error) => {myDisplayer(error);}
  );



function printmsg(){
    swap(5,3)
    var maths=new Maths()
    console.log("Logrithm of 8 base 2 = %i",maths.log2(8))
    console.info("Area of circle of radius %i = %f",3,maths.circleArea(3))

}


async function myFunction() {
    return "Hello";
  }
myFunction().then((value)=>console.log("Prmoise  - "+value),(error)=>console.log("Promise error -"+error))

printmsg();
