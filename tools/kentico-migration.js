const api = require('@kentico/kontent-management');

/*
  ╠► clientMigrateFrom: Project containing the type you want to migrate
  ╠► clientMigrateTo: Project where you want the type to migrate into
  ╚► Copy and paste projectId (Project ID in kentico) and apiKeys (Management API key in kentico) of each project
  ► codenameMigratingType: copy paste from kentico the codename of the type you want to migrate
*/

const clientMigrateFrom = new api.ManagementClient({
  projectId: 'd8c110e8-3009-00a8-f625-a3bbd998c6e1',
  apiKey: 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAianRpIjogIjdkZWNjY2FlMmZmYjRlYTNhMjczZGIzZGZlMTkyNzM3IiwNCiAgImlhdCI6ICIxNTcxNjQ5OTg0IiwNCiAgImV4cCI6ICIxOTE3MjQ5OTg0IiwNCiAgInByb2plY3RfaWQiOiAiZDhjMTEwZTgzMDA5MDBhOGY2MjVhM2JiZDk5OGM2ZTEiLA0KICAidmVyIjogIjIuMS4wIiwNCiAgInVpZCI6ICI1ZDFmMGIzNTdhNjRhZDBkZjJmNTUyNDYiLA0KICAiYXVkIjogIm1hbmFnZS5rZW50aWNvY2xvdWQuY29tIg0KfQ.K8Yz7WOv1OwJ1O4SgQPJCzkC7j6gOR3kMpPhhbZHqeE'
});

const clientMigrateTo = new api.ManagementClient({
  projectId: '8dea1e66-5da0-00e0-acce-c5feac8eeb70',
  apiKey: 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAianRpIjogImYwMjcyNTA3OTcwMDQxNzFhZjUwNDE2ZjY0NmQ5MTNkIiwNCiAgImlhdCI6ICIxNTcxNzUxMjMwIiwNCiAgImV4cCI6ICIxOTE3MzUxMjMwIiwNCiAgInByb2plY3RfaWQiOiAiOGRlYTFlNjY1ZGEwMDBlMGFjY2VjNWZlYWM4ZWViNzAiLA0KICAidmVyIjogIjIuMS4wIiwNCiAgInVpZCI6ICI1ZDFmMGIzNTdhNjRhZDBkZjJmNTUyNDYiLA0KICAiYXVkIjogIm1hbmFnZS5rZW50aWNvY2xvdWQuY29tIg0KfQ.wefmVwa9iIlKwyxPHmdoqiatDHpTHBKv7BfROowDm0s'
});

const codenameMigratingType = 'migration_testing_type';
const codenameMigratingItem = 'migration_testing_item';

clientMigrateFrom.viewContentType()
  .byTypeCodename(codenameMigratingType)
  .toObservable()
  .subscribe((response) => {

    clientMigrateTo.addContentType()
      .withData(response.data)
      .toObservable()
      .subscribe((response) => {
      },
        (error) => {
          console.log(error);
        })

  }),
  (error) => {
    console.log(error);
  };

/*  ITEM MIGRATION  */

// clientMigrateFrom.viewContentItem()
//   .byItemCodename(codenameMigratingItem)
//   .toObservable()
//   .subscribe((response) => {


//     clientMigrateTo.addContentItem()
//       .withData(response.rawData)
//       .toObservable()
//       .subscribe((response) => {

//       },
//         (error) => {
//           console.log(error);
//         })

//   }),
//   (error) => {
//     console.log(error);
//   };
