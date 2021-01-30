"use strict";
const QuestionModel = require('./Question.js');
class LevelQuestion {
    level;
    questions;
    questionsHead;
    constructor(level) {
        this.level = level;
        if (level == 1) {
            this.questions = [[new QuestionModel(1000, "İsim", 10, 5), new QuestionModel(1001, "Şehir", 10, 5)],
            [new QuestionModel(1002, "İsim", 10, 5), new QuestionModel(1003, "Şehir", 10, 5)],
            [new QuestionModel(1004, "İsim", 10, 5), new QuestionModel(1005, "Şehir", 10, 5)],
            [new QuestionModel(1006, "İsim", 10, 5), new QuestionModel(1007, "Şehir", 10, 5)],
            [new QuestionModel(1008, "İsim", 10, 5), new QuestionModel(1009, "Şehir", 10, 5)],
            [new QuestionModel(1010, "İsim", 10, 5), new QuestionModel(1011, "Şehir", 10, 5)],
            [new QuestionModel(1012, "İsim", 10, 5), new QuestionModel(1013, "Şehir", 10, 5)],
            [new QuestionModel(1014, "İsim", 10, 5), new QuestionModel(1015, "Şehir", 10, 5)],
            [new QuestionModel(1016, "İsim", 10, 5), new QuestionModel(1017, "Şehir", 10, 5)]
            ];
        }
        else if (level == 2) {
            this.questions = {
                row1: [new QuestionModel(2002, "İsim", 10, 5), new QuestionModel(2002, "Şehir", 10, 5), new QuestionModel(2003, "Hayvan", 10, 5)],
                row2: [new QuestionModel(2004, "İsim", 10, 5), new QuestionModel(2005, "Şehir", 10, 5), new QuestionModel(2006, "Hayvan", 10, 5)]
            };
        }
    }
    ResponseString() {
        return {
            level: this.level,
            questionsHead: (this.questions.map(x => x.map(y => y.value)).filter((v, i, a) => a.indexOf(v) === i))[0],
            questions: this.questions.map((quest, index) => { return { row: index, question: quest.map(x => x.ResponseString()) } })
        }
    }
}
module.exports = LevelQuestion;