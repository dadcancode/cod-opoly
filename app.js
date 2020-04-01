class Player {
    constructor(playerNum, name, sym) {
        this.playerNum = playerNum;
        this.name = name;
        this.sym = sym;
        this.properties = [];
        this.bank = 1500;
        this.inJail = false;
        this.isTurn = false;
    }
}

class GameTile {
    constructor(type, position, name, cost, rent, funcCost, appCost, rentWApp, rentWFunc, familyNum, familyId, familySize, familyColor, propImage = 'none') {
        this.type = type;
        this.position = position;
        this.name = name;
        this.cost = cost;
        this.funcWritten = 0;
        this.appWritten = 0;
        this.rent = rent;
        this.funcCost = funcCost;
        this.rentWFunc = rentWFunc;
        this.appCost = appCost;
        this.rentWApp = rentWApp;
        this.familyNum = familyNum;
        this.familyId = familyId;
        this.familySize = familySize;
        this.isPurchased = false;
        this.familyColor = familyColor;
        this.propImage = propImage;
    }
}

class Game {
    constructor(numOfHumans = 1) {
        this.gameTiles = [];
        this.players = [];
        this.syms = [
            {
                symbol: '{}',
                isSelected: false,
                backgroundColor: 'yellow',
                color: 'darkblue'
            },
            {
                symbol: ';',
                isSelected: false,
                backgroundColor: 'red',
                color: 'green'
            },
            {
                symbol: "#",
                isSelected: false,
                backgroundColor: 'blue',
                color: 'coral'
            },
            {
                symbol: "$",
                isSelected: false,
                backgroundColor: 'darkgreen',
                color: 'orange'
            }
        ]
        this.numOfHumans = numOfHumans;
    }
//Game Setup
    generateHuman(event) {
        for(let i = 0; i < this.syms.length; i++) {
            if(this.syms[i].symbol === $(event.currentTarget).text()) {
                let $playerSym = this.syms[i];
                let $playerNum = this.players.length + 1;
                let $playerName = $('#player-select-name').val();
                let newPlayer = new Player($playerNum, $playerName, $playerSym);
                this.players.push(newPlayer);
                this.syms[i].isSelected = true;
            }
        }
    }
    generateComputer() {
        for(let i = 1; i <= 4 - this.numOfHumans; i++) {
            for(let j = 0; j < this.syms.length; j++) {
                if(this.syms[j].isSelected === false) {
                    let $compSym = this.syms[j];
                    let $compNum = this.players.length + 1;
                    let $compName = `CPlayer ${$compNum}`;
                    let newComputer = new Player($compNum, $compName, $compSym);
                    this.players.push(newComputer);
                    this.syms[j].isSelected === true;
                }

            }
        }
    }
    updatePlayers() {
        for(let i = 0; i < 4; i++) {
            // console.log(this.players[i].sym);
            $('.player-icon-cont').eq(i).text(this.players[i].sym.symbol).css({
                'background-color' : this.players[i].sym.backgroundColor,
                'color' : this.players[i].sym.color
            });
            $('.player-id-name span').eq(i).text(this.players[i].name);
            $('.player-money span').eq(i).text(this.players[i].bank);
        }
    }
    startGame() {
        this.updatePlayers();
    }
    generateGameTiles(type, position, name, cost, rent, funcCost, appCost, rentWApp, rentWFunc, familyNum, familyId, familySize, familyColor, propImage) {
        let newTile = new GameTile(type, position, name, cost, rent, funcCost, appCost, rentWApp, rentWFunc, familyNum, familyId, familySize, familyColor, propImage);
        this.gameTiles.push(newTile);
    }
    updateBoard() {
        for(let i = 1; i < 5; i++) {
            $(`#${i + 1} .property-name`).text(this.gameTiles[i].name);
        }
    }
//Player select modal
    resetPlayerSelect() {
        $('#player-select-name').val('');
        $('#player-select-number').text(`Player ${this.players.length + 1}`);
        this.generateSymbols();

    }
    generateSymbols() {
        $('#color-sym-select').empty();
        for(let i = 0; i < this.syms.length; i++) {
            let $symDiv = $('<div>').addClass('color-sym').on('click', (event) => {
                console.log('clicked');
                this.generateHuman(event);
                if(this.players.length < this.numOfHumans) {
                    this.resetPlayerSelect();
                } else if(this.players.length === 4) {
                    $('#player-select').css('display', 'none');
                    this.startGame();
                } else {
                    $('#player-select').css('display', 'none');
                    this.generateComputer();
                    this.startGame();
                }
            });
            if(this.syms[i].isSelected === false) {
                $symDiv.text(this.syms[i].symbol).attr('id', `${i}`);
                $('#color-sym-select').append($symDiv);
            } else {
                $symDiv.text(this.syms[i].symbol).attr('id', `${i}`).css('display', 'none');
                $('#color-sym-select').append($symDiv);
            }
        }
    }   
}




$(() => {
    const currentGame = new Game();
//creating game tiles
//go tile
    currentGame.generateGameTiles('corner', 0, 'go', 0, 0, 0, 0, 0, 0, 0, 0, 0);
//Lisp
    currentGame.generateGameTiles('property', 1, 'Lisp', 60, 2, 50, 50, 250, [10, 30, 90, 160], 1, 1, 2, 'gold', 'none');
//Community Chest 1
    currentGame.generateGameTiles(currentGame.generateSymbols('event', 2, 'Community Chest'));
//Perl
    currentGame.generateGameTiles('property', 3, 'Perl', 60, 4, 50, 50, [20, 60, 90, 180], 1, 2, 2, 'gold', 'none');

    currentGame.updateBoard();

    $('#start-modal').css('display', 'block');
    $('#start-btn').on('click', () => {
        let $numOfHumans = $('#numOfPlayers').val();
        currentGame.numOfHumans = $numOfHumans;
        $('#start-modal').css('display', 'none');
        currentGame.resetPlayerSelect();
        $('#player-select').css('display','block');
    })
})