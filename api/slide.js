module.exports = function(mongoose) {
  var express = require('express');
  var app = express();

  app.use(express.json());

  var Slide = require('./models/slide')(mongoose);

  app.get('/', function(req, res) {
    var criteria = {};
    if(req.query.tags) {
      criteria.tags = {$in: req.query.tags};
    }

    Slide.find(criteria, function(err, slides) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(slides);
      }
    });
  });

  app.get('/:id', function(req, res) {
    Slide.findOne({_id: req.params.id}, function(err, slide) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(slide);
      }
    });
  });

  app.post('/', function(req, res) {
    var slide = new Slide(req.body);
    slide.save(function(err, slide) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(slide);
      }
    });
  });

  app.delete('/:id', function(req, res) {
    Slide.remove({_id: req.params.id}, function(err, slide) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(slide);
      }
    });
  });

  app.put('/:id', function(req, res) {
    delete req.body._id;
    Slide.update({_id: req.params.id}, req.body, function(err, numberAffected, raw) {
      if (err) {
        res.status(500).send(err);
      } else {
        Slide.findOne({_id: req.params.id}, function(err, slide) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.send(slide);
          }
        });
      }
    });
  });

  app.put('/:id/notes/:noteId', function(req, res) {
    Slide.update({_id: req.params.id, 'notes._id': req.params.noteId}, {$set: {'notes.$': req.body}}, function(err, numberAffected, raw) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(req.body);
      }
    });
  });

  app.delete('/:id/notes/:noteId', function(req, res) {
    Slide.findOne({_id: req.params.id}, function(err, slide) {
      if (err) {
        res.status(500).send(err);
      } else {
        slide.notes.id(req.params.noteId).remove();
        slide.save(function (err) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(204);
          }
        });
      }
    });
  });

  return app;
};
