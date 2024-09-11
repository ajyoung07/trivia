class Question {
    constructor(question) {
        this.type = question.type;
        this.question = question.question;
        this.correct_answer = question.correct_answer;
        this.answers = [];
        if (this.type == "multiple") {
            for (let answer of question.incorrect_answers) {
                this.answers.push(answer);
            }
            this.answers.push(question.correct_answer);
            shuffle(this.answers);
        } else {
            this.answers.push("True", "False");
        }
    }

    display () {
        document.getElementById("grade").innerHTML = "";

        let text = "";
        if (this.type == "boolean") {
            text += "True or False: ";
        }
        text += this.question;
        document.getElementById("question").innerHTML = text;

        let html_answers = "";
        for (let answer of this.answers) {
            html_answers += `<div><input type="radio" id="${answer}" value="${answer}" name="answer"><label for="${answer}">${answer}</label></div>`;
        }
        html_answers += `<div><input id="submit-answer" type="submit" value="Submit"></div>`;
        document.getElementById("answers").innerHTML = html_answers;
        document.getElementById("answers").addEventListener("submit", e => {
            let form_data = new FormData(e.target);
            let user_answer = form_data.get("answer");
            if (html_decode(this.correct_answer) == user_answer) {
                document.getElementById("grade").innerHTML = "Correct!";
                score += 1;
                document.getElementById("score").innerHTML = `Score = ${score}`;
            } else {
                document.getElementById("grade").innerHTML = "Incorrect";
            }
            document.getElementById("submit-answer").style.display = "none";
            e.preventDefault();
        }, {once: true});
    }
}

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

function html_decode(st) {
    let doc = new DOMParser().parseFromString(st, "text/html");
    return doc.documentElement.textContent;
}

async function make_request(url) {
    let obj;

    const res = await fetch(url);

    obj = res.json();
    return obj;
}

const base_url = "https://opentdb.com/api.php?amount=1&category=";
let score = 0;

make_request("https://opentdb.com/api_category.php")
    .then(data => {
        let val = 9;
        for (let category of data.trivia_categories) {
            document.getElementById("category").innerHTML += `<option value="${val}">` + category.name + "</option>";
            val++;
        }
        
    });

document.getElementById("form").addEventListener("submit", (e) => {
    let form_data = new FormData(e.target);
    let cat = form_data.get("category");
    make_request(base_url + cat)
        .then(data => {
            let question = new Question(data.results[0]);
            question.display();
        })
    e.preventDefault();
});