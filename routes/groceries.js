const router = global.express.Router();
const db = global.db;

router.post('/:item_pk', function (request, response) {
  const sql = `
  insert into groceries (
    select item_pk as grocery_pk, member_pk, name, enter, expire from items
    where item_pk = ?
  );
  `;
  db.query(sql, [request.params.item_pk], function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done groceries post', rows);
      response.status(200).send({
        result: 'Created',
      });
    }
  });
});

router.get('/', function (request, response) {
  const orderByName = request.query.orderByName || 'name';
  const orderByType = request.query.orderByType || 'asc';
  console.log(orderByName, orderByType);
  const sql = `
      select * from groceries
      where member_pk = 1
      order by ${orderByName} ${orderByType};
    `;
  db.query(sql, null, function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Done groceries get', rows);
      response.status(200).send({
        result: 'Readed',
        groceries: rows,
      });
    }
  });
});

router.delete('/:index', function (request, response) {
  const index = Number(request.params.index);
  const sql = `
    delete from groceries where grocery_pk = ${index};
    `;
  db.query(sql, null, function (error, rows) {
    if (!error || db.error(request, response, error)) {
      console.log('Succeed Delete grocery', rows);
      response.status(200).send({
        result: 'Deleted',
        groceries: rows,
      });
    }
  });
});

router.patch('/:index', function (request, response) {
  const index = Number(request.params.index);
  const body = request.body;
  const sql = `
    update groceries set name = '${body.name}', enter = '${body.enter}', expire = '${body.expire}' where grocery_pk = ${index};
  `;
  db.query(sql, null, function (error, rows) {
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
