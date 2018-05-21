module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const commentSchema = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      }
    },
    {
      timestamps: true
    }
  );

  const likeSchema = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    },
    { _id: false }
  );

  // Create Schema
  const PostSchema = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      likes: [likeSchema],
      comments: [commentSchema]
    },
    {
      timestamps: true
    }
  );

  return mongoose.model("Post", PostSchema);
};
