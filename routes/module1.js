var express = require('express');
var router = express.Router();

/* GET all page data. */
router.get('/loadPage', function(req, res, next) {
  var pageObj = {
    'resultCode': 1,
    'message': '',
    'department':{
      'id':10001,
      'name':'dep.1',
      'code':'01',
      'departments':[
        {
          'id':10002,
          'name':'dep.1-1',
          'code':'01.01'
        },
        {
          'id':10003,
          'name':'dep.1-2',
          'code':'01.02'
        }
      ],
      'employees':[
        {
          'id':10001,
          'name':'employee A',
          'depId': 10001
        },
        {
          'id':10002,
          'name':'employee B',
          'depId': 10001
        },{
          'id':10003,
          'name':'employee C',
          'depId': 10002
        },
        {
          'id':10004,
          'name':'employee D',
          'depId': 10002
        },
        {
          'id':10005,
          'name':'employee E',
          'depId': 10002
        },{
          'id':10006,
          'name':'employee F',
          'depId': 10002
        }
      ]

    }

  }
  res.json(pageObj);
});

/* Get download file example*/
router.get('/export', function(req, res, next) {
  var path = require('path');
  var fs = require('fs');
  var file = '/Users/xxx/Documents/projName/xlsx/armor.xlsx';
  var filename = path.basename(file);
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  var fileStream = fs.createReadStream(file);
  fileStream.pipe(res);

});
//
//app.get('/users/:id?', function(req, res, next){
//  var id = req.params.id;
//  if (id) {
//    // do something
//  } else {
//    next();
//  }
//});

// 返回 router 供 app 使用
module.exports = router;
