const Trello = require("node-trello");
const argv = require('minimist')(process.argv.slice(2));
require('dotenv').config();
const env = process.env;

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

const trello = new Trello(env.TRELLO_API_KEY, env.TRELLO_API_TOK);

const begininngOfWeek= argv._[0];
const endOfWeek= argv._[1];


const boardID = env.BOARD_ID;

const startDate = moment(begininngOfWeek)
, endDate   = moment(endOfWeek)
, weekRange = moment().range(startDate, endDate);

console.log("Issue Tracker Weekly Update:");

// URL arguments are passed in as an object.
trello.get(`/1/boards/${boardID}/cards`, { actions: ['createCard', 'updateCard'] }, function(err, data) {
  if (err) throw err;
  // console.log(data);

  const newlyCreated = [];
  const movedtoDone = [];
  data.forEach(card =>{
    //Card creation
    const createdDate = moment(card.actions[card.actions.length-1].date);
    if(weekRange.contains(createdDate)){
      newlyCreated.push(card);
    };

    //Cards resolved
    if(card.actions.length > 0){
      card.actions.forEach(action =>{
        if(action.data.listAfter && action.data.listAfter.name == 'Resolved'  && action.type == 'updateCard'){
          const resolvedDate = moment(action.date);
          if(weekRange.contains(resolvedDate)){
            movedtoDone.push(card);
          };
        }
      });
    }

  });
  console.log(newlyCreated.length+" Issues created this week");
  console.log(movedtoDone.length+" Issues resolved this week");

});

trello.get(`/1/boards/${boardID}/lists?cards=open&card_fields=name`, function(err, data) {
  if (err) throw err;
  data.forEach(list=>{
    if(list.name == 'Waiting' || list.name == 'Blocked'){
      console.log(list.cards.length + " Issues " + list.name);
    }
  })

});
