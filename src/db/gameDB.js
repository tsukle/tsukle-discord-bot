const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/bot.db');

module.exports = {
    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: createTable should be called as early as possible to make sure future queries have a table to go into. This function simply creates that table.
        DATE: 26/06/17
    */
    createTable: function (){
        db.serialize(() => {
            let statement = db.prepare("CREATE TABLE IF NOT EXISTS games (gameTitle TEXT, gameRole)");
            statement.run();
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: addGame adds a new game to the table.
        DATE: 26/06/17
    */
    addGame: function (gameTitle, gameRole){
        db.serialize(() => {
            let statement = db.prepare("INSERT into games values(?,?)");
            statement.run(gameTitle, gameRole);
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: removeGame removes a game from the table.
        DATE: 26/06/17
    */
    removeGame: function (gameTitle){
        db.serialize(() => {
            let statement = db.prepare("DELETE FROM games WHERE gameTitle=?");
            statement.run(roleName);
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: updateGame allows you to update the information in the table based on a gameTitle key.
        DATE: 26/06/17
    */
    updateGame: function (gameTitle, newGameTitle, newGameRole){
        db.serialize(() => {
            let statement = db.prepare("UPDATE games SET gameTitle = ?, gameRole = ? WHERE gameTitle = ?");
            statement.run(newGameTitle, newGameRole, gameTitle);
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: findGame checks the database for a supplied game, if its there it returns the response. If not it will return a failure message.
        DATE: 26/06/17
    */
    findGame: function (gameTitle, callback){
        db.serialize(() => {
            let statement = db.prepare("SELECT * FROM games WHERE gameTitle = ?");
            statement.get(gameTitle, (err, row) => {
                if (err){
                    console.log(err);
                    callback(null);
                }
                else if(row === undefined){
                    callback(null);
                }
                else{
                    callback(row);
                }
            });
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: currentGames callbacks a list of all of the games currently in the database.
        DATE: 26/06/17
    */
    currentGames: function (callback){
        db.serialize(() => {
            let statement = db.prepare("SELECT * FROM games ORDER BY gameTitle ASC");
            statement.all((err, rows) => {
                if(err){
                    console.log(err);
                    callback(null);
                }
                else if(rows === undefined){
                    callback(null);
                }
                else{
                    let gameArray = rows.map((rows) => {
                        return `${rows.gameTitle} - ${rows.gameRole}`;
                    })
                    callback(gameArray);
                }
            });
            statement.finalize();
        });
    },
}