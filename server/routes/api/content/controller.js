// const { data } = require('jquery');
const moment = require('moment');
const {Database} = require('../../../database/index');

exports.save = (req, res) => {
  const database = new Database();
  const {title, id, data} = req.body;
  // console.log(data);
  let date = moment().format('YYYY-MM-DD HH:mm:ss');
  let check_query = `SELECT idx, size FROM USERS WHERE userid = "${id}";`;
  let user_idx;
  let prj_idx;
  let json_data = JSON.stringify(data);
  let size = json_data.length;

  const save = (result) => {
    console.log('save : ', result)
    if(result[0]) {
      if(result[0].size + size > 10485760){
        res.status(200).json({
          success : false,
          msg: 'size exceeded'
        })
      }
      else{
        user_idx = result[0].idx;
        let save_query = `INSERT INTO PROJECTS (title, useridx, project_data, create_date, modify_date) VALUES ('${title}', '${result[0].idx}', '${json_data}', '${date}', '${date}')`;
        database.query(save_query)
        .then(userUpdate)
        .catch(onError);
      }
    }
    else {
      res.status(200).json({
        success : false,
        msg: 'idx error : no user id'
      })
    }
  }

  const userUpdate = (result) => {
    if(result) {
      prj_idx = result.insertId;
      let update_query = `UPDATE USERS SET project = project + 1, size = size + ${size} WHERE idx = '${user_idx}'`;
      database.query(update_query)
      .then(respond)
      .catch(onError);
    }
    else {
      database.connection.rollback()
      res.status(200).json({
        success : false,
        msg: 'save fail'
      })
    }
  }

  const respond = (result) => {
    if(result) {
      database.connection.commit((err)=>{
        if(err){
          database.connection.rollback()
          throw err;
        }
      })
      res.status(200).json({
        success : true,
        msg: 'save success',
        prj_idx : prj_idx
      })
    }
    else {
      database.connection.rollback()
      res.status(200).json({
        success : false,
        msg: 'update user fail'
      })
    }
  }

  const onError = (error) => {
    database.connection.rollback()
    res.status(400).json({
      success : false,
      msg: error.message
    })
  }

  database.connection.beginTransaction((err) => {
    if(err){throw err;}
    database.query(check_query)
    .then(save)
    .catch(onError)
  })

}

exports.update = (req, res) => {
  const database = new Database();
  const { id, prj_idx, data} = req.body;
  let date = moment().format('YYYY-MM-DD HH:mm:ss');
  let check_query = `SELECT idx, size FROM USERS WHERE userid = "${id}";`;
  let json_data = JSON.stringify(data);
  let size = json_data.length; // update size
  let origin_size;
  let user_idx;
  let user_size; // user size ( total )

  const save = (result) => {
    if(result[0]) {
      origin_size = result[0].len
      if(user_size - origin_size + size > 10485760){
        res.status(200).json({
          success : false,
          msg: 'size exceeded'
        })
      }
      else{
        let update_query = `UPDATE PROJECTS SET project_data = '${json_data}', modify_date = '${date}' WHERE idx = "${prj_idx}";`;
        database.query(update_query)
        .then(userUpdate)
        .catch(onError);
      }
    }
    else {
      res.status(200).json({
        success : false,
        msg: 'prj idx error'
      })
    }
  }

  const checkSize = (result) => {
    if(result[0]){
      user_idx = result[0].idx;
      user_size = result[0].size;
      let size_query = `SELECT length(project_data) AS len FROM PROJECTS WHERE idx = ${prj_idx};`;
      database.query(size_query)
      .then(save)
      .catch(onError);
    }
    else {
      res.status(200).json({
        success : false,
        msg: 'idx error : no user id'
      })
    }
  }

  const userUpdate = (result) => {
    if(result) {
      let update_query = `UPDATE USERS SET size = size + ${size - origin_size} WHERE idx = '${user_idx}'`;
      database.query(update_query)
      .then(respond)
      .catch(onError);
    }
    else {
      database.connection.rollback()
      res.status(200).json({
        success : false,
        msg: 'update project fail'
      })
    }
  }

  const respond = (result) => {
    database.connection.commit((err)=>{
      if(err){
        database.connection.rollback()
        throw err;
      }
    })
    if(result) {
      res.status(200).json({
        success : true,
        msg: 'update success'
      })
    }
    else {
      database.connection.rollback()
      res.status(200).json({
        success : false,
        msg: 'update uesr fail'
      })
    }
  }

  const onError = (error) => {
    database.connection.rollback()
    res.status(400).json({
      success : false,
      msg: error.message
    })
  }

  database.connection.beginTransaction((err) => {
    if(err){throw err;}
    database.query(check_query)
    .then(checkSize)
    .catch(onError)
  })
}

