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
        ];
        this.freelanceCards = [
            {
                name: 'Freelance',
                statAffected: 'bank',
                effect: 'positive',
                valOfEffect: 50,
                text: 'You helped someone create an app for their dog. You earned $50'
            },
            {
                name: 'Freelance',
                statAffected: 'bank',
                effect: 'negative',
                valOfEffect: 35,
                text: 'You need a new keyboard. Pay $35'
            },
            {
                name: 'Freelance',
                statAffected: 'position',
                effect: 'positive',
                valOfEffect: 0,
                text: 'Proceed to go, collect $200'
            }

        ];
        this.craigslistCards = [
            {
                name: 'Craigslist',
                statAffected: 'bank',
                effect: 'negative',
                valOfEffect: 100,
                text: 'Bought gaming mouse online for $100.  Turns out it was an actual mouse that plays tetris.'
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
                        $('#ann-close').on('click', () => {
                            $('#announcement').hide('slow');
                            this.nextRound();
                        });
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
                        $('#ann-close').on('click', () => {
                            $('#announcement').hide('slow');
                            this.nextRound();
                        });
                        // $('#ann-close').off('click');
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
        $('#ann-close').off('click');
        $('#announcement-text').empty().text(text);
        $('#announcement').show('slow');
        // setTimeout(() => {
        //     $('#announcement').hide('slow');
        // }, 2000);
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
            this.moveComp(player);
        }
    }


    moveComp(player) {
        this.rollTurn(player);
        this.moveToken(player, player.currRoll);
        this.positionEval(player);

    }

    doublesCheck(player) {
        if(player.currDie1 === player.currDie2) {
            this.announce(`${player.name} rolled doubles. Roll again!`);
            $('#ann-close').on('click', () => {
                $('#announcement').hide('slow');
                this.moveComp(player);
                
            });
        }
        this.rotatePlay(player);
    }

    rotatePlay(player) {
        this.endTurn(player);
        if(player.playerNum === 2) {
            this.setTurn(this.players[3]);
            this.announce(`${this.players[3].name}'s turn`);
            $('#ann-close').on('click', () => {
                $('#announcement').hide('slow');
                this.nextRound();
            });
            // $('#ann-close').off('click');
        } else if(player.playerNum === 4) {
            this.setTurn(this.players[2]);
            this.announce(`${this.players[2].name}'s turn`);
            $('#ann-close').on('click', () => {
                $('#announcement').hide('slow');
                this.nextRound();
            });
            // $('#ann-close').off('click');
        } else if(player.playerNum === 3) {
            this.setTurn(this.players[0]);
            this.announce(`${this.players[0].name}'s turn`);
            $('#ann-close').on('click', () => {
                $('#announcement').hide('slow');
                this.nextRound();
            });
            // $('#ann-close').off('click');
        } else if(player.playerNum === 1) {
            this.setTurn(this.players[1]);
            this.announce(`${this.players[1].name}'s turn`);
            $('#ann-close').on('click', () => {
                $('#announcement').hide('slow');
                this.nextRound();
            });
            // $('#ann-close').off('click');
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
        console.log('generatetokens')
        for(let i = 0; i < this.players.length; i++) {
            let $token = $('<div>').addClass('player-token').attr('id', `token${i}`).text(this.players[i].sym.symbol).css({
                'background-color' : this.players[i].sym.backgroundColor,
                'color' : this.players[i].sym.color
            });
            $('#tile1 .token-cont').append($token);
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

    // doublesCheck(player) {
    //     if(player.currDie1 === player.currDie2) {
    //         this.announce(`${player.name} has rolled doubles and gets to roll again!`);
    //         return true
    //     }
    //     return false;
    // }

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
                $('#ann-close').on('click', () => {
                    $('#announcement').hide('slow');
                    this.doublesCheck(player);
                })
                // $('#ann-close').off('click');
            }
        }
    }

    landedOnEvent(player) {
        if(this.getPlayerBoardLocation(player).name === 'Tax') {
            this.taxEvent(player);
        } else {
            this.eventCheck(player);
        }
    }
    
    eventCheck(player) {
        if(this.getPlayerBoardLocation(player).name === 'Freelance') {
            this.drawFreelance();
        } else if(this.getPlayerBoardLocation(player).name === 'Craigslist') {
            this.drawCraigslist();
        }
    }

    drawFreelance() {
        let cardDrawn = this.freelanceCards[Math.floor(Math.random() * this.freelanceCards.length)];
        this.displayEventCard(cardDrawn);
    }

    drawCraigslist() {
        let cardDrawn = this.craigslistCards[Math.floor(Math.random() * this.craigslistCards.length)];
        this.displayEventCard(cardDrawn);
    }

    displayEventCard(cardDrawn) {
        this.processEvent(cardDrawn);
        $('#event-title').text(cardDrawn.name);
        $('#event-text').text(cardDrawn.text);
        $('#event-modal').show('slow');
        $('#event-close').on('click', () => {
            $('#event-modal').hide('slow');
            this.doublesCheck(this.whosTurn());
        })
        $('#event-close').off('click');
    }

    processEvent(cardDrawn) {
        let currPlayer = this.whosTurn();
        if(cardDrawn.statAffected === 'bank') {
            if(cardDrawn.effect === 'positive') {
                currPlayer.bank += cardDrawn.valOfEffect;
            } else {
                currPlayer.bank -= cardDrawn.valOfEffect;
            }
        } else {
            currPlayer.position = cardDrawn.valOfEffect;
        }
        this.updatePlayers();
    }


    buyProp(player, property) {
        console.log('buy prop')
        //check to see if any other family members are owned
        if(this.propCheck(player) === true) {
            for(let i = 0; i < player.properties.length; i++) {
                if(player.properties[i].id === property.familyNum) {
                    console.log(`${player.name} already owns part of this family group`);
                    player.properties[i].owned.push(property);
                    console.log(`------${player.properties.owned[player.properties.owned.length - 1].name} has been added to ${player.name}'s properties`);
                } 
            }
        } else {
            let newPropObj = {id: property.familyNum, size: property.familySize, owned:[property]}
            player.properties.push(newPropObj);
            console.log(`player.properties[0].id = ${player.properties[0].id}`);
            console.log(`player.properties[0].owned.length = ${player.properties[0].owned.length}`);
            console.log(`player.properties[0].owned[0].name = ${player.properties[0].owned[0].name}`);
        }
        property.owner = player.name;
        player.bank -= property.cost;
        this.updatePlayers();
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
//JQuery
    currentGame.generateGameTiles('property', 11, 'JQuery', 140, 10, 100, 100, 750, [50, 150, 450, 625], 3, 0, 3, 'green');
//GitHub
    currentGame.generateGameTiles('utility', 12, 'GitHub', 150, 0, 0, 0, 0, 0, 9, 0, 2);
//Ember
    currentGame.generateGameTiles('property', 13, 'Ember', 140, 10, 100, 100, 750, [50, 150, 450, 625], 3, 1, 3, 'green');
//React
    currentGame.generateGameTiles('property', 14, 'React', 160, 12, 100, 100, 900, [60, 180, 500, 700], 3, 2, 3, 'green');

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