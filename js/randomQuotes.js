var listOfQuotes = [{
    qoute: "If you cannot do great things, do small things in a great way.",
    author: "Napoleon Hill",
  },
  {
    qoute: "Everyday life is like programming, I guess. If you love something you can put beauty into it.",
    author: "Donald Knuth",
  },
  {
    qoute: "Everyday life is like programming, I guess. If you love something you can put beauty into it.",
    author: "Donald Knuth",
  },
  {
    qoute: "Slowing down is sometimes the best way to speed up.",
    author: "Mike Vance",
  },
  {
    qoute: "Focus on one thing, make it your priority, and stick with it no matter what!",
    author: "Tyler Perry",
  },
  {
    qoute: "Perseverance is not a long race; it is many short races one after the other.",
    author: "Walter Elliot",
  },
  {
    qoute: "There are two kinds of decisions - the right decision and a lesson learned.",
    author: "Simon Sinek",
  },
  {
    qoute: "If you can't fly then run, if you can't run then walk, if you can't walk then crawl, but whatever you do you have to kepp moving forward.",
    author: "Martin Luther King Jr.",
  },
  {
    qoute: "Done is better than perfect.",
    author: "Sheryl Sandberg",
  },
  {
    qoute: "Focus is about saying, no.",
    author: "Steve Jobs",
  },
  {
    qoute: "Examine your values and live by them - the more your actions reflect your beliefs, the better you feel.",
    author: "American Heart Association",
  }, {
    qoute: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese proverb",
  },
];

var randomNumber = Math.floor(Math.random() * listOfQuotes.length);
var item = listOfQuotes[randomNumber];
window.onload = function loadQoute() {
  const randomQoute =
    "<p>" + item.qoute + "<span>" + item.author + "</span>" + "</p>";
  document.getElementById("qoute-content").innerHTML = randomQoute;
};