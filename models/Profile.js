module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const ExperienceSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    location: {
      type: String
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    }
  });

  const EducationSchema = new Schema({
    school: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    fieldOfStudy: {
      type: String,
      required: true
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    }
  });

  // Create Schema
  const ProfileSchema = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      handle: {
        type: String,
        required: true,
        unique: true,
        max: 40,
        lowercase: true,
        index: true
      },
      company: {
        type: String
      },
      website: {
        type: String
      },
      location: {
        type: String
      },
      status: {
        type: String,
        required: true
      },
      skills: {
        type: [String]
      },
      bio: {
        type: String
      },
      githubUsername: {
        type: String
      },
      experience: [ExperienceSchema],
      education: [EducationSchema],

      social: {
        facebook: String,
        instagram: String,
        linkedIn: String,
        twitter: String,
        youTube: String
      }
    },
    {
      timestamps: true
    }
  );

  return mongoose.model("Profile", ProfileSchema);
};
