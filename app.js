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
        this.currDie1 = 0;
        this.currDie2 = 0;
        this.isHuman = isHuman;
        this.position = 0;
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
        this.owner = 5;
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
                console.log(`newplayer ishuma = ${newPlayer.isHuman}`)
                this.players.push(newPlayer);
                this.syms[i].isSelected = true;
            }
        }
    }
    generateComputer() {
        console.log('generatecomputer')
        for(let i = 0; i < 4 - this.numOfHumans; i++) {
            for(let j = 0; j < this.syms.length; j++) {
                if(this.syms[j].isSelected === false) {
                    let $compSym = this.syms[j];
                    let $compNum = this.players.length + 1;
                    let $compName = `CPlayer ${$compNum}`;
                    let newComputer = new Player($compNum, $compName, $compSym);
                    console.log(`newcomputer ishuman = ${newComputer.isHuman}`)
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
    humanPlayersCreated() {
        if(this.numOfHumans < this.players.length) {
            return false;
        }
        return true;
    }
    startGame() {
        console.log('startgame')
        $('#start-modal').css('display', 'block');

        $('#start-btn').on('click', () => {
            let $numOfHumans = $('#numOfPlayers').val();
            console.log(`numofhum val = ${$numOfHumans}`)
            this.numOfHumans = $numOfHumans;
            console.log(`this.numOfhumans = ${this.numOfHumans}`)
            $('#start-modal').css('display', 'none');
            this.resetPlayerSelect();
            $('#player-select').css('display','block');
        });

        
        
        
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
        console.log('this.resetPlayerSelect')
        $('#player-select-name').val('');
        $('#player-select-number').text(`Player ${this.players.length + 1}`);
        this.generateSymbols();

    }
    generateSymbols() {
        console.log('generatesymbols')
        $('#color-sym-select').empty();
        for(let i = 0; i < this.syms.length; i++) {
            let $symDiv = $('<div>').addClass('color-sym');
            if(this.syms[i].isSelected === false) {
                $symDiv.text(this.syms[i].symbol).attr('id', `${i}`).on('click', () => {
                    console.log('clicked');
                    this.generateHuman(event);
                    if(this.players.length === 4) {
                        $('#player-select').css('display', 'none');
                        this.determineOrder(this.players);
                        let firstPlayer = this.whosTurn();
                        this.updatePlayers();
                        this.generateTokens();
                        this.announce(`${firstPlayer.name} goes first!`);
                        // $('#announcement').show();
                        // setTimeout(() => {
                        //     $('#announcement').hide();
                        // }, 1200);
                        setTimeout(() => {
                            this.nextRound();
                        }, 2400);
                    } else if(this.numOfHumans < this.players.length) {
                        this.resetPlayerSelect();
                    } else {
                        $('#player-select').css('display', 'none');
                        this.generateComputer();
                        this.determineOrder(this.players);
                        let firstPlayer = this.whosTurn();
                        this.updatePlayers();
                        this.generateTokens();
                        this.announce(`${firstPlayer.name} goes first!`);
                        setTimeout(() => {
                            this.nextRound();
                        }, 2400);
                    }
                });
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
        let rollers = this.getRollers(arr)
        //roll for all elligible
        this.rollPlayers(rollers);
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
        this.rollPlayers(newRollers);
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
        $('#announcement').show();
        setTimeout(() => {
            $('#announcement').hide('slow');
        }, 800);
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
        console.log(`nextround`);
        console.log(`----whosturn = ${this.whosTurn().name}`);
        if(this.whosTurn().isHuman === false) {
            this.compTurn(this.whosTurn());
        } 
        // else {
        //     this.humanTurn(this.whosTurn());
        // }
    }

    compTurn(player) {
        console.log(`compturn ${player.name}`);
        //check for properties
        console.log(this.getPropToImprove(player.properties));
        while(this.getPropToImprove(player.properties) !== 'none') {
            this.buildHouses(this.getPropToImprove(player.properties));
        }
        if(this.getPropToImprove(player.properties) === 'none') {
            this.rollTurn(player);
            this.moveToken(player, player.currRoll);
            this.positionEval(player);
        }
    }
    rollTurn(player) {
        console.log('rollturn')
        player.currDie1 = this.rollDice(1);
        player.currDie2 = this.rollDice(1);
        player.currRoll = (player.currDie1 + player.currDie2);
        console.log(`----${player.currRoll}`)

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

    buildHouses(property) {
        if(property.numOfFunc === 4) {
            property.numOfFunc++;
            this.whosTurn().bank -= property.funcCost;
        } else {
            property.numOfApp++;
            this.whosTurn().bank -= property.appCost;
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

    testCompletedProps(properties) {
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

    testImprovedProps(properties) {
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
    
    getPropToImprove(properties) {
        console.log('getproptoimprove')
        if(this.testImprovedProps(this.getImprovedFam(this.getComplFam(properties)) !== 'none')) {
            return this.testImprovedProps(this.getImprovedFam(this.getComplFam(properties)));
        } else if(this.testCompletedProps(this.getComplFam(properties)) !== 'none') {
            return this.testCompletedProps(this.getComplFam(properties));
        } else {
            return 'none';
        }
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
            let $token = $('<div>').addClass('player-token').attr('id', `token${i}`).text(this.players[i].sym.symbol).css({
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
    moveToken(player) {
        console.log('movetoken');
        player.position += player.currRoll;
        console.log(`---player.position = ${player.position}`);
        if(player.position > 40) {
            player.position -= 40;
        }
        this.updateBoardPos(player);
    }
    updateBoardPos(player) {
        console.log('updateboardpos')
        $(`#tile${player.position + 1} .token-cont`).append($(`#token${player.playerNum - 1}`));
        // $(`#token${player.playerNum - 1}`).css('background-color', 'pink');
    }

    positionEval(player) {
        console.log(`positioneval`)
        if(this.getPlayerBoardLocation(player).type === 'property') {
            console.log(`----landed on prop = ${this.getPlayerBoardLocation(player).name}`)
            this.landedOnProp(player);
        } else if(this.getPlayerBoardLocation(player).type === 'event') {
            this.landedOnEvent(player);
        }
    }

    getPlayerBoardLocation(player) {
        return this.gameTiles[player.position];
    }

    landedOnProp(player) {
        console.log(`landedonprop`)
        console.log(`---is player human? ${player.isHuman}`)
        if(player.isHuman === false) {
            console.log(`player is computer`)
            console.log(`----owner of property landed on is ${this.getPlayerBoardLocation(player).owner}`);
            if((this.getPlayerBoardLocation(player).owner === 5) && (this.bankCheck(this.getPlayerBoardLocation(player).cost) === true)) {
                console.log(`----${this.getPlayerBoardLocation(player).name} is for sale`)
                this.buyProp(player, this.getPlayerBoardLocation(player));
                this.announce(`${player.name} has purchased ${this.getPlayerBoardLocation(player).name} for $${this.getPlayerBoardLocation(player).cost}`);
            }
        }
    }
    buyProp(player, property) {
        console.log('buy prop')
        let fId = property.familyNum;
        let fSize = property.familySize;
        //check to see if any other family members are owned
        for(let i = 0; i < player.properties.length; i++) {
            if(player.properties[i].id === property.familyNum) {
                console.log(`${player.name} already owns part of this family group`);
                player.properties[i].owned.push(property);
                console.log(`------${player.properties.owned[player.properties.owned.length - 1].name} has been added to ${player.name}'s properties`);
            } else {
                player.properties.owned.push(
                    {
                        id: fId,
                        size: fSize,
                        owned: [property]
                    }
                );
                console.log(`------${player.properties.owned[player.properties.owned.length - 1].name} has been added to ${player.name}'s properties`);
            }
        }
        property.owner = player.name;
        // this.sortProp(player.properties.owned);
    }
    sortProp(propArr) {
        propArr.sort((a, b) => {
            return b.id - a.id;
        })
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
    console.log(`currentGame.players.lenth = ${currentGame.players.length}`)
//creating game tiles
//go tile
    currentGame.generateGameTiles('corner', 0, 'go');
//Lisp
    currentGame.generateGameTiles('property', 1, 'Lisp', 60, 2, 50, 50, 250, [10, 30, 90, 160], 1, 0, 2, 'gold', 'none');
//Freelance 1
    currentGame.generateGameTiles('event', 2, 'Freelance');
//Perl
    currentGame.generateGameTiles('property', 3, 'Perl', 60, 4, 50, 50, 450, [20, 60, 90, 180], 1, 1, 2, 'gold', 'none');
//Income Tax'
    currentGame.generateGameTiles('event', 4, 'Tax', 200);
//MDN
    currentGame.generateGameTiles('property', 5, 'MDN', 200, 25, 0, 0, 0, [25, 50, 100, 200], 0, 0, 4, 'none', 'none');
//HTML
    currentGame.generateGameTiles('property', 6, 'HTML', 100, 6, 50, 50, 550, [30, 90, 270, 400], 2, 0, 3, 'blue');
//Craigslist 1
    currentGame.generateGameTiles('event', 7, 'Craigslist');
//CSS
    currentGame.generateGameTiles('property', 8, 'CSS', 100, 6, 50, 50, 550, [30, 90, 270, 400], 2, 1, 3, 'blue');
//JavaScript
    currentGame.generateGameTiles('property', 9, 'JavaScript', 120, 8, 50, 50, 600, [40, 100, 300, 450], 2, 2, 3, 'blue')
//Jail
    currentGame.generateGameTiles('corner', 10, 'Jail')

    currentGame.updateBoard();

    // $('#start-modal').css('display', 'block');

    // $('#start-btn').on('click', () => {
    //     let $numOfHumans = $('#numOfPlayers').val();
    //     currentGame.numOfHumans = $numOfHumans;
    //     $('#start-modal').css('display', 'none');
    //     currentGame.resetPlayerSelect();
    //     $('#player-select').css('display','block');
    // });
    
    currentGame.startGame();


})