module.exports = function(mongoose) {
  var slideSchema = new mongoose.Schema({
    imageUrl: String,
    title: String,
    tags: [String],
    notes: [
      {
        description: String,
        position: {x: Number, y: Number},
        sources: [{url: String, title: String}]
      }
    ]
  });

  return mongoose.model('Slide', slideSchema);
};
