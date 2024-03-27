document.addEventListener('DOMContentLoaded', () => {
    function getRandomBool() {
        if (Math.floor(Math.random() * 2) === 0) {
            return true;
        }
    }

    const imagesArray = new Array(9);

    for (let i = 0; i < 9; i++) {
        // const img = new Image();
        // img.onload = function () {
        //     imagesArray.push(img)
        // };
        if (i === 0) {
            const img = new Image();
            img.onload = function () {
                imagesArray[0] = img;
            };
            img.src = `../../assets/img/games/game1/0.jpg`;
        }
        else {
            const img = new Image();
            img.onload = function () {
                imagesArray[i] = img;
            };
            img.src = `../../assets/img/games/game1/${i}.jpg`;
        }
    }

    function fillState(imgArray) {
        return [
            [{ number: 1, image: imgArray[1] }, { number: 2, image: imgArray[2] }, { number: 3, image: imgArray[3] }],
            [{ number: 4, image: imgArray[4] }, { number: 5, image: imgArray[5] }, { number: 6, image: imgArray[6] }],
            [{ number: 7, image: imgArray[7] }, { number: 8, image: imgArray[8] }, { number: 0, image: imgArray[0] }],
        ]
    }


    function Game(context, cellSize) {
        this.state = fillState(imagesArray);

        

        this.context = context;
        this.cellSize = cellSize;
        this.color = "#FFB93B";
        this.clicks = 0;
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
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.state[i][j]["number"] > 0) {
                    this.cellView(
                        j * this.cellSize,
                        i * this.cellSize
                    );
                    this.context.drawImage(
                        this.state[i][j]['image'],
                        j * this.cellSize,
                        i * this.cellSize,
                        this.cellSize - 2,
                        this.cellSize - 2
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
        for (let i = 0; i < 2; i++) {
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

    window.onload = function () {
        let canvas = document.querySelector("canvas");
        if (window.innerWidth > 1200) {
            canvas.width = 600;
            canvas.height = 600;
        } else {
            canvas.width = 300;
            canvas.height = 300;
        }

        let context = canvas.getContext("2d");
        context.fillStyle = '#FFB93B'
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
                alert("Собрано за " + game.getClicks() + " касание!");
                game.mix(300);
                context.fillRect(0, 0, canvas.width, canvas.height);
                game.draw(context, cellSize);
            }
        }
    }
})