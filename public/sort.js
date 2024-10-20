let arr = [1,5,3,6,8,2,8];

let checker = 1;

while(checker===1){
    let count = 0;
    for(let a=0;a<=arr.length-2;a++){
        let c = arr[a+1]-arr[a];
        if(c<0){
            count+=1;
            let x = arr[a];
            arr[a] = arr[a+1];
            arr[a+1] = x; 
        }
    }
    if(count==0){
        checker = 0;
    }
    
}

console.log(arr);