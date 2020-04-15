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
        this.isActive = true;
        this.turnsInJail = 0;
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
                backgroundColor: 'linear-gradient( 171.8deg,  rgba(5,111,146,1) 13.5%, rgba(6,57,84,1) 78.6% )',
                color: 'rgba(251,212,0,1)',
                baseColor: 'darkblue'
            },
            {
                symbol: ';',
                isSelected: false,
                backgroundColor: 'radial-gradient( circle farthest-corner at 81.9% 53.5%,  rgba(173,53,53,1) 16.3%, rgba(240,60,60,1) 100.2% )',
                color: 'green',
                baseColor: 'red'
            },
            {
                symbol: "#",
                isSelected: false,
                backgroundColor: 'linear-gradient( 109.6deg,  rgba(255,194,48,1) 11.2%, rgba(255,124,0,1) 100.2% )',
                color: 'purple',
                baseColor: 'orange'
            },
            {
                symbol: "$",
                isSelected: false,
                backgroundColor: 'radial-gradient( circle farthest-corner at 10% 20%,  rgba(114,187,95,1) 0%, rgba(35,149,112,1) 99.1% )',
                color: 'orange',
                baseColor: 'green'
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
        this.freeParking = 0;
        this.round = 0;
    }
//Game Setup
    startGame() {
        console.log('startgame');
        this.resetBoard();
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

    resetBoard() {
        console.log('reset')
        // reset symbols
        for(let i = 0; i < this.syms.length; i++) {
            this.syms[i].isSelected = false;
        }

        this.players = [];

        this.gameTiles = [];

        this.freeParking = 0;

        this.numOfHumans = 0;

        $('.token-cont').empty();
        $('#fp-token-cont').empty();
        $('#go-token-cont').empty();

        //creating game tiles
//go tile
        this.generateGameTiles('corner', 0, 'go');
    //Lisp
        this.generateGameTiles('property', 1, 'Lisp', 60, 2, 50, 50, 250, [10, 30, 90, 160], 1, 0, 2, 'gold', 'url(images/lisp.png)');
    //Freelancer 1
        this.generateGameTiles('event', 2, 'Freelancer');
    //Perl
        this.generateGameTiles('property', 3, 'Perl', 60, 4, 50, 50, 450, [20, 60, 90, 180], 1, 1, 2, 'gold', 'url(images/perl.png)');
    //Tax
        this.generateGameTiles('event', 4, 'Tax', 200);
    //MDN
        this.generateGameTiles('property', 5, 'MDN', 200, 25, 0, 0, 0, [25, 50, 100, 200], 0, 0, 4, 'none', 'none');
    //HTML
        this.generateGameTiles('property', 6, 'HTML', 100, 6, 50, 50, 550, [30, 90, 270, 400], 2, 0, 3, 'blue', 'url(images/html.png)');
    //Craigslist 1
        this.generateGameTiles('event', 7, 'Craigslist');
    //CSS
        this.generateGameTiles('property', 8, 'CSS', 100, 6, 50, 50, 550, [30, 90, 270, 400], 2, 1, 3, 'blue', 'url(images/css.png)');
    //JavaScript
        this.generateGameTiles('property', 9, 'JavaScript', 120, 8, 50, 50, 600, [40, 100, 300, 450], 2, 2, 3, 'blue', 'url(images/javascript.png)')
    //Jail
        this.generateGameTiles('corner', 10, 'Jail')
    //JQuery
        this.generateGameTiles('property', 11, 'JQuery', 140, 10, 100, 100, 750, [50, 150, 450, 625], 3, 0, 3, 'green', 'url(images/jquery.png)');
    //GitHub
        this.generateGameTiles('utility', 12, 'GitHub', 150, 0, 0, 0, 0, 0, 9, 0, 2);
    //Node.js
        this.generateGameTiles('property', 13, 'Node.js', 140, 10, 100, 100, 750, [50, 150, 450, 625], 3, 1, 3, 'green', 'url(images/nodejs.png)');
    //React
        this.generateGameTiles('property', 14, 'React', 160, 12, 100, 100, 900, [60, 180, 500, 700], 3, 2, 3, 'green', 'url(images/react.png)');
    //Stackoverflow
        this.generateGameTiles('property', 15, 'stackoverflow', 200, 25, 0, 0, 0, [25, 50, 100, 200], 0, 1, 4, 'none', 'url(images/stackoverflow.png)');
    //Bootstrap
        this.generateGameTiles('property', 16, 'Bootstrap', 180, 14, 100, 100, 950, [70, 200, 550, 750], 4, 0, 3, 'yellow', 'url(images/bootstrap.png)');
    //Freelancer 2
        this.generateGameTiles('event', 17, 'Freelancer');
    //Angular
        this.generateGameTiles('property', 18, 'Angular', 180, 14, 100, 100, 950, [70, 200, 550, 750], 4, 1, 3, 'yellow', 'url(images/angular.png)');
    //Vue.js
        this.generateGameTiles('property', 19, 'Vue.js', 200, 16, 100, 100, 1000, [80, 220, 600, 800], 4, 2, 3, 'yellow', 'url(images/vuejs.png)');
    //Free Parking
        this.generateGameTiles('corner', 20, 'parking');
    //Rails
        this.generateGameTiles('property', 21, 'Ruby', 220, 18, 150, 150, 1050, [90, 250, 700, 875], 5, 0, 3, 'red', 'url(images/rails.png)');
    //Craigslist 2
        this.generateGameTiles('event', 22, 'Craigslist');
    //Django
        this.generateGameTiles('property', 23, 'Django', 220, 18, 150, 150, 1050, [90, 250, 700, 875], 5, 1, 3, 'red', 'url(images/django.png)');
    //Express
        this.generateGameTiles('property', 24, 'Express', 240, 20, 150, 150, 1100, [100, 300, 750, 925], 5, 2, 3, 'red');
    //W3 Schools
        this.generateGameTiles('property', 25, 'W3 Schools', 200, 25, 0, 0, 0, [25, 50, 100, 200], 0, 2, 4, 'none');
    //Oracle
        this.generateGameTiles('property', 26, 'Oracle', 260, 22, 150, 150, 1150, [110, 330, 800, 975], 6, 0, 3, 'purple');
    //MySQL
        this.generateGameTiles('property', 27, 'MySQL', 260, 22, 150, 150, 1150, [110, 330, 800, 975], 6, 1, 3, 'purple');
    //BitBucket
        this.generateGameTiles('utility', 28, 'BitBucket', 150, 0, 0, 0, 0, 0, 9, 1, 2);
    //MS Access
        this.generateGameTiles('property', 29, 'MS Access', 280, 24, 150, 150, 1200, [120, 360, 850, 1025], 6, 2, 3, 'purple');
    //Jail
        this.generateGameTiles('corner', 30, 'goToJail');
    //C
        this.generateGameTiles('property', 31, 'C', 300, 26, 200, 200, 1275, [130, 390, 900, 1100], 7, 0, 3, 'gray');
    //C++
        this.generateGameTiles('property', 32, 'C++', 300, 26, 200, 200, 1275, [130, 390, 900, 1100], 7, 1, 3, 'gray');
    //Freelancer 3
        this.generateGameTiles('event', 33, 'Freelancer');
    //C#
        this.generateGameTiles('property', 34, 'C#', 320, 28, 200, 200, 1400, [150, 450, 1000, 1200], 7, 2, 3, 'gray');
    //Google Search
        this.generateGameTiles('property', 35, 'Google Search', 200, 25, 0, 0, 0, [25, 50, 100, 200], 0, 2, 4, 'none');
    //Craigslist 3
        this.generateGameTiles('event', 36, 'Craigslist');
    //Ruby
        this.generateGameTiles('property', 37, 'Ruby', 350, 35, 200, 200, 1500, [175, 500, 1100, 1300], 8, 0, 2, 'teal');
    //Tax 2
        this.generateGameTiles('event', 38, 'Tax', 100);
    //Python
        this.generateGameTiles('property', 39, 'Python', 400, 50, 200, 200, 2000, [200, 600, 1400, 1700], 8, 1, 2, 'teal');

        this.updateBoard();
    }

    updateBoard() {
        for(let i = 0; i < this.gameTiles.length; i++) {
            // console.log(`updating tile ${i}`)
            // console.log(this.gameTiles[i].name)
            $(`#tile${i + 1} .property-name`).text(this.gameTiles[i].name);
            $(`#tile${i + 1} .property-cost`).text(`$${this.gameTiles[i].cost}`);
            $(`#tile${i + 1} .color-bar`).css('background-color', this.gameTiles[i].familyColor);
            $(`#tile${i + 1} .prop-sym`).css('background-image', this.gameTiles[i].propImage);
        }
        $('#fp-amount').text(this.freeParking);
    }

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
                'background-image' : this.players[i].sym.backgroundColor,
                'color' : this.players[i].sym.color
            });
            $('.player-id-name span').eq(i).text(this.players[i].name);
            $('.player-money span').eq(i).text(`$${this.players[i].bank}`);
        }
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
                    } else if(this.numOfHumans > this.players.length) {
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

    resetPlayerSelect() {
        console.log('this.resetPlayerSelect')
        $('#player-select-name').val('');
        $('#player-select-number').text(`Player ${this.players.length + 1}`);
        this.generateSymbols();
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

    getHighestRoller(arr) {
        let highestRoller = arr[0];
        for(let i = 1; i < arr.length; i++) {
            if(arr[i].currRoll > highestRoller.currRoll) {
                highestRoller = arr[i];
            }
        }
        return highestRoller;
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
    nextRound() {
        this.round += 1;
        console.log(`******************************nextround #${this.round}`);
        console.log(`----whosturn = ${this.whosTurn().name}`);
        this.winCheck(this.whosTurn());
        if(this.whosTurn().isHuman === false) {
            this.compTurn(this.whosTurn());
        } else {
            this.humanTurn(this.whosTurn());
        }
    }

    doublesCheck(player) {
        console.log(`doublesCheck`)
        
        if(player.bank <= 0) {
            console.log(`players bank evaluated as 0 ${player.name}`)
            this.removePlayer(player);
            this.updatePlayers();
            this.winCheck(player);
        } else if(player.currDie1 === player.currDie2) {
            this.announce(`${player.name} rolled doubles. Roll again!`);
            if(player.isHuman === false) {
                $('#ann-close').on('click', () => {
                    $('#announcement').hide('slow');
                    this.moveComp(player);                   
                });
            } else {
                $('#ann-close').on('click', () => {
                    $('#announcement').hide('slow');
                    this.setUpControlPanel(player);
                });
            }
        }
        this.rotatePlay(player);
    }

    endTurn(player) {
        player.isTurn = false;
        $(`.${player.playerNum}`).css(`background-image`, 'none');
    }

    setTurn(player) {
        player.isTurn = true;
        //change background of curr player div
        $(`.${player.playerNum}`).css('background-image', player.sym.backgroundColor);
    }

    whosTurn() {
        for(let i = 0; i < this.players.length; i++) {
            if(this.players[i].isTurn === true) {
                return this.players[i];
            }
        }
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

    /////////////////////////
    //Computer Turn Logic
    ///////////////////////

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

    compTurn(player) {
        console.log(`compturn ${player.name}`);
        if(player.inJail === true) {
            if(player.turnsInJail < 4) {
                this.announce(`${player.name} is in Jail. Pay $50 or roll doubles to get out`);
                $('#ann-close').on('click', () => {
                    $('#announcement').hide('slow');
                    let roll1 = this.rollDice(1);
                    let roll2 = this.rollDice(1);
                    if(roll1 === roll2) {
                        player.turnsInJail = 0;
                        player.position = 10;
                        this.updatePlayers();
                        this.moveComp(player);
                    }
                });
            } else {
                this.announce(`${player.name} has exceeded roll attempts. Pay $50`);
                $('#ann-close').on('click', () => {
                    $('#announcement').hide('slow');
                    if(player.bank >= 51) {
                        player.bank -= 50;
                        player.turnsInJail = 0;
                        player.position = 10;
                        this.updatePlayers();
                        this.moveComp(player);
                    }
                })
            }
        }
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

    //////////////////////////
    //Human Turn Logic
    //////////////////////

    humanTurn(player) {
        this.setUpControlPanel(player);
    }

    moveHuman(player) {
        this.rollTurn(player);
        this.announce(`You rolled ${player.currRoll}`);
        $('#ann-close').on('click', () => {
            $('#announcement').hide('slow');
            this.moveToken(player);
            this.positionEval(player);
        })
    }
    
    //////////////////////////////////////////////////////////////

    setUpControlPanel(player) {
        $('.control-item').off('click');
        $('.control-roll').on('click', () => {
            this.moveHuman(player);
        });
        $('.control-properties').on('click', () => {
            this.getOwnProperties(player);
            $('#player-properties').show('slow');
            $('#play-prop-close').on('click', () => {
                $('#player-properties').hide('slow');
            })
        })
        $('.control-menu').on('click', () => {
            $('#menu-modal').show('slow');
            $('#resume').on('click', () => {
                $('#menu-modal').hide('slow');
            });
            $('#restart').on('click', () => {
                $('#menu-modal').hide();
                this.startGame();
            });
            $('#about').on('click', () => {
                $('#about-modal').show('slow');
                $('#about-close').on('click', () => {
                    $('#about-modal').hide('slow');
                })

            })
        })
    }

    matchProp(propName) {
        for(let i = 0; i < this.whosTurn().properties.length; i++) {
            for(let j = 0; j < this.whosTurn().properties[i].owned.length; j++) {
                if(this.whosTurn().properties[i].owned[j].name === propName) {
                    this.displayYourProp(this.whosTurn().properties[i].owned[j]);
                }
            }
        }
    }

    getOwnProperties(player) {
        $('#player-prop-cont').empty();
        console.log(`player has ${player.properties.length} prop families`);
        for(let i = 0; i < player.properties.length; i++) {
            let $famDiv = $('<div>').addClass('player-prop-item');
            console.log(`Outer loop: ${i}`);
            console.log(`-----evaluating ${player.properties[i].id}`);
            for(let j = 0; j < player.properties[i].owned.length; j++) {
                console.log(`Inner loop: ${i}:${j}`);
                console.log(`------evaluating ${player.properties[i].owned[j].name}`);
                let $propDiv = $('<div>').addClass('owned-props').text(player.properties[i].owned[j].name).css('background-color', player.properties[i].owned[j].familyColor).on('click', (event) => {
                    this.matchProp($(event.currentTarget).text());
                });
                $($famDiv).append($propDiv);
            }
            $('#player-prop-cont').append($famDiv);
        }
    }

    

    displayYourProp(property) {
        $('#prop-box-name').empty().text(property.name);
        $('#basic-rent').empty().text(property.rent);
        $('#1func span').empty().text(`$${property.rentWFunc[0]}`);
        $('#2func span').empty().text(`$${property.rentWFunc[1]}`);
        $('#3func span').empty().text(`$${property.rentWFunc[2]}`);
        $('#4func span').empty().text(`$${property.rentWFunc[3]}`);
        $('#app-rent span').empty().text(`$${property.rentWApp}`);
        $('#improve-cost span').empty().text(`$${property.funcCost}`);
        $('#buy-prop').off('click').text('Improve');
        $('#pass-prop').off('click').text('Close');
        $('#prop-modal').show('slow');
        
        if(this.bankCheck(property.funcCost) === true) {
            $('#buy-prop').on('click', () => {
                if((this.allFuncBuiltCheck(property) === true) && (property.numOfApp === 0)) {
                    this.whosTurn().bank -= property.funcCost;
                    this.updatePlayers();
                    property.numOfApp++;
                    this.announce(`You built an application for ${property.name} rent`);
                    $('#ann-close').on('click', () => {
                        $('#announcement').hide('slow');
                    });
                } else if(this.allFuncBuiltCheck(property).numOfFunc < 4) {
                    this.whosTurn().bank -= property.funcCost;
                    this.updatePlayers();
                    property.numOfFunc++;
                    this.announce(`You wrote a function for ${property.name} for $${property.funcCost}`);
                    $('#ann-close').on('click', () => {
                        $('#announcement').hide('slow');
                    });
                } else {
                    this.announce(`${property.name} has been fully developed!`);
                    $('#ann-close').on('click', () => {
                        $('#announcement').hide('slow');
                    });
                }
            });
        } else {
            $('#buy-prop').on('click', () => {
                this.announce(`Not enough money to improve this property`);
                $('#ann-close').on('click', () => {
                    $('#announcement').hide('slow');
                })
            })
        };

        $('#pass-prop').on('click', () => {
            $('#prop-modal').hide('slow');
        })
    }

    
///////////////////////////////////////////////////////////////////////////////
//Movement
/////////////////////////////
    
    

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

    allFuncBuiltCheck(property) {
        for(let i = 0; i < this.whosTurn().properties.length; i++) {
            if(this.whosTurn().properties[i].id === property.familyNum) {
                for(let j = 0; j < this.whosTurn().properties[i].owned.length; j++) {
                    if(this.whosTurn().properties[i].owned[j].numOfFunc < 4) {
                        return false
                    }
                } 
                return true;
            }
        }
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
                'background-image' : this.players[i].sym.backgroundColor,
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
        if(player.position > 39) {
            player.position -= 39;
            player.bank += 200;
            this.updatePlayers();
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
        } else if(this.getPlayerBoardLocation(player).type === 'utility') {
            this.landedOnProp(player);
        } else {
            this.landedOnCorner(player);
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
    winCheck(player) {
        console.log('wincheck')
        if(this.players.length === 1) {
            this.endGame(player);
        }
    }

    endGame(player) {
        this.announce(`${player.name} has won!`);
        $('#ann-close').on('click', () => {
            this.resetBoard();
            this.startGame();
        })
    }

    landedOnProp(player) {
        console.log(`${player.name} landed ${this.getPlayerBoardLocation(player).name}`);
        if(player.isHuman === false) {
            //if prop is for sale
            if((this.getPlayerBoardLocation(player).owner === 5) && (this.bankCheck(this.getPlayerBoardLocation(player).cost) === true)) {
                console.log(`----${this.getPlayerBoardLocation(player).name} is for sale`)
                this.buyProp(player, this.getPlayerBoardLocation(player));
                this.announce(`${player.name} has purchased ${this.getPlayerBoardLocation(player).name} for $${this.getPlayerBoardLocation(player).cost}`);
                $('#ann-close').on('click', () => {
                    $('#announcement').hide('slow');
                    this.doublesCheck(player);
                });
                //if you own it
            } else if(this.getPlayerBoardLocation(player).owner === player.playerNum) {
                this.doublesCheck(player);
                //if someone else does
            } else {
                if(this.players[this.getPlayerBoardLocation(player).owner - 1].inJail === false) {
                    this.chargeRent(player);
                } else {
                    this.doublesCheck(player);
                }
            }
        } else {
            if(this.getPlayerBoardLocation(player).owner === 5) {
                this.displayPropModal(this.getPlayerBoardLocation(player));
            } else if(this.getPlayerBoardLocation(player).owner === player.playerNum) {
                this.doublesCheck(player);
            } else {
                this.chargeRent(player);
            }
        }
    }

    displayPropModal(property) {
        $('#prop-box-name').empty().text(property.name);
        $('#basic-rent').empty().text(`RENT  $${property.rent}`);
        $('#1func span').empty().text(`$${property.rentWFunc[0]}`);
        $('#2func span').empty().text(`$${property.rentWFunc[1]}`);
        $('#3func span').empty().text(`$${property.rentWFunc[2]}`);
        $('#4func span').empty().text(`$${property.rentWFunc[3]}`);
        $('#app-rent span').empty().text(`$${property.rentWApp}`);
        $('#improve-cost span').empty().text(`$${property.funcCost}`);
        $('#buy-prop').text(`Buy $${property.cost}`);
        $('#prop-modal').show('slow');
        $('#buy-prop').off('click')
        $('#buy-prop').on('click', () => {
            if(this.bankCheck(property.cost) === true) {
                $('#prop-modal').hide('slow');
                this.buyProp(this.whosTurn(), property);
                this.doublesCheck(this.whosTurn());
            } else {
                this.announce(`You cannot afford this property!`)
                $('#ann-close').on('click', () => {
                    $('#announcement').hide('slow');
                    $('#prop-modal').hide('slow');
                    this.doublesCheck(this.whosTurn());
                })
            }
        });
    }

    getPlayerIndex(player) {
        let playerIndex = this.players.indexOf(player);
        return playerIndex;
    }

    removePlayer(player) {
        this.players.splice(this.getPlayerIndex(player), 1);
    }

    chargeRent(player) {
        player.bank -= this.calculateRent(this.getPlayerBoardLocation(player));
        this.players[this.getPlayerBoardLocation(player).owner - 1].bank += this.calculateRent(this.getPlayerBoardLocation(player));
        if(player.bank <= 0) {
            console.log(`${player.name}'s bank evaluated as 0`)
            this.removePlayer(player);
            this.updatePlayers();
            this.winCheck(player);
        } else {
            this.updatePlayers();
            let currProp = this.getPlayerBoardLocation(player);
            console.log(currProp);
            let currOwner = this.players[currProp.owner - 1].name;
            this.announce(`${currProp.name} is owned by ${currOwner}. ${player.name} charged $${this.calculateRent(this.getPlayerBoardLocation(player))}`);
            $('#ann-close').on('click', () => {
                $('#announcement').hide('slow');
                this.doublesCheck(player);
            });
        }
    }

    calculateRent(property) {
        console.log(`calculate rent ran, curr players curr roll = ${this.whosTurn().currRoll}`)
        if(property.type === 'property') {
            if((property.numOfFunc === 0) && (property.numOfApp === 0)) {
                for(let i = 0; i < this.players[property.owner - 1].properties.length; i++) {
                    if(this.players[property.owner - 1].properties[i].id === property.familyNum) {
                        if(this.players[property.owner - 1].properties[i].owned.length === property.familySize) {
                            return property.rent * 2;
                        }
                    }
                    return property.rent;
                }
            } else if((property.numOfFunc > 0) && (property.numOfApp === 0)) {
                return property.rentWFunc[property.numOfFunc - 1];
            } else if(property.numOfApp === 1) {
                return property.rentWApp;
            }
        } else if(property.familyNum === 0) {
            let count = 0;
            for(let i = 0; i < this.players[property.owner - 1].properties.length; i++) {
                if(this.players[property.owner - 1].properties[i].id === 0) {
                    count = this.players[property.owner - 1].properties[i].owner.length;
                    return property.rentWFunc[count - 1];
                }
            }
        } else if(property.familyNum === 9) {
            for(let i = 0; i < this.players[property.owner - 1].properties.length; i++) {
                if(this.players[property.owner - 1].properties[i].id === 9) {
                    if(this.players[property.owner - 1].properties[i].owned.length = 1) {
                        return this.whosTurn().currRoll * 4;
                    } else {
                        return this.whosTurn().currRoll * 7;
                    }
                }
            }
        }
    }

    landedOnCorner(player) {
        if(this.getPlayerBoardLocation(player).name === 'parking') {
            player.bank += this.freeParking;
            this.updatePlayers();
            this.freeParking = 0;
            this.updateBoard();
            this.doublesCheck(player);
        } else if(this.getPlayerBoardLocation(player).name === 'goToJail'){
            player.inJail = true;
            $('#jail-img').append($(`#token${player.playerNum - 1}`));
            this.rotatePlay(player);
        } else if(this.getPlayerBoardLocation(player).name === 'go') {
            player.bank += 200;
            this.updatePlayers();
            this.doublesCheck(player);
        } else {
            this.doublesCheck(player);
        }
    }

    landedOnEvent(player) {
        console.log(`${player.name} landed on ${this.getPlayerBoardLocation(player).name}`);
        if(this.getPlayerBoardLocation(player).name === 'Tax') {
            this.taxEvent(player);
        } else {
            this.eventCheck(player);
        }
    }


    taxEvent(player) {
        player.bank -= this.getPlayerBoardLocation(player).cost;
        this.updatePlayers();
        this.freeParking +=  this.getPlayerBoardLocation(player).cost;
        this.updateBoard();
        if(player.isHuman === false) {
            this.announce(`TAX! ${player.name} must pay $${this.getPlayerBoardLocation(player).cost}`);
        } else {
            this.announce(`TAX! You must pay $${this.getPlayerBoardLocation(player).cost}`);
        }
        $('#ann-close').on('click', () => {
            $('#announcement').hide('slow');
            this.doublesCheck(player);
        });
    }
    
    eventCheck(player) {
        console.log('eventCheck')
        console.log(`----${player.name} landed on ${this.getPlayerBoardLocation(player).name}`);
        if(this.getPlayerBoardLocation(player).name === 'Freelancer') {
            this.drawFreelance();
        } else if(this.getPlayerBoardLocation(player).name === 'Craigslist') {
            this.drawCraigslist();
        }
    }

    drawFreelance() {
        console.log('drawfreelance')
        let cardDrawn = this.freelanceCards[Math.floor(Math.random() * this.freelanceCards.length)];
        this.displayEventCard(cardDrawn);
    }

    drawCraigslist() {
        console.log('drawcraiglist')
        let cardDrawn = this.craigslistCards[Math.floor(Math.random() * this.craigslistCards.length)];
        this.displayEventCard(cardDrawn);
    }

    displayEventCard(cardDrawn) {
        console.log('displayeventcard')
        this.processEvent(cardDrawn);
        $('#event-title').text(cardDrawn.name);
        $('#event-text').text(cardDrawn.text);
        $('#event-modal').show('slow');
        $('#event-close').on('click', () => {
            $('#event-modal').hide('slow');
            this.doublesCheck(this.whosTurn());
        })
    }

    processEvent(cardDrawn) {
        console.log('processevent')
        let currPlayer = this.whosTurn();
        if(cardDrawn.statAffected === 'bank') {
            if(cardDrawn.effect === 'positive') {
                currPlayer.bank += cardDrawn.valOfEffect;
                this.updatePlayers();
            } else {
                currPlayer.bank -= cardDrawn.valOfEffect;
                this.freeParking += cardDrawn.valOfEffect;
                this.updatePlayers();
            }
        } else {
            currPlayer.position = cardDrawn.valOfEffect;
            this.updateBoardPos(currPlayer);
        }
        this.updatePlayers();
    }


    buyProp(player, property) {
        console.log('buy prop')
        //check to see if any other family members are owned
        if(this.propCheck(player) === true) {
            console.log('propcheck was true')
            for(let i = 0; i < player.properties.length; i++) {
                if(player.properties[i].id === property.familyNum) {
                    player.properties[i].owned.push(property);
                } else {
                    let newPropObj = {id: property.familyNum, size: property.familySize, owned:[property]}
                // console.log(newPropObj.owned[0].name)
                player.properties.push(newPropObj);
                // console.log(`player.properties[0].id = ${player.properties[0].id}`);
                // console.log(`player.properties[0].owned.length = ${player.properties[0].owned.length}`);
                // console.log(`player.properties[0].owned[0].name = ${player.properties[0].owned[0].name}`);
                }
            }
        } else {
            let newPropObj = {id: property.familyNum, size: property.familySize, owned:[property]}
            console.log(newPropObj.owned[0].name)
            player.properties.push(newPropObj);
            console.log(`player.properties[0].id = ${player.properties[0].id}`);
            console.log(`player.properties[0].owned.length = ${player.properties[0].owned.length}`);
            console.log(`player.properties[0].owned[0].name = ${player.properties[0].owned[0].name}`);
        }
        property.owner = player.playerNum;
        player.bank -= property.cost;
        this.updatePlayers();
        this.addPropOwnerColor(player, property);
        // this.sortProp(player.properties.owned);
    }

    addPropOwnerColor(player, property) {
        if(property.position < 10) {
            $(`#tile${property.position + 1}`).css('border-top', `4px solid ${player.sym.baseColor}`)
        } else if(property.position < 20) {
            $(`#tile${property.position + 1}`).css('border-right', `4px solid ${player.sym.baseColor}`)
        } else if(property.position < 30) {
            $(`#tile${property.position + 1}`).css('border-bottom', `4px solid ${player.sym.baseColor}`)
        } else if(property.position < 40) {
            $(`#tile${property.position + 1}`).css('border-left', `4px solid ${player.sym.baseColor}`)
        }
        this.updateBoard();
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