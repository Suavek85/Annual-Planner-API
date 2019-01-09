

const handleProfile = (req, res, db) => {

const {id} = req.body; 
    

 db('users').where('id', '=', id)
.update( {

entries: req.body.entries

})

.returning('entries')
.then(entries => {

res.json(entries);

})


.catch(err => res.status(400).json('unable to get entries'))


}


module.exports = {

    handleProfile: handleProfile
    
}