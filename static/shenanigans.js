`use strict`
var datetime = new Date().toDateString();
document.getElementById("time").textContent = datetime; // represent on html page
 
let has_won = false
let spinning = false

var spin_audio = new Audio('static/spin.mp3');
var win_audio = new Audio('static/win.mp3');
spin_audio.play();

function lottery(max){
    if (has_won || spinning){
        return
    }
    spinning = true
    spin_audio.volume = document.getElementById("volume-slider").value / 100
    spin_audio.play();

    let num_spun = ""
    
    for (let i=0; i<spinners.length; i++){
        num_spun += setTimeout(function(){spin_spinner(spinners[i])}, i*500)
    }

    if (num_spun == Math.floor(Math.random()*1000)){
        has_won = true

        win_audio.volume = document.getElementById("volume-slider").value / 100
        win_audio.play();

        flash(document.getElementById("spinner_table"))

        const button = document.createElement("button")
        text = document.createTextNode("Enter the Crypt")

        button.appendChild(text)
        const lottery_div = document.getElementsByClassName("lottery_div")[0]
        lottery_div.appendChild(button)
    } 
    spinning = false
}

function spin_spinner(spinner){
    const num = Math.floor(Math.random()*10)
    spinner.innerHTML = num
    return num
}

function flash(what, times=9){
    const original = what.style.borderColor
    for (let i=0; i<times+1; i++){
        console.log(true)
        if (i % 2 == 0){
            setTimeout(function(){what.style.borderColor = "red"}, i*1000);
        }
        else{
            setTimeout(function(){what.style.borderColor = original }, i*2000);
        }
       
    }
}

let spinners = new Array()
for (let i = 1; i < 4; i++) { 
    let spinner = document.getElementById("spinner_" + i)
    let num = document.createTextNode(Math.floor(Math.random()*10))
    spinner.appendChild(num)
    spinners.push(spinner)
}
