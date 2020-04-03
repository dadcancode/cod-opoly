class Player {
    constructor(playerNum, name, sym, isHuman = false) {
        this.playerNum = playerNum;
        this.name = name;
        this.sym = sym;
        this.properties = [];
        this.bank = 1500;
        this.inJail = false;
        this.isTurn = false;
        this.currRoll = 0;
        this.isHuman = isHuman;
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
        this.numOfFunc = 0;
        this.numOfApp = 0;
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
        console.log('human generated');
        for(let i = 0; i < this.syms.length; i++) {
            if(this.syms[i].symbol === $(event.currentTarget).text()) {
                let $playerSym = this.syms[i];
                let $playerNum = this.players.length + 1;
                let $playerName = $('#player-select-name').val();
                let newPlayer = new Player($playerNum, $playerName, $playerSym, true);
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
            $('.player-item').eq(i).attr('id', `${this.players[i].name}`);
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
        this.nextRound();
    }
    generateGameTiles(type, position, name, cost, rent, funcCost, appCost, rentWApp, rentWFunc, familyNum, familyId, familySize, familyColor, propImage) {
        let newTile = new GameTile(type, position, name, cost, rent, funcCost, appCost, rentWApp, rentWFunc, familyNum, familyId, familySize, familyColor, propImage);
        this.gameTiles.push(newTile);
    }
    updateBoard() {
        for(let i = 0; i < this.gameTiles.length; i++) {
            console.log(`updating tile ${i}`)
            console.log(this.gameTiles[i].name)
            $(`#tile${i + 1} .property-name`).text(this.gameTiles[i].name);
            $(`#tile${i + 1} .property-cost`).text(this.gameTiles[i].cost);
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
            let $symDiv = $('<div>').addClass('color-sym');
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

        //store players in variable
        let rollers = this.getRollers(arr)
        //roll for all elligible
        this.rollPlayers(rollers);
        this.consoleValue(rollers, 'currRoll');
        //check for tie
        if(this.matchCheck(rollers) === true) {
            //if true reroll the ties
            this.reRoll(rollers);
        } else {
            //set turn in global variable
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name === this.getHighestRoller(rollers).name) {
                    this.setTurn(this.players[i]);
                }
            }
            return this.getHighestRoller(rollers);
        }

    }
    consoleValue(arr, val) {
        for(let i = 0; i < arr.length; i++) {
            console.log(`value ${val} of arr IND ${i} : ${arr[i][val]}`);
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
        //get matches and store
        let newRollers = this.getMatches(arr);
        this.consoleValue(newRollers, 'name');
        this.rollPlayers(newRollers);
        this.consoleValue(newRollers, 'currRoll')
        //if there is another tie
        if(this.matchCheck(newRollers) === true) {
            this.reRoll(newRollers);
        } else {
            //update turn in global
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].name === this.getHighestRoller(newRollers).name) {
                    this.setTurn(this.players[i]);
                }
            }
            return this.getHighestRoller(newRollers);
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

    ////////////////////////////
    //Turn Logic
    //////////////////////////
    endTurn(player) {
        player.isTurn = false;
        $(`.${player.playerNum}`).css(`background-color`, 'white');
    }
    setTurn(player) {
        player.isTurn = true;
        //change background of curr player div
        $(`.${player.playerNum}`).css('background-color', player.sym.backgroundColor);
    }

    whosTurn() {
        for(let i = 0; i < this.players.length; i++) {
            if(this.players[i].isTurn === true) {
                return this.players[i];
            }
        }
    }
    
    nextRound() {
        let currPlayer = this.whosTurn();
        if(currPlayer.isHuman === false) {
            this.compTurn(currPlayer);
        } else {
            this.humanTurn(currPlayer);
        }
    }

    compTurn(player) {
        //check for properties
        if(this.propEval(player.properties) === true) {
            this.buildHouses(this.getImprovedFam(this.getComplFam(player.properties)));
            this.buildHouses(this.getComplFam(player.properties));
        }
        let roll1 = this.rollDice(1);
        let roll2 = this.rollDice(1);
        let totalRoll = roll1 + roll2;
        this.moveToken(player, totalRoll);
        this.updateBoardPos(player);
    }
    rollTurn() {
        this.whosTurn().currRoll = this.rollDice(1);
    }
    getFamToEval(properties) {
        let complFam = this.getComplFam(properties);
        let impovedFam = this.getImprovedFam(complFam);
        if(impovedFam.length > 0) {
            return impovedFam;
        } else {
            return complFam;
        }
    }
    buildHouses(properties) {
        let propToImprove = this.getPropToImprove(properties);
        if(propToImprove !== 'none') {
            if(propToImprove.numOfFunc < 4) {
                propToImprove.numOfFunc++;
                this.whosTurn().bank -= propToImprove.funcCost;
                if(this.propEval(properties) === true) {
                    this.buildHouses(properties);
                }
            } else if(propToImprove.numOfApp < 1) {
                propToImprove.numOfApp++;
                this.whosTurn().bank -= propToImprove.appCost;
                if(this.propEval(properties) === true) {
                    this.buildHouses(properties);
                }
            }            
        }
    }
    bankCheck(itemToCheck) {
        if((this.whosTurn().bank - itemToCheck) > 500) {
            return true;
        }
        return false;
    }
    propCheck(player) {
        if(player.properties.length > 0) {
            return true;
        }
        return false;
    }
    propEval(properties) {
        //get any completed family groups and store in local var
        let complFams = this.getComplFam(properties);
        //if there are any
        if(complFams.length > 0) {
            return true;
        }
        return false;
    }

    

    getImprovedFam(properties) {
        let underConstruction = [];
        for(let i = 0; i < properties.length; i++) {
            for(let j = properties[i].owned.length - 1; j > 0; j--) {
                if(properties[i].owned[j].numOfFunc > 0) {
                    underConstruction.push(properties[i]);
                }
            }
        }
        return underConstruction;
    }
    
    getPropToImprove(properties) {
        for(let i = properties.length - 1; i > 0; i--) {
            let propToImprove = properties[i].owned[properties[i].owned.length - 1];
            let testNum = properties[i].owned[properties[i].owned.length - 1].numOfFunc;
            for(let j = properties[i].owned.length - 1; j > 0; j--) {
                if((properties[i].owned[j].numOfFunc < testNum) && (this.bankCheck(properties[i].owned[j].funcCost) === true)) {
                    propToImprove = properties[i].owned[j];
                    return propToImprove;
                }
            }
            if((testNum < 4) && (this.bankCheck(propToImprove.funcCost) === true)) {
                return propToImprove;
            } else {
                for(let j = properties[i].owned.length - 1; j > 0; j--) {
                    if((properties[i].owned[j].numOfApp < 1) && (this.bankCheck(properties[i].owned[j].appCost) === true)) {
                        propToImprove = properties[i].owned[j];
                        return propToImprove;
                    }
                }
            }
        }
        return 'none';
    }
    

    allFuncBuiltCheck(property) {
        if(property.numOfFunc === 4) {
            return true;
        }
        return false;
    }
    appBuiltCheck(property) {
        if(property.numOfApp === 1) {
            return true;
        }
        return false;
    }

    getComplFam(properties) {
        let complFams = [];
        for(let i = 0; i < properties.length; i++) {
            if(properties[i].size === properties[i].owned.length) {
                complFams.push(properties[i]);
            }
        }
        return complFams;
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
    moveToken(player, num) {
        player.position += num;
        if(player.position > 40) {
            player.position -= 40;
        }
        this.updateBoardPos(player);
    }
    updateBoardPos(player) {
        $(`#tile${player.position + 1} .token-cont`).append($(`.player-token #${player.playerNum}`));
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
//Perl
    currentGame.generateGameTiles('property', 3, 'Perl', 60, 4, 50, 50, [20, 60, 90, 180], 1, 2, 2, 'gold', 'none');
//Income Tax'
    currentGame.generateGameTiles('event', 4, 'Tax', 200);
//MDN
    currentGame.generateGameTiles('property', 5, 'MDN', 200, 25, 0, 0, 0, [25, 50, 100, 200], 0, 1, 4, 'none', 'none');

    currentGame.updateBoard();

    $('#start-modal').css('display', 'block');

    $('#start-btn').on('click', () => {
        let $numOfHumans = $('#numOfPlayers').val();
        currentGame.numOfHumans = $numOfHumans;
        $('#start-modal').css('display', 'none');
        currentGame.resetPlayerSelect();
        $('#player-select').css('display','block');
    });

    $('.color-sym').on('click', (event) => {
        console.log('clicked');
        currentGame.generateHuman(event);
        if(currentGame.players.length < currentGame.numOfHumans) {
            currentGame.resetPlayerSelect();
        } else if(currentGame.players.length === 4) {
            $('#player-select').css('display', 'none');
        } else {
            $('#player-select').css('display', 'none');
            currentGame.generateComputer();
        }
    });

    currentGame.determineOrder(currentGame.players);
    //currentGame.announce(`${firstPlayer.name} goes first`);
    //$('#announcement').css('display', 'block');
    //setTimeout(() => {
    //    $('#announcement').css('display', 'none');
    //}, 1500);
    
    currentGame.startGame();


})