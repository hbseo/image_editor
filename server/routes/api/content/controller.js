// const { data } = require('jquery');
const moment = require('moment');
const Database = require('../../../database/index');

exports.save = (req, res) => {
  const database = new Database();
  const {title, id, data} = req.body;
  let date = moment().format('YYYY-MM-DD HH:mm:ss');
  let check_query = `SELECT idx FROM USERS WHERE userid = "${id}";`;

  const save = (result) => {
    if(result[0]) {
      let save_query = `INSERT INTO PROJECTS (title, useridx, project_data, create_date, modify_date) VALUES ('${title}', '${result[0].idx}', '${JSON.stringify(data)}', '${date}', '${date}')`;
      database.query(save_query)
      .then(respond)
      .catch(onError);
    }
    else {
      res.status(200).json({
        msg: 'idx error : no user id'
      })
    }
  }
  const respond = (result) => {
    if(result) {
      res.status(200).json({
        msg: 'save success'
      })
    }
    else {
      res.status(200).json({
        msg: 'save fail'
      })
    }
  }

  const onError = (error) => {
    res.status(400).json({
      msg: error.message
    })
  }

  database.query(check_query)
  .then(save)
  .catch(onError)
}

exports.get = (req, res) => {
  const database = new Database();
  const {id, count} = req.body;
  let check_query = `SELECT idx FROM USERS WHERE userid = "${id}";`;

  const get = (result) => {
    if(result[0]) {
      let get_query = `SELECT * FROM PROJECTS WHERE useridx = ${result[0].idx} LIMIT ${count};`;
      database.query(get_query)
      .then(respond)
      .catch(onError);
    }
    else {
      res.status(200).json({
        msg: 'idx error : no user id'
      })
    }
  }
  const respond = (result) => {
    if(result) {
      res.status(200).send(result)
    }
    else {
      res.status(200).json({
        msg: 'get fail'
      })
    }
  }

  const onError = (error) => {
    res.status(400).json({
      msg: error.message
    })
  }

  database.query(check_query)
  .then(get)
  .catch(onError)
}
