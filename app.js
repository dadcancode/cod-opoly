class Player {
    constructor(playerNum, name, sym) {
        this.playerNum = playerNum;
        this.name = name;
        this.sym = sym;
        this.properties = [];
        this.bank = 1500;
        this.inJail = false;
        this.isTurn = false;
        this.currRoll = 0;
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
        for(let i = 0; i < 4 - this.numOfHumans; i++) {
            for(let j = 0; j < this.syms.length; j++) {
                if(this.syms[j].isSelected === false) {
                    let $compSym = this.syms[j];
                    let $compNum = this.players.length + 1;
                    let $compName = `CPlayer ${$compNum}`;
                    let newComputer = new Player($compNum, $compName, $compSym);
                    this.players.push(newComputer);
                    this.syms[j].isSelected === true;
                    i++
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
        console.log(`number of players : ${this.players.length}`)
        this.updatePlayers();
        this.generateTokens();
    }
    generateGameTiles(type, position, name, cost, rent, funcCost, appCost, rentWApp, rentWFunc, familyNum, familyId, familySize, familyColor, propImage) {
        let newTile = new GameTile(type, position, name, cost, rent, funcCost, appCost, rentWApp, rentWFunc, familyNum, familyId, familySize, familyColor, propImage);
        this.gameTiles.push(newTile);
    }
    updateBoard() {
        for(let i = 1; i < this.gameTiles.length; i++) {
            console.log(`updating tile ${i}`)
            console.log(this.gameTiles[i].name)
            $(`#${i + 1} .property-name`).text(this.gameTiles[i].name);
            $(`#${i + 1} .property-cost`).text(this.gameTiles[i].cost);
        }
    }
    //////////////////////
    //Modals
    showModal(modal) {
        $(modal).css('display', 'block');
    }
    hideModal(modal) {
        $(modal).css('display', 'none');
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
                    this.determineOrder(this.players);
                } else {
                    $('#player-select').css('display', 'none');
                    this.generateComputer();
                    this.determineOrder(this.players);
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
    //////////////////////
    //roll for order
    determineOrder(arr) {
        console.log('determineOrder');
        //roll for each player and push to modal
        // for(let i = 0; i < this.players.length; i++) {
        //     let $rollResultCont = $('<div>').addClass('roll-result');
        //     let $playerDiv = $('<div>').text(`${this.players[i].name} is rolling. . .`);
        //     this.players[i].currRoll = this.rollDice(1);
        //     let $rollResult = $('<div>').text(`> ${this.players[i].currRoll}`);
        //     $rollResultCont.append($playerDiv);
        //     setTimeout(() => {
        //         $('#results').append($rollResultCont);
        //         setTimeout(() => {
        //             $rollResultCont.append($rollResult);
        //         }, 250 * i + 1);
        //     }, 1000 * i + 1);
        // }
        // if(this.matchCheck() === true) {
        //     this.announceTies();
        //     setTimeout(() => {
        //         this.reRollMatches();
        //     }, 3000);
        // } else {
        //     this.announce(`${this.getHighestRoller().name} goes first!`)
        //     $('#announcement').css('display', 'block');
        //     setTimeout(() => {
        //         $('#announcement').css('display', 'none');
        //     }, 1000);
        //     this.startGame();
        // }
        let rollers = this.getRollers(arr)
        console.log(rollers[0].name);
        console.log(rollers[1].name);
        console.log(rollers[2].name);
        this.rollPlayers(rollers);
        console.log(rollers[0].currRoll);
        console.log(rollers[1].currRoll);
        console.log(rollers[2].currRoll);
        if(this.matchCheck(rollers) === true) {
            this.reRoll(rollers);
        } else {
            this.announce(`${this.getHighestRoller(rollers).name} goes first`)
            $('#announcement').css('display', 'block');
            setTimeout(() => {
                $('#announcement').css('display', 'none');
            }, 2300)
            setTimeout(() => {
                this.startGame();
            }, 2700);
        }

    }
    consoleValue(arr, val) {
        for(let i = 0; i < arr.length; i++) {
            console.log(`value ${val} of ${arr} IND ${i} : ${arr[i][val]}`);
        }
    }
    getRollers(arr) {
        let rollers = [];
        for(let i = 0; i < arr.length; i++) {
            rollers.push(arr[i]);
        }
        return rollers;
    }
    rollPlayers(arr) {
        console.log('rollPlayers');
        for(let i = 0; i < arr.length; i++) {
            console.log(`rollPlayers loop ${i}`)
            arr[i].currRoll = this.rollDice(1);
            console.log(`${arr[i].name} roll is now ${arr[i].currRoll}`);
        }
    }
    reRoll(arr) {
        console.log('reroll');
        let newRollers = this.getMatches(arr);
        this.consoleValue(newRollers, 'name');
        this.rollPlayers(newRollers);
        this.consoleValue(newRollers, 'currRoll')
        if(this.matchCheck(newRollers) === true) {
            this.reRoll(newRollers);
        } else {
            this.announce(`${this.getHighestRoller(newRollers).name} goes first`)
            $('#announcement').css('display', 'block');
            setTimeout(() => {
                $('#announcement').css('display', 'none');
            }, 2300)
            setTimeout(() => {
                this.startGame();
            }, 2700);
        }
    }
        //determine highest roller
    getHighestRoller(arr) {
        let highestRoller = arr[0];
        for(let i = 1; i < arr.length; i++) {
            if(arr[i].currRoll > highestRoller.currRoll) {
                highestRoller = arr[i];
            }
        }
        return highestRoller;
    }
        //check for matches
    getRolls(arr) {
        let rollerArr = [];
        for(let i = 0; i < arr.length; i++) {
            rollerArr.push(arr[i].currRoll);
        }
        return rollerArr;
    }
    getMatches(arr) {
        let highestRoller = this.getHighestRoller(arr);
        let matchArr = [];
        for(let i = 0; i < arr.length; i++) {
            if(arr[i].currRoll === highestRoller.currRoll) {
                matchArr.push(arr[i]);
            }
        }
        return matchArr;

    }
    matchCheck(arr) {
        let matchArr = this.getMatches(arr);
        
        if(matchArr.length > 1) {
            return true;
        } else {
            return false;
        }
    }
    ////////////////////////////
    //announcement modal
    announce(text) {
        $('#announcement-text').empty().text(text);
    }
    
    /////////////////////////////
    //Token Movement
    generateTokens() {
        for(let i = 0; i < this.players.length; i++) {
            let $token = $('<div>').addClass('player-token').attr('id', `${i}`).text(this.players[i].sym.symbol).css({
                'background-color' : this.players[i].sym.backgroundColor,
                'color' : this.players[i].sym.color
            });
            $('#go-token-cont').append($token);
        }
    }
    rollDice(numOfDie) {
        let result = 0;
        for(let i = 0; i < numOfDie; i ++) {
            result += ((Math.floor(Math.random() * 6) + 1));
        }
        return result
    }
    ////////////////////////
    //gameplay
    clearRolls(arr) {
        for(let i = 0; i < arr.length; i++) {
            arr[i].currRoll = 0;
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
//Freelance 1
    currentGame.generateGameTiles('event', 2, 'Freelance');
    console.log(currentGame.gameTiles[2].name)
//Perl
    currentGame.generateGameTiles('property', 3, 'Perl', 60, 4, 50, 50, [20, 60, 90, 180], 1, 2, 2, 'gold', 'none');
//Income Tax'
    currentGame.generateGameTiles('event', 4, 'Tax', 200)
//MDN
    currentGame.generateGameTiles('property', 5, 'MDN', 200, 25, 0, 0, 0, [25, 50, 100, 200], 0, 1, 4, 'none', 'none')

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