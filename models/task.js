import Label from './Label.js';

static get relationMappings() {
  return {
    labels: {
      relation: Model.ManyToManyRelation,
      modelClass: Label,
      join: {
        from: 'tasks.id',
        through: {
          from: 'tasks_labels.taskId',
          to: 'tasks_labels.labelId',
        },
        to: 'labels.id',
      },
    },
  };
}
