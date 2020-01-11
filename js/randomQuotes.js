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
    new Quote("Focus on one thing, make it your priority, and stick with it no matter what!", "Tyler Perry")
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

function getQuotes(){
    return listOfQuotes;
}