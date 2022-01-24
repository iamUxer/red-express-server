const router = global.express.Router();
const db = global.db;

router.post("/", function (request, response) {
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
      console.log("Done items post", rows);
      response.status(200).send({
        result: "Created",
      });
    }
  });
});

module.exports = router;
