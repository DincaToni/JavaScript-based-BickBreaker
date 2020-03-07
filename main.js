// declare // 
const cvs= document.getElementById('canvass');
const ctx = cvs.getContext("2d");

const paddle_width = 125;
const paddle_height = 20;
const paddle_margin_bottom =50; 

let leftArrow = false;
let rightArrow = false;

let score = 0; 
let lives = 3;

let game_over = false;


ball_radius = 8;
ball_speed = 5;

// create the paddle// 


const paddle = {
    x: cvs.width/2 - paddle_width/2,
    y:cvs.height - paddle_margin_bottom - paddle_height,
    width: paddle_width,
    height: paddle_height,
    dx: 5
}

// create ball //

const ball = {
    x : cvs.width/2,
    y : paddle.y - ball_radius -1,
    radius : ball_radius,
    speed : ball_speed,
    dx : ball_speed * (Math.random() * 2 -1),
    dy : -ball_speed

}

// Draw the paddle //   

function drawPaddle()
{
ctx.fillStyle = "#f2132a";

ctx.fillRect(paddle.x, paddle.y, paddle_width, paddle_height);
}

// Draw the ball //

function drawBall()
{
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#0fd173";
    ctx.fill();
    ctx.closePath();
}


// control the paddle // 

document.addEventListener('keydown', function(event){
    if(event.keyCode == 37) {
        leftArrow = true;
    }
    if(event.keyCode == 39) 
    {
        rightArrow = true;
    }
})

document.addEventListener('keyup', function(event){
    if(event.keyCode == 37) {
        leftArrow = false;
    }
    if(event.keyCode == 39) 
    {
        rightArrow = false;
    }
})

// move paddle //

function movePaddle()
{
    if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
    if(rightArrow && paddle.x + paddle.width< cvs.width){
        paddle.x += paddle.dx;
    }
}

// move ball //

function moveBall()
{
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// collision sensor //

function collisionSensor()
{
    // right wall //
    if(ball.x + ball.radius >= cvs.width){
        ball.dx = -ball.dx;
        bounce.play();
    }
    // upper wall //
    if(ball.y - ball.radius <= 0){
        ball.dy = -ball.dy;
        bounce.play();
    }
    // left wall //
    if(ball.x - ball.radius <= 0){
        ball.dx = -ball.dx;
        bounce.play();
    }
    // collision with paddle's sides // 
    //if(ball.y + ball.radius > paddle.y && ball.y < paddle.y + paddle.height && ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width){
      //  ball.dx = -ball.dx;

    //}   
    // interraction with the bottom //
    
    if ( ball.y + ball.radius> cvs.height)
    {
        respawn();
        lives --;
        lose_life.play();
    }
     
}

// ball direction sensor //

function directionSensor()
{
    if(ball.y + ball.radius >= paddle.y && ball.x <= paddle.x + paddle.width  && ball.x >= paddle.x )
        {
            // play sound //
            bounce.play();

            // detect the collide position //
            let cp = ball.x - (paddle.x + paddle.width/2);

            // calculate the collide position by the width/2 of the paddle //
            cp = cp / (paddle.width/2);

            // calculate the angle //
            let angle = cp * Math.PI/3;

            // calculate the values for dx and dy //
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = -ball.speed * Math.cos(angle);

            
        }
   
}

// respawn ball //

function respawn()
{
    ball.x = cvs.width/2;
    ball.y = paddle.y - ball_radius -1;
    ball.dx = ball_speed * (Math.random() * 2 -1);
    ball.dy = -ball_speed;
}



// starting bricks section //
// starting bricks section // 
// starting bticks section // 


// create bricks //

const brick = {
    row: 4,
    column: 5,
    height: 35,
    width: 96,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "#00FFFF"
}

let bricks = [];

function createBricks()
{
    for( let r = 0 ; r < brick.row ; r++)
    {
        bricks[r] = [];
        for( let c = 0 ; c < brick.column ; c++)
        {
            bricks[r][c] = {
                x: (brick.offSetLeft + brick.width) * c + brick.offSetLeft ,
                y: brick.marginTop + (brick.offSetTop + brick.height) * r + brick.offSetTop,
                status: true
            }
        }
    }
}

createBricks();

// draw the bricks //

function drawBricks()
{
    for( let r = 0 ; r < brick.row ; r++)
    {
        for( let c = 0 ; c < brick.column ; c++)
        {
            if( bricks[r][c].status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect( bricks[r][c].x , bricks[r][c].y , brick.width , brick.height );
            }
        }
    }
}

// ball - brick collision sensor // 

function brickCollisionSensor()
{
    
    for( let r = 0 ; r < brick.row ; r++)
    {
        for( let c = 0 ; c < brick.column ; c++)
        {
            if( ball.y - ball.radius <= bricks[r][c].y + brick.height && ball.x  >= bricks[r][c].x && 
                ball.x <= bricks[r][c].x + brick.width && ball.y + ball.radius >= bricks[r][c].y && bricks[r][c].status) {
                ball.dy = -ball.dy;
                bricks[r][c].status = false;
                score += 10;
                bounce.play();
            }
            if(ball.x + ball.radius >= bricks[r][c].x && ball.x - ball.radius <= bricks[r][c].x + brick.width 
                && ball.y <= bricks[r][c].y + brick.height && ball.y >= bricks[r][c].y && bricks[r][c].status)
            {
                ball.dx = -ball.dx;
                bricks[r][c].status = false;
                score += 10;
                bounce.play();
            }
        }
    }
}
// show game stats //
function ShowGameStats(text, textX, TextY, img, imgX, imgY)
{
    // create text //
    ctx.fillStyle = '#FFF';
    ctx.font = '30px Sofia';
    ctx.fillText(text, textX, TextY);

    // create img // 
    ctx.drawImage(img, imgX, imgY, width = 35, height = 35);
}
// draw // 
function draw()
{
    drawPaddle();
    drawBall();
    drawBricks();
    // show lives //
    ShowGameStats(lives, cvs.width - 35, 30, life_img, cvs.width - 70, 5);
    // show score // 
    ShowGameStats(score, 65 , 35 , Score_img, 25, 5);
}
// game over text //
function GameOverText()
{
    ctx.fillStyle = '#FFF';
    ctx.font = '80px Sofia';
    ctx.fillText('GAME OVER', 30, cvs.height/2 + 30);
}

// Game over screen //
function GameOverScreen()
{
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cvs.width, cvs.height);
}
// GAME OVER // 

function GameOver()
{
    if(lives <= 0)
    {
    game_over = true;
    game_overr.play();
    GameOverScreen();
    GameOverText();
    }
}
// won game text //

function GameWonText()
{
    ctx.fillStyle = '#FFF';
    ctx.font = '80px Sofia';
    ctx.fillText("CONGRATS!", 55, cvs.height/2 - 40);
    ctx.fillText("YOU WON!", 60, cvs.height/2 + 60);
}



// won game //

function WonGame()
{
    if(score == brick.row * brick.column * 10)
    {
        game_over = true;
        GameOverScreen();
        GameWonText();
        game_win.play();
    }
}
// update game //

function update()
{
    directionSensor();

    collisionSensor();

    brickCollisionSensor();

    movePaddle();

    moveBall();

    GameOver();

    WonGame();
}

// game loop//
 
function loop()
{
    ctx.drawImage(bg, 0, 0);
    
    draw();

    update();
    
    if(game_over == false )
    requestAnimationFrame(loop);
}
loop();