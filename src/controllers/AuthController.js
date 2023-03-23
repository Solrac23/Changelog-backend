const prismaClient = require('../database/prismaClient')
const { decrypt } = require('./util/cryptography')
const jwt = require('jsonwebtoken')

module.exports = {
	async authenticate(req, res){
		const {
			email,
			password
		} = req.body

		const user = await prismaClient.user.findFirst({
			where:{
				email,
			}
		})

		if(!user){
			return res.sendStatus(401)
		}
		
		const isValidPassword = decrypt(password, user.password)

		if(!isValidPassword){
			return res.sendStatus(401)
		}

		const token = jwt.sign({id: user.id}, process.env.TOKEN_SECRET, { expiresIn: '1d'})
		delete user.password
		
		return res.json({
			user,
			token
		})
	}
	
}