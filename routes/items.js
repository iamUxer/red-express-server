const router = global.express.Router();
const db = global.db;

router.post('/', function (request, response) {
  const sql = `
    insert into items(member_pk, name, enter, expire)
    values (
      1,
      ?,
      date_format(now(), '%Y-%m-%d'),
      date_format(date_add(now(), interval + 2 week), '%Y-%m-%d')
    );
  `;
  db.query(sql, [request.body.name], function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done items post', rows);
      response.status(200).send({
        result: 'Created',
      });
    }
  });
});

router.get('/', function (request, response) {
  const orderName = request.query.orderName || 'name';
  const orderType = request.query.orderType || 'asc';
  const sql = `
      select * from items
      where member_pk = 1
      order by ${orderName} ${orderType};
    `;
  db.query(sql, null, function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done items get', rows);
      response.status(200).send({
        result: 'Readed',
        items: rows,
      });
    }
  });
});

router.delete('/:index', function (request, response) {
  const index = Number(request.params.index);
  const sql = `
    delete from items where item_pk = ${index};
    `;
  db.query(sql, null, function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Succeed Delete item', rows);
      response.status(200).send({
        result: 'Deleted',
        items: rows,
      });
    }
  });
});

router.post('/:index', function (request, response) {
  const index = Number(request.params.index);
  const body = request.body;
  const sql = `
    update items set name = ${body.name}, enter = ${body.enter}, expire = ${body.expire} where item_pk = ${index}
  `;
  db.query(sql, null, function (error, rows) {
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
