var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImage, restartImage;
var jumpSound, dieSound, checkPointSound;

function preload(){
    //animação do t-rex
    trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
    trex_collided = loadImage("trex_collided.png");
    //imagem do solo
    groundImage = loadImage("ground2.png");
    //imagem da nuvem
    cloudImage = loadImage("cloud.png");
    //imagens dos obstáculos
    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");
    //imagens estado END
    restartImage=loadImage("restart.png");
    gameOverImage=loadImage("gameOver.png");
    //sons
    jumpSound=loadSound("jump.mp3");
    dieSound=loadSound("die.mp3");
    checkPointSound=loadSound("checkPoint.mp3");
}


function setup() {
  //tela
  createCanvas(600, 200);

  //sprite do trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  //sprite do solo
  ground = createSprite(300,180,600,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  //sprite game over
  gameOver=createSprite(300, 100);
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.5;
  //sprite restart
  restart=createSprite(300, 140);
  restart.addImage(restartImage);
  restart.scale=0.5;

  //solo invisível
  invisibleGround = createSprite(300,190,600,10);
  invisibleGround.visible = false;

  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  //raio colisor do t rex
  trex.setCollider("circle",0,0,40);

  //pontuação
  score = 0;
}

function draw() {
  //fundo
  background(180);

  //exibindo pontuação
  text("Pontuação: "+ score, 500,50);

  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  //estado de jogo PLAY
  if(gameState === PLAY){
    
    //mover o solo
    ground.velocityX = - (4 + 3*score/60);

    //pontuação
    score = score + Math.round(getFrameRate()/60);

    //solo infinito
    if (ground.x < 0){
       ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço for pressionada
    if(keyDown("space")&& trex.y >= 164) {
        trex.velocityY = -13;
        jumpSound.play();
    }
    
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();

    //tornar game over e restart invisíveis
    gameOver.visible=false;
    restart.visible=false;

    //passar pro estado END
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }

    //tocar som a cada 100 pontos
    if (score>0 && score%100===0){
      checkPointSound.play();
   }


  }
   else if (gameState === END) {
      //parar o solo
      ground.velocityX = 0;
      //parar o t-rex
      trex.velocityX = 0;
      trex.velocityY = 0;
      trex.changeAnimation("collided",trex_collided);
      //parar nuvens e obstáculos
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);

      //exibir game over e restart
      gameOver.visible=true;
      restart.visible=true;

      //manter nuvens e cactos visíveis na tela
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);

      //reiniciar o jogo
     if (mousePressedOver(restart)){
      reset();
  }

   }


  
   drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible=false;
  restart.visible=false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  score=0;

}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = - (6 + score/60);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribua dimensão e tempo de vida aos obstáculos              
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 200;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}

