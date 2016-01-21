'use strict';

module.exports = (request, reply) => {

  let User = request.collections.users;
  let newUser = request.payload;

  User.findOne({ email: newUser.email })
      .exec(function(err, user) {
        if (err) console.error(err);

        if (user) {
          return reply(user).code(409);
        }

        var salt = User.generateSalt();

        User.hashPassword(newUser.password, hash => {
          User.create({
            email: newUser.email,
            password: hash,
            salt: salt
          }).exec((err, user) => {
            if (err) console.error(err);
            console.log(user);
            return reply(user.email).code(201);
          });
        });
      });
};
