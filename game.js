//Variáveis Globais
var forcaPulo = -20;
var gravidade = 1.5;

var trex, trexImg, trexDead;
var canvas;
var chao;

var chaoVisivel, chaoImg;
var nuvem, nuvem2, nuvemImg;

var ob1, ob2, ob3, ob4, ob5, ob6;

var gameOver, gameOverImg;
var restart, restartImg;

var grupoObstaculos, grupoNuvens;

var play = 1;
var end = 0;
var gameState = play;

var score = 0;

var somMorte, somCheckpoint, somPulo;

//Serve para carregar e executar apenas uma vez, não varias, imagens, sons, videos
function preload() {
    trexImg = loadAnimation("./sprites/t1.png", "./sprites/t2.png", "./sprites/t3.png", "./sprites/t4.png");
    chaoImg = loadImage("./sprites/ground2.png");
    nuvemImg = loadImage("./sprites/cloud.png");
    ob1 = loadImage("./sprites/obstacle1.png");
    ob2 = loadImage("./sprites/obstacle2.png");
    ob3 = loadImage("./sprites/obstacle3.png");
    ob4 = loadImage("./sprites/obstacle4.png");
    ob5 = loadImage("./sprites/obstacle5.png");
    ob6 = loadImage("./sprites/obstacle6.png");
    gameOverImg = loadImage("./sprites/gameOver.png");
    restartImg = loadImage("./sprites/restart.png");
    trexDead = loadAnimation("./sprites/trex_collided.png");
    somPulo = loadSound("./sons/jump.mp3");
    somMorte = loadSound("./sons/die.mp3");
    somCheckpoint = loadSound("./sons/checkpoint.mp3");
}

//Executa 1 vezes no inicio do jogo
//Criar canvas, criar sprites apenas 1 vez
function setup() {
    canvas = createCanvas(800, 300);// larg, alt
    trex = createSprite(50, 200, 20, 50); //x, y, larg, alt
    trex.addAnimation("correndo", trexImg);
    trex.addAnimation("morreu", trexDead);
    trex.scale = 0.7;
    chao = createSprite(45, 250, 50, 10);
    chao.visible = false;

    chaoVisivel = createSprite(400, 230);
    chaoVisivel.addImage(chaoImg);

    grupoNuvens = createGroup();

    nuvem2 = createSprite(850, 50);
    nuvem2.addImage(nuvemImg);
    nuvem2.velocityX = -2;
    grupoNuvens.add(nuvem2);

    gameOver = createSprite(width / 2, 150);
    gameOver.addImage(gameOverImg);
    gameOver.visible = false;

    restart = createSprite(width / 2, 185);
    restart.addImage(restartImg);
    restart.scale = 0.6;
    restart.visible = false;

    grupoObstaculos = createGroup();

    //set define, get obter.
    trex.setCollider("circle", -10, 0);
    //trex.debug = true

}

//Exucuta por frames(quadros) ex: 60  quadros por segundo
function draw() {
    background(180);
    if (gameState === play) {
        logTrex();
        logChao();
        gerarNuvens();
        gerarObstaculos();
        score += 1
        if (score>0 && score%100===0){
            somCheckpoint.play();
        }
        if (grupoObstaculos.isTouching(trex)) {
            gameState = end;
            somMorte.play();
        }
    }
    else if (gameState === end) {
        chaoVisivel.velocityX = 0;
        trex.velocityY = 0;
        restart.visible = true;
        gameOver.visible = true;
        grupoNuvens.setVelocityXEach(0);
        grupoObstaculos.setVelocityXEach(0);
        trex.changeAnimation("morreu");
        if (mousePressedOver(restart)) {
            reset();
        }
    }
    drawSprites();//usa apenas 1 vez
    textSize(20);
    fill(0);
    text("score: " + score, 600, 30);
}

function logTrex() {
    //colisão
    var estaNoChao = trex.collide(chao);
    // simula gravidade
    trex.velocityY += gravidade;
    //pulo  //arrumar o pulo
    if (keyDown("space") && estaNoChao) {
        trex.velocityY = forcaPulo;
        somPulo.play();
    }

}

function logChao() {
    chaoVisivel.velocityX = -5;
    if (chaoVisivel.x < 0) {
        chaoVisivel.x = chaoVisivel.width / 2; // formula mágica para chao infinito
    }

}

function gerarNuvens() {
    // intervalo para criar as nuvens (multiplos de 80)
    if (frameCount % 120 === 0) {
        nuvem = createSprite(850, 50);
        nuvem.addImage(nuvemImg);
        nuvem.velocityX = -2;
        nuvem.y = Math.round(random(20, 100));

        trex.depth = nuvem.depth + 1;
        nuvem.lifetime = width + 50;
        grupoNuvens.add(nuvem);
    }
}

function gerarObstaculos() {
    if (frameCount % 60 === 0) {
        var obstaculo = createSprite(850, 220, 10, 40);
        obstaculo.scale = 0.7;
        obstaculo.velocityX = -6;
        var round = Math.round(random(1, 6));
        console.log(round);

        //switch: é uma estrutura de controle, que toma decisão com base de um valor de uma variavel.

        switch (round) {
            case 1: obstaculo.addImage(ob1);
                break
            case 2: obstaculo.addImage(ob2);
                break
            case 3: obstaculo.addImage(ob3);
                obstaculo.scale = 0.6
                break
            case 4: obstaculo.addImage(ob4);
                obstaculo.scale = 0.6
                break
            case 5: obstaculo.addImage(ob5);
                obstaculo.scale = 0.6
                break
            case 6: obstaculo.addImage(ob6);
                obstaculo.scale = 0.5
                break
        }
        obstaculo.lifetime = width + 50;
        grupoObstaculos.add(obstaculo);
        console.log(grupoObstaculos);
    }
}

function reset() {
    gameState = play;
    gameOver.visible = false;
    restart.visible = false;
    grupoObstaculos.destroyEach();
    grupoNuvens.destroyEach();
    score = 0;
    trex.changeAnimation("correndo");
}



