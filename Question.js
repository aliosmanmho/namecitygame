"use strict";
class Question{
    id;
    value;
    correctScore;
    sameScore;
    isFinsh;
    constructor(id,value,correctScore,sameScore){
        this.id  = id;
        this.value = value;
        this.correctScore = correctScore;
        this.sameScore = sameScore;
        this.isFinsh = false;
    }
    ResponseString()
    {
        return {
            id: this.id,
            value:this.value,
            isFinsh:this.isFinsh,
        };
    }
}
module.exports = Question;
