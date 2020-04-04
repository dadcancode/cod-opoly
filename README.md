# cod-opoly

## Concept

Players travel around the board collecting properties and rent until one player remains.  Game is based around classic monopoly with a fun twist for those of us in the programming world.

## Technologies Used:
  -JQuery
  -JavaScript
  -HTML
  -CSS

## Approach

This project was truly an exercise in planning and managing expectations.  I never realized how many little decisions have to be made and analyzed each turn.  Originally my approach was to just dive in and start coding and it took me 2 days to get the html structur ready and then another day and half to set up the players and the board.  I created three classes, a Player class, Game class, and a Gametile class.  I looked for a monopoly api but I didnt find one I wanted to use so I had to manually generate them with their individual stats.  Game is minimum of 4 players and you can control how many of them are computers. I wanted the computers to move autonomously and have a basic strategy.  Each turn computers evaluate their own properties to see if their are any completed families, then prioritize the completed properties and will only buy if it doesnt fall below their cash reserve. Looking back, more pseudo coding was definitely needed and my code is sprawling.

## Challenges

Testing late game scenarios.  I tried forcing certain scenarios but it broke the game quite often so I started just playing games but still havent been able to complete one.  I actually dont think I have ever finished a game of monopoly.

## Check the game out here

https://dadcancode.github.io/cod-opoly/
