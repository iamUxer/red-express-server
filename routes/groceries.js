const router = global.express.Router();
const db = global.db;
const jwtAuth = require('../middlewares/jwtAuth.js');

router.post('/', jwtAuth.tokenCheck, function (request, response) {
  const id = request.body.id;
  const sql = `
  insert into groceries (
    select item_pk as grocery_pk, member_pk, name, enter, expire from items
    where 
      member_pk = ?
      and item_pk = ?
  );
  `;
  db.query(sql, [request.decoded.member_pk, id], function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done groceries post', rows);
      response.status(200).send({
        result: 'Created',
      });
    }
  });
});

router.get('/', jwtAuth.tokenCheck, function (request, response) {
  const orderByName = request.query.orderByName || 'name';
  const orderByType = request.query.orderByType || 'asc';
  const q = request.query.q || '';
  const sql = `
      select * from groceries
      where
        member_pk = ?
        and (? = '' or name like '%${q}%' )
      order by ${orderByName} ${orderByType};
    `;
  console.log(request.decoded);
  db.query(sql, [request.decoded.member_pk, q], function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done groceries get');
      response.status(200).send({
        result: 'Readed',
        groceries: rows,
      });
    }
  });
});

router.delete('/:id', jwtAuth.tokenCheck, function (request, response) {
  const id = Number(request.params.id);
  console.log('router delete id:::', id);
  const sql = `
    delete from groceries
    where
      member_pk = ?
      and grocery_pk = ${id};
    `;
  db.query(sql, [request.decoded.member_pk], function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Succeed Delete grocery');
      response.status(200).send({
        result: 'Deleted',
        groceries: rows,
      });
    }
  });
});

router.patch('/:index', jwtAuth.tokenCheck, function (request, response) {
  const index = Number(request.params.index);
  const body = request.body;
  const sql = `
    update groceries
    set
      name = '${body.name}',
      enter = '${body.enter}',
      expire = '${body.expire}'
    where
      member_pk = ?
      and grocery_pk = ${index};
  `;
  db.query(sql, [request.decoded.member_pk], function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Succeed Update grocery', rows);
      response.status(200).send({
        result: 'Updated',
        groceries: rows,
      });
    }
  });
});

module.exports = router;
