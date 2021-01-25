"use strict";
const shortid = require('shortid');

class Answer{
    id;
    value;
    question;
    player;
    isCorrect = false;
    isSame = false;
    constructor(question,value,player){
        this.id  = shortid.generate();
        this.question = question;
        this.value = value;
        this.player=player;
    }
    ResponseString()
    {
        return {
            id: this.id,
            value:this.value,
            isCorrect:this.isCorrect,
            isSame:this.isSame
        };
    }
}
module.exports = Answer;