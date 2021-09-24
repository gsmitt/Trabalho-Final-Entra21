const { Op } = require("sequelize");
const createHttpError = require("http-errors");
const { User } = require("../db/models");


async function get(req, res, next) {
    const userId = req.params.id

    try {
        const user = await User.findOne({where: { id: userId } });
        res.json(user);
    } catch (err) {
        console.log(err);
    }
}

async function create(req, res, next) {
    try {
        const user = {
            ...req.body
        }
        const { name, email, password, role, username} = user;  
        
        const [ newUser, created ] = await User.findOrCreate({
            where: {[Op.or]: [{ email }, { username }]},
            defaults: {name, password, role, email, username}
        });
    
        if (!created) {
            throw new createHttpError(409, "User already exists");
        }

        res.json(newUser);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

async function deleteUser(req,res,next) {
    const target = req.params.id
    const userId = res.locals.userId;
    const userRole = res.locals.userRole;
    try {
        const user = await User.findOne({where: { id: target } });
        
        if (!user) throw new createHttpError(404, "This user does not exist");

        if (!((userId == user.id) || (userRole == "admin"))) throw new createHttpError(403, "You don't have permission to do this");

        User.destroy({where: { id: target }})
        
        res.json()
    } catch (err) {
        console.log(err);
        next(err);
    }
}

async function update(req,res,next) {
    const target = req.params.id
    const userId = res.locals.userId;
    const userRole = res.locals.userRole;

    try{
        const user = await User.findOne({where: { id: target } });
        
        if (!user) throw new createHttpError(404, "This user does not exist");

        if (!((userId == user.id) || (userRole == "admin"))) throw new createHttpError(403, "You don't have permission to do this");
       
        console.log(req.body)

        Object.assign(user, req.body);

        const updated = await user.save();

        res.json(updated)
    } catch(err) {
        console.log(err);
        next(err);
    }
}


module.exports = {
    get,
    create,
    deleteUser,
    update
};