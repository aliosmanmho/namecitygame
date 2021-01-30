
"use strict";

class Game {
    id;
    players = [];
    isFull;
    isFinsh;
    maxPlayer = 2;
    level;
    endTime;
    createSocetID;
    levelQuestion;
    constructor(id, level, createSocetID, levelQuestion) {
        this.id = id;
        this.isFinsh = false;
        this.isFull = false;
        this.level = level;
        this.createSocetID = createSocetID;
        this.levelQuestion = levelQuestion;
    }
    ResponseString() {
        return {
            id: this.id,
            isFull: this.isFull,
            isFinsh: this.isFinsh,
            maxPlayer: this.maxPlayer,
            level: this.level,
            players: this.players.map(x => x.ResponseString()),
            createSocetID: this.createSocetID,
        };
    }
    pushPalayer(player) {
        if (this.isFull == true) { throw new Error('isFull Game!'); }
        if (this.isFinsh == true) { throw new Error('isFinsh Game!'); }
        player.game = this;
        this.players.push(player);
        if (this.players.length >= this.maxPlayer) {
            this.isFull = true;
            var dateAv = new Date();
            this.endTime = new Date(dateAv.getFullYear(),
                dateAv.getMonth(),
                dateAv.getDate(),
                dateAv.getHours(),
                dateAv.getMinutes(),
                dateAv.getSeconds() + 60);

        }
    }
    finshGame() {
        if (this.isFull) {
            this.CalculatePlayerScore();
        }
        //this.isFinsh = true;
        //this.players.forEach(ply => ply.socket.emit("onfinishGame","asda"));
    }
    CalculatePlayersScore(row) {

        var questions = this.levelQuestion.questions[row];
        questions.forEach(quest => {
            var playerAnswers = this.players.map(x => {
                return {
                    player:x,
                    answer: x.answers.find(y => y.question.id == quest.id),
                    questionId:quest.id

                };
            });
            playerAnswers.forEach(playerAnswer=> {

                if(playerAnswer.answer.value!='')
                {
                    var sameAnswer = playerAnswers.find(y=>y.answer.value ==playerAnswer.answer.value && y.playerId!=playerAnswer.playerId );
                    if(sameAnswer===undefined)
                    {
                        var otherAnswer = playerAnswers.find(y=>y.answer.value != '' && y.player.id!=playerAnswer.player.id );
                        if(otherAnswer === undefined)
                        {
                            playerAnswer.player.pushScore(quest.correctScore*2);
                        }
                        else
                        {
                            playerAnswer.answer.player.pushScore(quest.correctScore);
                        }
                    }
                    else
                    {
                        playerAnswer.answer.player.pushScore(quest.sameScore);
                    }
                }
            });
        });
    }

}
module.exports = Game;
