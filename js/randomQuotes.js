class Quote {
    constructor(qoute, author){
        this.qoute = qoute;
        this.author = author;
    }
}

var listOfQuotes =  [
    new Quote("If you cannot do great things, do small things in a great way.", "Napoleon Hill"),
    new Quote("Through hard work, perseverance and a faith in God, you can live your dreams.","Ben Carson"),
    new Quote("Everyday life is like programming, I guess. If you love something you can put beauty into it.", "Donald Knuth"),
    new Quote("Slowing down is sometimes the best way to speed up.", "Mike Vance"),
    new Quote("Focus on one thing, make it your priority, and stick with it no matter what!", "Tyler Perry"),
    new Quote("Perseverance is not a long race; it is many short races one after the other.", "Walter Elliot"),
    new Quote("There are two kinds of decisions - the right decision and a lesson learned.", "Simon Sinek"),
    new Quote("If you can't fly then run, if you can't run then walk, if you can't walk then crawl, but whatever you do you have to kepp moving forward.", "Martin Luther King Jr.")
]

var randomNumber = Math.floor(Math.random() * listOfQuotes.length);
var item = listOfQuotes[randomNumber];

function getRandomQuote(sel){
    if(sel === "author"){
        return document.write((item.author));
    }else{
        return document.write((item.qoute));
    }
}
window.onload = function loadQoute() {
    const randomQoute = "<p>" + getRandomQuote() + "<span>" + getRandomQuote("author") +"</span>" + "</p>";
    document.getElementById("qoute-content").innerHTML = "There are two kinds of decisions - the right decision and a lesson learned.<span>Simon Sinek</span>";
    // document.getElementById("qoute-content").innerHTML = randomQoute;
}