
"use strict";
class Player{
    id;
    name;
    socket;
    game;
    answers = [];
    score = 0;
    constructor(id,name){
        this.id = id;
        this.name=name;
    }
    ResponseString()
    {
        return {
            id:this.id,
            name:this.name,
            answer:this.answers.map(x=>x.ResponseString())
        }
    }
    pushAnswer(answer){
        this.answers.push(answer);
    }
    pushScore(score){
        this.score +=score;
    }
}
module.exports = Player;
