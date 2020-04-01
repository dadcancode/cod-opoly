class Player {
    constructor(playerNum, name, sym, color) {
        this.playerNum = playerNum;
        this.name = name;
        this.sym = sym;
        this.color = color;
        this.properties = [];
        this.bank = 1500;
        this.inJail = false;
        this.isTurn = false;
    }
}

class GameTile {
    constructor(type, position, name, cost, rent, funcCost, appCost, rentWApp, familyNum, familyId, familySize) {
        this.type = type;
        this.position = position;
        this.name = name;
        this.cost = cost;
        this.funcWritten = 0;
        this.appWritten = 0;
        this.rent = rent;
        this.funcCost = funcCost;
        this.rentWFunc = [];
        this.appCost = appCost;
        this.rentWApp = rentWApp;
        this.familyNum = familyNum;
        this.familyId = familyId;
        this.familySize = familySize;
        this.isPurchased = false;
    }
}

class Game {
    constructor(numOfHumans = 1) {
        this.properties = [];
        this.players = [];
        this.numOfHumans = numOfHumans;
    }
    generateHuman(event) {
        let $playerSym = $(event.currentTarget).text();
        let $playerCol = $(event.currentTarget).css('background-color');
        let $playerNum = this.players.length + 1;
        let $playerName = $('#player-select-name').val();
        let newPlayer = new Player($playerNum, $playerName, $playerSym, $playerCol);
        this.players.push(newPlayer);
    }
    generateComputer() {
        for(let i = 1; i < 5 - this.numOfHumans; i++) {
            let $compSym = $('.unselected').eq(0).text();
            let $compCol = $('.unselected').eq(0).css('background-color');
            let $compNum = this.players.length + 1;
            let $compName = `CPlayer ${$compNum}`;
            let newComputer = new Player($compNum, $compName, $compSym, $compCol);
            $('.unselected').eq(0).removeClass('unselected').addClass('selected');
            this.players.push(newComputer);
        }
    }
    resetPlayerSelect() {
        $('#player-select-name').val('');
        $('#player-select-number').text(`Player ${this.players.length + 1}`);
    }
    updatePlayers() {
        for(let i = 0; i < 4; i++) {
            // console.log(this.players[i].sym);
            $('.player-icon-cont').eq(i).text(this.players[i].sym).css('background-color', this.players[i].color);
            $('.player-id-name span').eq(i).text(this.players[i].name);
            $('.player-money span').eq(i).text(this.players[i].bank);
        }
    }
    startGame() {
        this.updatePlayers();
    }
}




$(() => {
    const currentGame = new Game();
    $('#start-modal').css('display', 'block');
    $('#start-btn').on('click', () => {
        let $numOfHumans = $('#numOfPlayers').val();
        currentGame.numOfHumans = $numOfHumans;
        $('#start-modal').css('display', 'none');
        currentGame.resetPlayerSelect();
        $('#player-select').css('display','block');
    })
    $('.unselected').on('click', (event) => {
        console.log('clicked');
        currentGame.generateHuman(event);
        $(event.currentTarget).removeClass('unselected').addClass('selected');
        if(currentGame.players.length < currentGame.numOfHumans) {
            currentGame.resetPlayerSelect();
        } else if(currentGame.players.length === 4) {
            $('#player-select').css('display', 'none');
            currentGame.startGame();
        } else {
            $('#player-select').css('display', 'none');
            currentGame.generateComputer();
            currentGame.startGame();
        }


    })
})