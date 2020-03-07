const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray =  require('../utils/parseStringAsArray')
const { findConnections } = require('../webSocket')


module.exports = {
    async index(req, res) {
        const dev = await Dev.find()

        return res.json(dev)
    },

    
    async store (req, res){
        const { github_username, techs, latitude, longitude } = req.body
        
        let dev = await Dev.findOne({ github_username })
        if(!dev){
            const apiResponse =  await axios.get(`https://api.github.com/users/${github_username}`)
      
            const { name = login, avatar_url, bio } = apiResponse.data
            
            const techsArray = parseStringAsArray(techs)
          
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })
            //Filtras conexoes que estao ha no maximo 10 km de distancia e que possuam
            // e que o dev tenha pelo menos uma das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            )

            console.log(sendSocketMessageTo)

      }
        return res.json(dev)

    
        },

        async destroy(req, res) {
            const { id } = req.params
            await Dev.findByIdAndRemove(id)

            return res.send('Dev apagado')
        },

        async update(req, res) {
           const dev = await Dev.findByIdAndUpdate(req.params.id, req.body, {new: true})

           return res.json(dev)
        }
} 