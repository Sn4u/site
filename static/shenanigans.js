`use strict`
var datetime = new Date().toDateString();
document.getElementById("time").textContent = datetime; // represent on html page

let has_won = false
let spinning = false

const spin_audio = new Audio('static/spin.mp3');
const win_audio = new Audio('static/win.mp3');

let muted = false
const mute_button = document.getElementById("mute")

function mute(reset_slider = false) {
    muted = !muted;
    const vol_slider = document.getElementById("volume-slider")
    let vol_value = vol_slider.value
    vol_slider.onchange = () => { if (muted) { mute(reset_slider = true) } }
    if (muted) {
        mute_button.disabled = true
        vol_slider.value = 0
        window.speechSynthesis.pause()
    }
    else {
        mute_button.disabled = false
    }
    if (reset_slider) {
        vol_slider.value = vol_value
    }
}

function lottery(max) {
    if (has_won || spinning) {
        return
    }
    spinning = true
    const spin_time = 500
    spin_audio.volume = document.getElementById("volume-slider").value / 100
    if (!muted) {
        spin_audio.play();
    }

    let num_spun = ""

    for (let i = 0; i < spinners.length; i++) {
        num_spun += setTimeout(function () { spin_spinner(spinners[i]) }, i * spin_time)
    }

    if (num_spun == Math.floor(Math.random() * 1000)) {
        has_won = true

        win_audio.volume = document.getElementById("volume-slider").value / 100
        if (!muted) {
            win_audio.play()
        }
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
    setInterval(function () { img.setAttribute("src", images[cycle_counter % images.length]); cycle_counter++ }, 1000)

}
cycle_gif("new")
let spinners = new Array()
for (let i = 1; i < 4; i++) {
    let spinner = document.getElementById("spinner_" + i)
    let num = document.createTextNode(Math.floor(Math.random() * 10))
    spinner.appendChild(num)
    spinners.push(spinner)
}

function nord_cycle_titles() {
    fetch("./static/vpn_slogans.txt").then(resp => resp.text()).then(y => {
        const slogans = y.split('\n')
        shuffleArray(slogans)
        const title = document.createElement("h2");
        const nord_div = document.getElementById("nord_div")

        nord_div.appendChild(title)
        let title_index = 0
        title.innerHTML = slogans[title_index]
        title_index++
        setInterval(function () { title.innerHTML = slogans[title_index % slogans.length]; title_index++ }, 3300)
    })

}

function* cycle_text(text) {
    let i = 0
    shuffleArray(text)
    while (true) {
        yield text[i % text.length]
        i++
    }
}

function nord_speech() {

    async function getSpeech() {
        // https://blog.monotonous.org/2021/11/15/speechSynthesis-getVoices/

        const GET_VOICES_TIMEOUT = 2000; // two second timeout

        let voices = window.speechSynthesis.getVoices();
        if (voices.length) {
            return voices;
        }

        let voiceschanged = new Promise(
            r => speechSynthesis.addEventListener(
                "voiceschanged", r, { once: true }));

        let timeout = new Promise(r => setTimeout(r, GET_VOICES_TIMEOUT));

        // whatever happens first, a voiceschanged event or a timeout.
        await Promise.race([voiceschanged, timeout]);

        return window.speechSynthesis.getVoices();
    }
    async function getText(filename) {
        let phrase_arr = fetch("./static/" + filename + ".txt").then(resp => resp.text()).then(text => { //no idea whats happening here or why this works
            const phrases = text.split('\n')
            return phrases
        })
        return phrase_arr
    }
    function* toggle_speak(v, phrases, words) {
        let ip = document.getElementById("ip").innerHTML

        const cycle_voice = cycle_text(v)
        let cycle_phrase = cycle_text(phrases)
        let cycle_word = cycle_text(words)
        yield
        while (true) {
            const interval_id = setInterval(function () {
                if (window.speechSynthesis.paused && !muted) {
                    window.speechSynthesis.resume()
                }
                else {
                    console.log(window.speechSynthesis)
                    const utterThis = new SpeechSynthesisUtterance(`your ip is: ${ip}. You must protect your pc with Nord vpn. Sign up now for 60% off with the code:${cycle_word.next().value}. ${cycle_phrase.next().value}`);
                    utterThis.rate = 5

                    utterThis.voice = cycle_voice.next().value
                    if (!muted) {
                        window.speechSynthesis.speak(utterThis);
                    }
                }
            }, 1000)
            yield
            window.speechSynthesis.pause()
            clearInterval(interval_id)
            yield

        }
    }
    let x = Promise.all([getSpeech(), getText("vpn_phrases"), getText("words")])
    x.then(voices => {
        const gen = toggle_speak(voices[0], voices[1], voices[2])
        gen.next()
        const nord = document.getElementById("nord")
        nord.onmouseleave = function () { gen.next() }
        nord.onmouseenter = function () { gen.next() }
    }
    )
}

window.onload = () => {
    nord_cycle_titles();
    nord_speech();
} 

