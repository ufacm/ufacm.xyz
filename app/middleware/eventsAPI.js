var events  = require('../models/eventStream');


var eventsOutput = function(req,res,next)
{
  events.find({}, function(err, eventStream)
  {
    if(err)
    {
      res.send(500);
    }

    else{
      res.send(eventStream);
    }
  });
}


module.exports = eventsOutput;
