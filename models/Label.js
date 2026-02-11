import { Model } from 'objection';
import Task from './Task.js';

export default class Label extends Model {
  static get tableName() {
    return 'labels';
  }

  static get relationMappings() {
    return {
      tasks: {
        relation: Model.ManyToManyRelation,
        modelClass: Task,
        join: {
          from: 'labels.id',
          through: {
            from: 'tasks_labels.labelId',
            to: 'tasks_labels.taskId',
          },
          to: 'tasks.id',
        },
      },
    };
  }
}
