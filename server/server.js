var base64 = require('base-64');
const axios= require('axios');
let num,external_id;
let contact_data;
exports = {
  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' }
   
  ],
  onTicketCreateHandler: async function(args) {
    console.log('arg',args);
    let subject= args.data.ticket.subject;
    console.log('sub',subject);
    let ticket_id=args.data.ticket.id;
    console.log('ticket',ticket_id);
    var match = subject.substr(subject.indexOf('-')).match(/(\d+)/);
      if (match) {
             num=match[1];
              }
    console.log('number',num);
    let requester_id=args.data.requester.id;
    console.log('req',requester_id);
    let apiKey=args.iparams.apiKey;
    let domain=args.iparams.domain;
    console.log('apikey',apiKey);
    console.log('domain',domain);
    var headers = {
      "Authorization":"Basic " + base64.encode(apiKey +":x"),
      "Content-Type": "application/json; charset=utf-8"
    }
    var options = { headers: headers};
    url=`https://${domain}/api/v2/contacts`;
    console.log("option",options);
    console.log("url",url);
    try{
      contact_data=await axios.get(url,options);
      let total_data=contact_data.data;
      let arr=total_data.find(a=>a.unique_external_id==num);
      let update_id=arr.id;
      console.log(arr);
      console.log(arr.unique_external_id);
      console.log(update_id);
        let contact_url=`https://${domain}/api/v2/tickets/${ticket_id}`;
        let body={
          "status":2,
          "priority":1,
          "requester_id":update_id
        };
        let update_data=JSON.stringify(body);
        axios.put(contact_url,update_data,options).then(function(data){
          console.log(data);
        }).catch(function(error){
            console.log(error);
        });
      }catch(error){
      console.log(error);
    }
  }
};
  
  
