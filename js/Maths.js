const PI=3.14
class Maths{
    constructor(){
        
    }
     log2(number) {
        if(number==1)
            return 0;
         else{
            return 1+this.log2(number/2)
         }
    }
    circleArea(radius){
        return PI*radius*radius;
    }

}
//Exports are of two types : Named or default
export default Maths