module.exports = {
  name: 'angular-apollo-reactive-cache',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/angular-apollo-reactive-cache',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
