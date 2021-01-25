
"use strict";

class  Game {
    id;
    players = [];
    isFull;
    isFinsh;
    maxPlayer = 2;
    level;
    endTime;
    createSocetID;
    constructor(id,level,createSocetID){
        this.id = id;
        this.isFinsh = false;
        this.isFull = false;
        this.level = level;
        this.createSocetID = createSocetID;
    }
    ResponseString()
    {
        return {
            id: this.id,
            isFull:this.isFull,
            isFinsh:this.isFinsh,
            maxPlayer:this.maxPlayer,
            level:this.level,
            players: this.players.map(x=>x.ResponseString()),
            createSocetID : this.createSocetID,
        };
    }
    pushPalayer(player){
        if(this.isFull == true)
            {throw new Error('isFull Game!');} 
        if(this.isFinsh == true)
            {throw new Error('isFinsh Game!');} 
        player.game = this;
        this.players.push(player);
        if(this.players.length >= this.maxPlayer)
            {
                this.isFull = true;
                var dateAv = new Date();
                this.endTime = new Date(dateAv.getFullYear(), 
                                       dateAv.getMonth(), 
                                        dateAv.getDate(), 
                                        dateAv.getHours(), 
                                        dateAv.getMinutes(),
                                        dateAv.getSeconds()+60);
                
            }
    }
    finshGame()
    {
        if(this.isFull)
        {
            this.CalculatePlayerScore();
        }
        //this.isFinsh = true;
        //this.players.forEach(ply => ply.socket.emit("onfinishGame","asda"));
    }
    CalculatePlayerScore(questionRows)
    {
        questionRows.forEach(questions => 
            {
                questions.forEach(question => {
                    let questionAnswers= this.players.map(x=> {return x.answers.find(y=>y.question.id == question.id)});
                    if(questionAnswers!=null)
                    {

                    }
                })
            }
            );
    }

}
module.exports = Game;
