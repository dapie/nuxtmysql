const router = require('express').Router()
const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "warehouse",
  password: ""
});


router.get('/measunit', function (req, res, next) {
	pool.query("SELECT * FROM measunit", function(err, data) {
  		if(err) return console.log(err);
  		res.json(data);
	});
});

router.get('/products/:measunit', function (req, res, next) {
	pool.query("SELECT * FROM tovar WHERE MeasUnit_ID = " + req.params.measunit, function(err, data) {
	 	if(err) return console.log(err);
	 	res.json(data);
	});
});

router.get('/products/get/:id', function (req, res, next) {
	pool.query("SELECT * FROM tovar WHERE Tovar_ID = " + req.params.id, function(err, data) {
	 	if(err) return console.log(err);
	 	res.json(data[0]);
	});
});

router.post('/products/add', function (req, res, next) {
	let tovarID = req.body.tovarID
	let tovarName = req.body.tovarName
	let isTovar = 1
	let amount = req.body.amount
	let measUnitID = req.body.measUnitID
	let parentID = req.body.parentID
	let str = `${tovarID}, "${tovarName}", ${isTovar}, ${amount}, ${measUnitID}, ${parentID}`
	pool.query("INSERT INTO tovar(Tovar_ID, TovarName, IsTovar, Amount, MeasUnit_ID, Parent_ID)" + 
		" VALUES(" + str + ")", function(err, data) {
	 		res.json({data: data, error: err});
		});
});

router.post('/products/edit', function (req, res, next) {
	let tovarID = req.body.tovarID
	let tovarName = req.body.tovarName
	let amount = req.body.amount
	let measUnitID = req.body.measUnitID
	let parentID = req.body.parentID
	let str = `TovarName = '${tovarName}', Amount = ${amount}, MeasUnit_ID = ${measUnitID}, Parent_ID = ${parentID}`
	pool.query("UPDATE tovar SET " + str +
		" WHERE Tovar_ID = " + tovarID, function(err, data) {
	 		res.json({data: data, error: err});
		});
});

router.post('/products/delete', function (req, res, next) {
	pool.query("DELETE FROM tovar WHERE Tovar_ID = " + req.body.id, function(err, data) {
 		res.json({data: data, error: err});
	});
});

router.get('/parents', function (req, res, next) {
	pool.query("SELECT * FROM tovar WHERE IsTovar = 0", function(err, data) {
	 	if(err) return console.log(err);
	 	res.json(data);
	});
});
module.exports.router = router;