`use strict`
var datetime = new Date().toDateString();
document.getElementById("time").textContent = datetime; // represent on html page

let has_won = false
let spinning = false

var spin_audio = new Audio('static/spin.mp3');
var win_audio = new Audio('static/win.mp3');
spin_audio.play();

function lottery(max) {
    if (has_won || spinning) {
        return
    }
    spinning = true
    const spin_time = 500
    spin_audio.volume = document.getElementById("volume-slider").value / 100
    spin_audio.play();

    let num_spun = ""

    for (let i = 0; i < spinners.length; i++) {
        num_spun += setTimeout(function () { spin_spinner(spinners[i]) }, i * spin_time)
    }

    if (num_spun == Math.floor(Math.random() * 1000)) {
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
    setTimeout(function () { spinning = false }, spinners.length * spin_time)
}

function spin_spinner(spinner) {
    const num = Math.floor(Math.random() * 10)
    spinner.innerHTML = num
    return num
}

function flash(what, times = 9) {
    const original = what.style.borderColor
    for (let i = 0; i < times + 1; i++) {
        console.log(true)
        if (i % 2 == 0) {
            setTimeout(function () { what.style.borderColor = "red" }, i * 1000);
        }
        else {
            setTimeout(function () { what.style.borderColor = original }, i * 2000);
        }

    }
}

const div_new = document.getElementById("new");

let cycle_counter = 0;

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function cycle_gif(name) {
    const images = new Array()
    for (let i = 1; i < 12; i++) {
        images.push(`static/${name}/${name}${i}.gif`)
    }
    shuffleArray(images)
    const img = document.createElement("img");

    let div = document.getElementById(name)
    div.appendChild(img)
    img.setAttribute("height", "18px")
    setInterval(function () {img.setAttribute("src", images[cycle_counter % images.length]); cycle_counter++ }, 1000)

}
cycle_gif("new")
let spinners = new Array()
for (let i = 1; i < 4; i++) {
    let spinner = document.getElementById("spinner_" + i)
    let num = document.createTextNode(Math.floor(Math.random() * 10))
    spinner.appendChild(num)
    spinners.push(spinner)
}

function nord() {
    fetch("./static/vpn_slogans.txt").then(resp => resp.text()).then(y => {
        const slogans = y.split('\n')
        shuffleArray(slogans)
        const title = document.createElement("h2");
        const nord_div = document.getElementById("nord_div")
    
        nord_div.appendChild(title)
        let title_index = 0
        title.innerHTML=slogans[title_index]
        title_index++
        setInterval(function(){title.innerHTML=slogans[title_index%slogans.length]; title_index++}, 3300)
    })

}

nord()