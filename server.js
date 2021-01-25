const express = require("express");
const app = express();
const router = express.Router();
const path = __dirname + '/'; // this folder should contain your html files.

const http = require('http').Server(app);
const io = require('socket.io')(http);
const { Socket } = require('dgram');
const shortid = require('shortid');
const LevelQuestionModel = require('./LevelQuestion.js');
const GameModel = require('./Game.js');
const PlayerModel = require('./Player.js');
const AnswerModel = require('./Answer.js');

let LevelList = [new LevelQuestionModel(1), new LevelQuestionModel(2)];
let GameList = []; 
let PlayerList = [];

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});
router.get("/game.html",function(req,res){
  res.sendFile(path + "game.html");
});
app.use(express.static(path+ "node_modules"));

app.use("/",router);
io.on('connection', (socket) => {
  console.log('a user connected : ' + socket.id);
  socket.on("error", function() {
    socket.emit("errorSocet", "Something bad happened!");
  });

  socket.on(('CreatePlayer'), (playerName) => { 
    try
    {
      CreatePlayer(socket,playerName)
    }
    catch(e)
    {
        io.to(socket.id).emit("myClientError", e.message);
        console.log('Exception! message:%s ' + e.message);
    }
  });
  socket.on(('joinGame'), (gameId) => { 
    try
    {
      JoinGame(socket, gameId) 
      PushLevelQuestion(socket,gameId);
    }
    catch(e)
    {
        io.to(socket.id).emit("myClientError", e.message);
        console.log('Exception! message:%s ' + e.message);
    }
  });
  socket.on(('CreateGame'), () => { 
    try
    {
      CreateGame(socket) 
    }
    catch(e)
    {
        io.to(socket.id).emit("myClientError", e.message);
        console.log('Exception! message:%s ' + e.message);
    }
  });
  socket.on(('AnswerQuestion'), (gameId, questionId, answer) => { 
    try
    {
      AnswerQuestion(socket, gameId, questionId, answer)
    }
    catch(e)
    {
        io.to(socket.id).emit("myClientError", e.message);
        console.log('Exception! message:%s ' + e.message);
    }
  });
  AllSocetPushGameList();
  socket.on('disconnect', function () {
    try
    {
      GameList.forEach((gameObj,index,object)=>{

        let playerGame = gameObj.players.find(y=>y.id == socket.id);
        if(playerGame!=null)
        {
          gameObj.players.splice(gameObj.players.indexOf(playerGame),1);
          if(gameObj.players.length<=0)
          {
            GameList.splice(index,1);
          }
          const ss = gameObj.ResponseString();
          io.in(gameObj.id).emit("gameOut", JSON.stringify(ss));
        }
        console.log('Got disconnect! : ' + socket.id);
    });
    }
    catch(e)
    {
        io.to(socket.id).emit("myClientError", e.message);
        console.log('Exception! message:%s ' + e.message);
    }
    
  });
});
http.listen(process.env.PORT || 5000);


function PushLevelQuestion(socket, gameId)
{
  let game = GetGame(gameId);
  if(game!=null)
  {
    let level= LevelList.find(y=>y.level == game.level);
    let levelJson = JSON.stringify(level.ResponseString());
    io.to(socket.id).emit("levelQuestion", levelJson);
  }
}

function AllSocetPushGameList() {
  let gameListJson = JSON.stringify(GameList.map(y => y.ResponseString()));
  io.emit('GameList', gameListJson);
  console.log('Tüm Oyun Listesi Gönderildi Json: %s', gameListJson);
}

function GenerateGame(createSocetID) {
  let _id = shortid.generate();
  return new GameModel(_id, 1,createSocetID);
}
function AnswerQuestion(socket, gameId, questionId, answer) {
  let player = GetPlayer(socket.id);
  if(player==null)
    {
      throw Error("Player bulunamadı! PlayerId: %s ",socket.id);
    }
  let game = GetGame(gameId);
  let levelQuestion = LevelList.find(x => x.level == game.level).questions.map(y => { return y.map(z => z) });
  if (levelQuestion != null) {
    levelQuestion.forEach(lvQuestion => {
      let question = lvQuestion.find(q => q.id == questionId);
      if (question != null) {
        let answerObj = new AnswerModel(question, answer, player);
        player.pushAnswer(answerObj);
        console.log('Cevap Verildi Player:%s Question:%s Answer:%s ', player.id, question.value, answer);
      }
    });
  }
}
function JoinGame(socket, gameId) {
  let player = GetPlayer(socket.id)
  if(player==null)
  {
    throw Error("Player bulunamadı! PlayerId: %s ",socket.id);
  }
  let game = GetGame(gameId);
  if (game == null) {
    throw Error("Oyun Bulunamadı!: " + gameId)
  }
  game.pushPalayer(player);
  socket.join(gameId);
  const ss = game.ResponseString();
  io.in(gameId).emit("gameJoined", JSON.stringify(ss));
  //socket.broadcast.to(gameId).emit('gameJoined', JSON.stringify(ss));
  AllSocetPushGameList();
  console.log('Oyuncu Oyuna Girdi Oyuncu:%s Oyun:%s ', player.id, game.id);

}
function CreatePlayer(socket,playerName) {
  let player = PlayerList.find(function (player) {
    if (player.id == socket.id)
      return player;
  });
  if (player == null) {
    let newPlayer = new PlayerModel(socket.id,playerName);
    newPlayer.socket = socket;
    PlayerList.push(newPlayer);
    console.log('Oyuncu oluşturuldu Oyuncu: %s ', newPlayer.id);
  }
  else {
    console.log('Oyuncu zaten kayıtlı Oyuncu: %s ', player.id);
  }
}
function CreateGame(socket) {
  let player = GetPlayer(socket.id);
  let newGame = GenerateGame(socket.id);
  if(player!=null)
    {
      newGame.pushPalayer(player);
    }
  GameList.push(newGame);
  socket.join(newGame.id);
  AllSocetPushGameList();
  console.log('Oyun oluşturuldu  Oyun :%s ', newGame.id);


}
setInterval(function () {
  if (GameList != null && GameList.length > 0) {
    GameList.forEach(element => {
      if (element.endTime >= Date.now()) { element.CalculatePlayerScore(LevelList.find(y => y.level == element.level).questions) }
    });
  }
}, 1000);

function GetPlayer(id) {
  let player = PlayerList.find(function (player) {
    if (player.id == id)
      return player;
  });
 
  return player;
}
function GetGame(id) {
  let game = GameList.find(function (game) {
    if (game.id == id)
      return game;
  });
  return game;
}
