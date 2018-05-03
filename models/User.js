const bcrypt = require("bcryptjs");

module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  // Create Schema
  const UserSchema = new Schema(
    {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      avatar: {
        type: String
      }
    },
    {
      timestamps: true
    }
  );

  UserSchema.pre("save", function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    console.log(`Hashing password for ${user.name}`);

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      // hash the password along with our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the clear text password with the hashed one
        user.password = hash;
        next();
      });
    });
  });

  // ==============================
  // Methods ======================
  // ==============================

  // generating a hash
  UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  // checking if password is valid
  UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
  };

  return mongoose.model("users", UserSchema);
};
