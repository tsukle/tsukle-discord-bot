const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./commands.db');

module.exports = {
    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: createTable should be called as early as possible to make sure future queries have a table to go into. This function simply creates that table.
        DATE: 23/06/17
    */
    createTable: function (){
        db.serialize(() => {
            let statement = db.prepare("CREATE TABLE IF NOT EXISTS commands (command TEXT, response TEXT, role TEXT)");
            statement.run();
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: addCommand adds new commands to the table, it takes in 3 arguments which can all be further used for specificity of command use.
        DATE: 23/06/17
    */
    addCommand: function (command, role, response){
        db.serialize(() => {
            let statement = db.prepare("INSERT into commands values(?,?,?)");
            statement.run(command, response, role);
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: removeCommand removes a full command row using a specified command name.
        DATE: 23/06/17
    */
    removeCommand: function (command){
        db.serialize(() => {
            let statement = db.prepare("DELETE FROM commands WHERE command=?");
            statement.run(command);
            statement.finalize();
        });
    }
}