let mongo = require('mongodb');
const {ObjectId} = require('mongodb');
require('dotenv').config();



exports.start_workout = function(req, res) {
	mongo.MongoClient.connect (process.env.DB_URL, function(err, db) {
		if (err) throw err;
		let dbase = db.db("workout_db");
        let date = new Date();
        let exerciseList = req.body.exerciseList
        for (let i in exerciseList) {
            exerciseList[i] = {
                exercise_type : ObjectId(exerciseList[i]),
                set : []
            }
        }
		dbase.collection("workout_history").insertOne({
            workoutId: ObjectId(req.body.workoutId),
            userId : ObjectId(req.user.userId),
            startTime : date.valueOf(),
            exerciseList : exerciseList
        }, function(err, result) {
			if (err) {
                console.log(err)
                throw err;
            }
            res.send(result.insertedId)
			db.close();
		});
	});
	res.setHeader('Access-Control-Allow-Origin', '*')
}

exports.send_rep = function(req, res) {
	mongo.MongoClient.connect (process.env.DB_URL, function(err, db) {
		if (err) throw err;
		let dbase = db.db("workout_db");
        let query = {
            _id : ObjectId(req.body.historyId)
        }
        let newValues = {
            $push : { 
                "exerciseList.$[el].set" : {
                    repetitions : req.body.repetitions,
                    weight : req.body.weight
                }
            }
        }
        let options = { 
            arrayFilters : [
                { 
                    "el.exercise_type" : ObjectId(req.body.exerciseId)
                }, 
            ]
        }     
        console.log(req.body)
		dbase.collection("workout_history").updateOne(
            query,
            newValues,
            options
            , function(err, result) {
			if (err) {
                console.log(err)
                throw err;
                
            }
            res.send(result.insertedId)
			db.close();
		});
	});
	res.setHeader('Access-Control-Allow-Origin', '*')
}