exports.get = (req, res) => {
  const database = new Database();
  const {id, search, limit, offset, sort} = req.body;
  let check_query = `SELECT idx FROM USERS WHERE userid = "${id}";`;
  let search_option = search.length !== 0 ? `title LIKE '%${search}%' AND ` : ``;
  let sort_option = sortlist[sort];

  const get = (result) => {
    if(result[0]) {
      let get_query = `SELECT * FROM PROJECTS WHERE ${search_option} useridx = ${result[0].idx} ${sort_option} LIMIT ${limit} OFFSET ${offset};`;
      console.log(get_query)
      database.query(get_query)
      .then(respond)
      .catch(onError);
    }
    else {
      res.status(200).json({
        success : false,
        msg: 'idx error : no user id'
      })
    }
  }
  const respond = (result) => {
    if(result) {
      res.status(200).json({
        success : true,
        result : result,
        search : search_option
      })
    }
    else {
      res.status(200).json({
        success : false,
        msg: 'get fail'
      })
    }
  }

  const onError = (error) => {
    res.status(400).json({
      success : false,
      msg: error.message
    })
  }

  database.query(check_query)
  .then(get)
  .catch(onError)
}

exports.delete = (req, res) => {
  const database = new Database();
  const { id, prj_idx } = req.body;
  let check_query = `SELECT idx, size FROM USERS WHERE userid = "${id}";`;
  let delete_size;
  let user_idx;
  // let user_size; // user size ( total )

  const deletepj = (result) => {
    if(result[0]) {
      delete_size = result[0].len
      let update_query = `DELETE FROM PROJECTS WHERE idx = "${prj_idx}";`;
      database.query(update_query)
      .then(userUpdate)
      .catch(onError);
    }
    else {
      res.status(200).json({
        success : false,
        msg: 'prj idx error'
      })
    }
  }

  const checkSize = (result) => {
    if(result[0]){
      user_idx = result[0].idx;
      // user_size = result[0].size;
      let size_query = `SELECT length(project_data) AS len FROM PROJECTS WHERE idx = ${prj_idx};`;
      database.query(size_query)
      .then(deletepj)
      .catch(onError);
    }
    else {
      res.status(200).json({
        success : false,
        msg: 'idx error : no user id : delete'
      })
    }
  }

  const userUpdate = (result) => {
    if(result) {
      let update_query = `UPDATE USERS SET size = size - ${delete_size}, project = project - 1 WHERE idx = '${user_idx}'`;
      database.query(update_query)
      .then(respond)
      .catch(onError);
    }
    else {
      database.connection.rollback()
      res.status(200).json({
        success : false,
        msg: 'fail to delete a project'
      })
    }
  }

  const respond = (result) => {
    database.connection.commit((err)=>{
      if(err){
        database.connection.rollback()
        throw err;
      }
    })
    if(result) {
      res.status(200).json({
        success : true,
        msg: 'delete success'
      })
    }
    else {
      database.connection.rollback()
      res.status(200).json({
        success : false,
        msg: 'delete fail'
      })
    }
  }

  const onError = (error) => {
    database.connection.rollback()
    res.status(400).json({
      success : false,
      msg: error.message
    })
  }

  database.connection.beginTransaction((err) => {
    if(err){throw err;}
    database.query(check_query)
    .then(checkSize)
    .catch(onError)
  })
}

exports.deleteall = (req, res) => {
  const database = new Database();
  const { id } = req.body;
  let check_query = `SELECT idx FROM USERS WHERE userid = "${id}";`;
  let user_idx;

  const checkuser = (result) => {
    if(result[0]){
      user_idx = result[0].idx;
      let delete_query = `DELETE FROM PROJECTS WHERE useridx = "${user_idx}";`;
      database.query(delete_query)
      .then(userUpdate)
      .catch(onError);
    }
    else {
      res.status(200).json({
        success : false,
        msg: 'idx error : no user id : deleteall'
      })
    }
  }

  const userUpdate = (result) => {
    if(result) {
      let update_query = `UPDATE USERS SET size = 0, project = 0 WHERE idx = '${user_idx}'`;
      database.query(update_query)
      .then(respond)
      .catch(onError);
    }
    else {
      database.connection.rollback()
      res.status(200).json({
        success : false,
        msg: 'fail to delete all projects'
      })
    }
  }

  const respond = (result) => {
    database.connection.commit((err)=>{
      if(err){
        database.connection.rollback()
        throw err;
      }
    })
    if(result) {
      res.status(200).json({
        success : true,
        msg: 'all delete success'
      })
    }
    else {
      database.connection.rollback()
      res.status(200).json({
        success : false,
        msg: 'all delete fail'
      })
    }
  }

  const onError = (error) => {
    database.connection.rollback()
    res.status(400).json({
      success : false,
      msg: error.message
    })
  }

  database.connection.beginTransaction((err) => {
    if(err){throw err;}
    database.query(check_query)
    .then(checkuser)
    .catch(onError)
  })
}

const sortlist = [
  'ORDER BY TITLE ASC',
  'ORDER BY TITLE DESC',
  'ORDER BY create_date ASC',
  'ORDER BY create_date DESC',
]