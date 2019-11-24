/***exports.name = () => { return "dato" }

module.exports = { propiedad: function() {} }****/

var User = require('../models/user');
var debug = require('debug')('blog:user_controller');

// Buscar un solo usuario
module.exports.getOne = (req, res, next) => {
    debug("Search User", req.params);
    User.findOne({
            nombre: req.params.nombre
        }, "-raza -nombre -edad -dueño -vacunado -enfermo")
        .then((foundUser) => {
            if (foundUser)
                return res.status(200).json(foundUser);
            else
                return res.status(400).json(null)
        })
        .catch(err => {
            next(err);
        });
}

//Buscar todo los usuarios
module.exports.getAll = (req, res, next) => {
    var perPage = Number(req.query.size) || 10,
        page = req.query.page > 0 ? req.query.page : 0;

    var sortProperty = req.query.sortby || "createdAt",
        sort = req.query.sort || "desc";

    debug("Usert List",{size:perPage,page, sortby:sortProperty,sort});

    User.find({}, "-raza -nombre -edad -dueño -vacunado -enfermo")
        .limit(perPage)
        .skip(perPage * page)
        .sort({ [sortProperty]: sort})
        .then((users) => {
           return res.status(200).json(users)
        }).catch(err => {
            next(err);
        })

}

//Ingresar un usuario
module.exports.register = (req, res, next) => {
    debug("New User", {
        body: req.body
    });
    User.findOne({
            nombre: req.body.nombre
        }, "-raza -nombre -edad -dueño -vacunado -enfermo ")
        .then((foundUser) => {
            if (foundUser) {
                debug("Usuario duplicado");
                throw new Error(`Usuario duplicado ${req.body.username}`);
            } else {
                let newUser = new User({
                    raza: req.body.raza,
                    nombre: req.body.nombre ,
                    edad: req.body.edad ,
                    dueño: req.body.dueño,
                    vacunado: req.body.vacunado /*TODO: Modificar, hacer hash del password*/
                });
                return newUser.save(); // Retornamos la promesa para poder concater una sola linea de then
            }
        }).then(user => { // Con el usario almacenado retornamos que ha sido creado con exito
            return res
                .header('Location', '/users/' + user._id)
                .status(201)
                .json({
                    nombre: user.nombre
                });
        }).catch(err => {
            next(err);
        });
}

//Actualizar un usuario
module.exports.update = (req, res, next) => {
    debug("Update user", {
        nombre: req.params.nombre,
        ...req.body
    });

    let update = {
        ...req.body
    };

    User.findOneAndUpdate({
            nombre: req.params.nombre
        }, update, {
            new: true
        })
        .then((updated) => {
            if (updated)
                return res.status(200).json(updated);
            else
                return res.status(400).json(null);
        }).catch(err => {
            next(err);
        });
}

//Eliminar un usuario
module.exports.delete = (req, res, next) => {

    debug("Delete user", {
        nombre: req.params.nombre,
    });

    User.findOneAndDelete({nombre: req.params.nombre})
    .then((data) => {
        if (data) res.status(200).json(data);
        else res.status(404).send();
    }).catch( err => {
        next(err);
    })
}