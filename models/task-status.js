const { Model } = require('objection');

class TaskStatus extends Model {
  static get tableName() {
    return 'task_statuses';
  }
}

module.exports = TaskStatus;
