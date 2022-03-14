const router = global.express.Router();
const db = global.db;
const jwtAuth = require('../middlewares/jwtAuth.js');

router.post('/', jwtAuth.tokenCheck, function (request, response) {
  const sql = `
    insert into items(member_pk, name, enter, expire)
    values (
      ?,
      ?,
      date_format(now(), '%Y-%m-%d'),
      date_format(date_add(now(), interval + 2 week), '%Y-%m-%d')
    );
  `;
  db.query(
    sql,
    [request.decoded.member_pk, request.body.name],
    function (error, rows) {
      if (!error || db.error(request, response, error)) {
        console.log('Done items post', rows);
        response.status(200).send({
          result: 'Created',
        });
      }
    }
  );
});

router.get('/', jwtAuth.tokenCheck, function (request, response) {
  const orderByName = request.query.orderByName || 'name';
  const orderByType = request.query.orderByType || 'asc';
  console.log('orderByName: ', orderByName, ', orderByType: ', orderByType);
  const sql = `
      select
        *, (
          select grocery_pk from groceries g where g.grocery_pk = i.item_pk
        ) as grocery_pk
      from items i
      where member_pk = ?
      order by ${orderByName} ${orderByType};
    `;
  db.query(sql, [request.decoded.member_pk], function (error, rows) {
    if (!error || db.error(request, response, error)) {
      response.status(200).send({
        result: 'Readed',
        items: rows,
      });
    }
  });
});

router.delete('/:index', jwtAuth.tokenCheck, function (request, response) {
  const index = Number(request.params.index);
  const sql = `
    delete from items
    where
      member_pk = ?
      and item_pk = ${index};
    `;
  db.query(sql, [request.decoded.member_pk], function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Succeed Delete item', rows);
      response.status(200).send({
        result: 'Deleted',
        items: rows,
      });
    }
  });
});

router.patch('/:index', jwtAuth.tokenCheck, function (request, response) {
  const index = Number(request.params.index);
  const body = request.body;
  const sql = `
    update items
    set
      name = '${body.name}',
      enter = '${body.enter}',
      expire = '${body.expire}'
    where
      member_pk = ?
      and item_pk = ${index};
  `;
  db.query(sql, [request.decoded.member_pk], function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Succeed Update item', rows);
      response.status(200).send({
        result: 'Updated',
        items: rows,
      });
    }
  });
});

module.exports = router;
