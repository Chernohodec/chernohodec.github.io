document.addEventListener('DOMContentLoaded', () => {

    const styles = window.getComputedStyle(canvas);

    const style = {
        height() {
          return +styles.height.slice(0, -2);
        },
        width() {
          return +styles.width.slice(0, -2);
        }
    };

    function getRandomBool() {
        if (Math.floor(Math.random() * 2) === 0) {
            return true;
        }
    }

    let gameCounter = 0

    const imagesArrays = new Array(10);

    for (let i = 0; i !== imagesArrays.length; i++) {
        const imagesArray = new Array(9);
        for (let j = 0; j < 9; j++) {
            if (j === 0) {
                const img = new Image();
                img.onload = function () {
                    imagesArray[0] = img;
                };
                img.src = `../../assets/img/games/game${i + 1}/0.jpg`;
            }
            else {
                const img = new Image();
                img.onload = function () {
                    imagesArray[j] = img;
                };
                img.src = `../../assets/img/games/game${i + 1}/${j}.jpg`;
            }
        }
        imagesArrays[i] = imagesArray
    }


    function fillState(imgArray) {
        return [
            [{ number: 1, image: imgArray[1] }, { number: 2, image: imgArray[2] }, { number: 3, image: imgArray[3] }],
            [{ number: 4, image: imgArray[4] }, { number: 5, image: imgArray[5] }, { number: 6, image: imgArray[6] }],
            [{ number: 7, image: imgArray[7] }, { number: 8, image: imgArray[8] }, { number: 0, image: imgArray[0] }],
        ]
    }


    function Game(context, cellSize) {
        this.state = fillState(imagesArrays[gameCounter]);
        this.context = context;
        this.cellSize = cellSize;
        this.color = "#FFB93B";
        this.clicks = 0;

        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        const scaleFactor = 3;
        canvas.width = originalWidth * scaleFactor;
        canvas.height = originalHeight * scaleFactor;
        canvas.style.width = originalWidth;
        canvas.style.height = originalHeight;
        context.scale(scaleFactor, scaleFactor);
        context.fillStyle = "#FFB93B";
        context.fillRect(0,0, originalWidth, originalHeight);
    }

    Game.prototype.getClicks = function () {
        return this.clicks;
    };

    Game.prototype.cellView = function (x, y) {
        this.context.fillStyle = this.color;
        this.context.fillRect(
            x + 1,
            y + 1,
            this.cellSize - 2,
            this.cellSize - 2
        );
    };

    Game.prototype.numView = function () {
        this.context.font = "bold " + (this.cellSize / 2) + "px Sans";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillStyle = "#222";
    };

    Game.prototype.draw = function () {
        let cellSizeEqualizer = 2
        if (window.innerWidth > 1200) {
            cellSizeEqualizer = 5
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.state[i][j]["number"] > 0) {
                    this.cellView(
                        j * this.cellSize,
                        i * this.cellSize
                    );
                    this.context.drawImage(
                        this.state[i][j]['image'],
                        j * this.cellSize + cellSizeEqualizer,
                        i * this.cellSize + cellSizeEqualizer,
                        this.cellSize - cellSizeEqualizer*2,
                        this.cellSize - cellSizeEqualizer*2
                    );
                }
            }
        }
    };

    Game.prototype.getNullCell = function () {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.state[j][i]["number"] === 0) {
                    return { x: i, y: j };
                }
            }
        }
    };

    Game.prototype.move = function (x, y) {
        let nullCell = this.getNullCell();
        let canMoveVertical = (x - 1 == nullCell.x || x + 1 == nullCell.x) && y == nullCell.y;
        let canMoveHorizontal = (y - 1 == nullCell.y || y + 1 == nullCell.y) && x == nullCell.x;

        if (canMoveVertical || canMoveHorizontal) {
            this.state[nullCell.y][nullCell.x]["number"] = this.state[y][x]["number"];
            this.state[nullCell.y][nullCell.x]["image"] = this.state[y][x]["image"];
            this.state[y][x]["number"] = 0;
            // this.state[y][x]["image"] = this.state[3][3]["image"];
            this.state[y][x]["image"] = document.querySelector('.number-0');
            this.clicks++;
        }
    };

    Game.prototype.victory = function () {
        let combination = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
        let res = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (combination[i][j] != this.state[i][j]["number"]) {
                    res = false;
                    break;
                }
            }
        }
        return res;
    };

    Game.prototype.mix = function (count) {
        let x, y;
        for (let i = 0; i < 5; i++) {
            let nullCell = this.getNullCell();

            let verticalMove = getRandomBool();
            let upLeft = getRandomBool();

            if (verticalMove) {
                x = nullCell.x;
                if (upLeft) {
                    y = nullCell.y - 1;
                } else {
                    y = nullCell.y + 1;
                }
            } else {
                y = nullCell.y;
                if (upLeft) {
                    x = nullCell.x - 1;
                } else {
                    x = nullCell.x + 1;
                }
            }

            if (0 <= x && x <= 2 && 0 <= y && y <= 2) {
                this.move(x, y);
            }
        }

        this.clicks = 0;
    };

    const startGame = (gameID) => {
        let canvas = document.querySelector("canvas");
        if (window.innerWidth > 1200) {
            canvas.width = 600;
            canvas.height = 600;
        } else {
            canvas.width = 300;
            canvas.height = 300;
        }

        let context = canvas.getContext("2d");
        context.fillStyle = '#FFB93B';
        // context.imageSmoothingEnabled = false;
        context.fillRect(0, 0, canvas.width, canvas.height);

        let cellSize = canvas.width / 3;

        let game = new Game(context, cellSize);
        game.mix(300);
        game.draw();

        canvas.onclick = function (e) {
            let x = (e.pageX - canvas.offsetLeft) / cellSize | 0;
            let y = (e.pageY - canvas.offsetTop) / cellSize | 0;
            onEvent(x, y);
        };

        canvas.ontouchend = function (e) {
            let x = (e.touches[0].pageX - canvas.offsetLeft) / cellSize | 0;
            let y = (e.touches[0].pageY - canvas.offsetTop) / cellSize | 0;

            onEvent(x, y);
        };

        function onEvent(x, y) {
            game.move(x, y);
            context.fillRect(0, 0, canvas.width, canvas.height);
            game.draw();
            if (game.victory()) {
                // alert("Собрано за " + game.getClicks() + " касание!");
                gameCounter++
                reloadButtonWrapper.classList.remove('prize-field__game-info-field_hidden')
                const fullImage = reloadButtonWrapper.querySelector('.prize-field__full-image')
                fullImage.src = `assets/img/games/game${gameCounter}/full.jpg`
                // game.mix(300);
                // context.fillRect(0, 0, canvas.width, canvas.height);
                // game.draw(context, cellSize);
            }
        }
    }

    const playButton = document.querySelector('.prize-field__game-button')
    const reloadButton = document.querySelector('.prize-field__reload-button')
    const reloadButtonWrapper = document.querySelector('.prize-field__game-info-field_type_victory')
    const playButtonWrapper = document.querySelector('.prize-field__game-info-field_type_start')

    playButton.addEventListener('click', function (e) {
        e.preventDefault();
        playButtonWrapper.classList.add('prize-field__game-info-field_hidden')
        startGame(gameCounter)
    })

    reloadButton.addEventListener('click', function (e) {
        e.preventDefault();
        reloadButtonWrapper.classList.add('prize-field__game-info-field_hidden')
        startGame(gameCounter)
    })
})