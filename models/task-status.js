// models/task-status.js
const { Model } = require('objection');

class TaskStatus extends Model {
  static get tableName() {
    return 'task_statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    const Task = require('./task');
    return {
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: 'task_statuses.id',
          to: 'tasks.statusId',
        },
      },
    };
  }
}

module.exports = TaskStatus;
