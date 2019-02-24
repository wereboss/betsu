
function startClick(){
    console.log("Start Clicked !!");
    console.log(parseFloat(amt1.value));
}

function maininit(){
 var amt1,butstart,amt2,amt3,amt4,butplus,butminus;
    
    amt1 = document.getElementById('amt1');
    amt2 = document.getElementById('amt2');
    amt3 = document.getElementById('amt3');
    amt4 = document.getElementById('amt4');
    butstart = document.getElementById('butstart');
    butplus = document.getElementById('butplus');
    butminus = document.getElementById('butminus');

    console.log("maininit function");
    butstart.addEventListener('click', startClick);

}

document.addEventListener('DOMContentLoaded', function () {
    console.log('ready!');
    maininit();
  });