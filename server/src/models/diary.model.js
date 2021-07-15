const mongoose = require('mongoose');

const diarySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    photo: [{ type: String }],
    photo_key: [{ type: String }],
    parentId: [{ type: String, required: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    state: [{ type: Number }],
  },
  {
    timestamps: true,
  },
);

const Diary = mongoose.model('Diary', diarySchema);

module.exports = Diary;
