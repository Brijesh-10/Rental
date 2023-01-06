var mysql=require("mysql");
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"rent",
    multipleStatements:true
});
module.exports=con;
