const router = global.express.Router();
const members = global.mocks.members;
const jwtAuth = require('../middlewares/jwtAuth.js');

router.post('/login/', function (request, response) {
  const sql = `
      select * from members
      where
        name = ?
        and age = ?;
    `;
  db.query(sql, [request.body.name, request.body.age], function (error, rows) {
    if (!error || db.error(request, response, error)) {
      if (rows.length) {
        rows;
        jwtAuth.tokenCreate(request, response, {
          member_pk: rows[0].member_pk,
          name: rows[0].name,
          // age: rows[0].age
        });
      } else {
        response.status(401).send({
          result: 'Unauthorized',
          message: 'ID 또는 패스워드를 확인해주세요.',
        });
      }
    }
  });
});

router.get('/login/', jwtAuth.tokenCheck, function (request, response) {
  response.status(200).send({
    name: request.decoded.name,
  });
});

router.post('/', function (request, response) {
  members.push(request.body);
  console.log('Done members post', members);
  response.status(200).send({
    result: 'Created',
  });
});

router.get('/', function (request, response) {
  console.log('Done members get', members);
  response.status(200).send({
    result: 'Read',
    members: members,
  });
});

router.patch('/:index', function (request, response) {
  const index = Number(request.params.index);
  members[index] = request.body;
  console.log('Done members patch', members);
  response.status(200).send({
    result: 'Updated',
  });
});

router.delete('/:index', function (request, response) {
  const index = Number(request.params.index);
  members.splice(index, 1);
  console.log('Done members delete', members);
  response.status(200).send({
    result: 'Deleted',
  });
});

module.exports = router;
