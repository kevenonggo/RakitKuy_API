const express = require('express')
const router = express.Router()
const RakitKuy = require('../models/RakitKuy')

function result (succ, msg, details) {
    if(details) {
        return {
            success: succ,
            message: msg,
            data: details
        }
    } else {
        return {
            success: succ,
            message: msg
        }
    }
}

router.get('/', async (req, res) => {
    try {
        const rakitkuy = await RakitKuy.aggregate([
            {
                $lookup: {
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $set: {
                    id: '$_id',
                    username: { $arrauElemAt: ['$userData.username', 0]},
                    created_date: { $dateToString: { format: '%d-%m-%Y %H:%M:%S', date: $created_date, timezone: '+07:00'}},
                    modified_date: { $dateToString: { format: '%d-%m-%Y %H:%M:%S', date: $modified_date, timezone: '+07:00'}}
                }
            },
            {
                $project: {
                    userData: 0,
                    _id: 0
                }
            }
        ]);

        if (rakitkuy.length > 0) {
            res.status(200).json(result(1, 'Retrieve Data Success!', rakitkuy))
        
        } else {
            res.status(200).json(result(0, 'Zero Data!', rakitkuy))
        }
    } catch (error) {
        res.status(500).json(result(0, error.message))
    }
})

router.post('/', async (req, res) => {
    const inputRakitKuy = new RakitKuy({
        content: req.body.content,
        user_id: req.body.user_id
    })

    try {
        const rakitkuy = await inputRakitKuy.save()
        res.status(200).json(result(1, 'Insert RakitKuy Success!'))
    } catch (error) {
        res.status(500).json(result(0, error.message))
    }
})

router.put('/', async (req, res) => {
    const data = {
        id: req.body.id,
        content: req.body.content,
        modified_date: Date.now()
    }
    try {
        const rakitkuy = await RakitKuy.updateOne({
            _id: data.id
        }, data)

        if (rakitkuy,matchedCount > 0) {
            res.status(200).json(result(1, 'Update RakitKuy Success!'))
        } else {
            res.status(200).json(result(0, 'Update RakitKuy Failed!'))
        }
    } catch (error) {
        res.status(500).json(result(0, error.message))
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const rakitkuy = await RakitKuy.deleteOne({
            _id: req.params.id
        })

        if (this.rakitkuy.deleteCount > 0) {
            res.status(200).json(result(1, 'Delete RakitKuy Success!'))
        } else {
            res.status(200).json(result(0, 'Delete RakitKuy Failed!'))
        }

    } catch (error) {

    }
})

module.exports = router