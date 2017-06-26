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
            let statement = db.prepare("CREATE TABLE IF NOT EXISTS roles (roleName TEXT, roleID TEXT, roleType TEXT)");
            statement.run();
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: addRole adds a new role to the table.
        DATE: 26/06/17
    */
    addRole: function (roleName, roleID, roleType){
        db.serialize(() => {
            let statement = db.prepare("INSERT into roles values(?,?,?)");
            statement.run(roleName, roleID, roleType);
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: removeRole removes a role from the table.
        DATE: 26/06/17
    */
    removeRole: function (roleName){
        db.serialize(() => {
            let statement = db.prepare("DELETE FROM roles WHERE roleName=?");
            statement.run(roleName);
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: findRole checks the database for a supplied role, if its there it returns the response. If not it will return a failure message.
        DATE: 26/06/17
    */
    findRole: function (roleName, callback){
        db.serialize(() => {
            let statement = db.prepare("SELECT * FROM roles WHERE roleName = ?");
            statement.get(roleName, (err, row) => {
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

    findRoleByType: function (roleType, callback){
        db.serialize(() => {
            let statement = db.prepare("SELECT * FROM roles WHERE roleType = ?");
            statement.get(roleType, (err, row) => {
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

    findRolesByType: function (roleType, callback){
        db.serialize(() => {
            let statement = db.prepare("SELECT roleName, roleID, roleType FROM roles WHERE roleType = ? ORDER BY roleType ASC");
            statement.all(roleType, (err, rows) => {
                if(err){
                    console.log(err);
                    callback(null);
                }
                else if(rows === undefined){
                    callback(null);
                }
                else{
                    let roleArray = rows.map((rows) => {
                        return rows.roleName, rows.roleID;
                    })
                    callback(rows);
                }
            });
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: updateRole allows you to update the information in the table based on a roleName key.
        DATE: 26/06/17
    */
    updateGame: function (roleName, newRoleName, newRoleID, newRoleType){
        db.serialize(() => {
            let statement = db.prepare("UPDATE roles SET roleName = ?, roleID = ?, roleType = ? WHERE roleName = ?");
            statement.run(newRoleName, newRoleID, newRoleType);
            statement.finalize();
        });
    },

    /*
        AUTHOR: Emilis Tobulevicius
        DESCRIPTION: currentRoles callbacks a list of all of the roles currently in the database.
        DATE: 26/06/17
    */
    currentRoles: function (callback){
        db.serialize(() => {
            let statement = db.prepare("SELECT roleName, roleID, roleType FROM roles ORDER BY roleType ASC");
            statement.all((err, rows) => {
                if(err){
                    console.log(err);
                    callback(null);
                }
                else if(rows === undefined){
                    callback(null);
                }
                else{
                    let roleArray = rows.map((rows) => {
                        return `${rows.roleName} - ${rows.roleID} - ${rows.roleType}`;
                    })
                    callback(roleArray);
                }
            });
            statement.finalize();
        });
    },
}