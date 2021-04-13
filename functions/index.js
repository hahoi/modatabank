const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
const adminApp = admin.initializeApp();

exports.AdminListUsers = functions.https.onCall((data, context) => {
    return adminApp.auth().listUsers().then(listUsersResult => {
        let users = []
        listUsersResult.users.forEach((userRecord) => {
            users.push(userRecord.toJSON())
        })
        return users
    }).catch(err => {
        return err;
    })
})

exports.AdminDeleteUsers = functions.https.onCall((data, context) => {
    const uid = data.uid;
    return adminApp.auth().deleteUser(uid)
        .then(function () {
            console.log('Successfully deleted user');
            return 'Successfully deleted user'
        })
        .catch(function (error) {
            console.log('Error deleting user:', error);
        });
})


exports.logActivities = functions.firestore.document('/{collection}/{id}')
  .onCreate((snap, context) => {
    // console.log(snap.data());

const activities = admin.firestore().collection('activities');
const collection = context.params.collection;

if (collection === '現場紀錄表') {
    console.log('現場紀錄表')
    console.log(snap.data().name);
    console.log(context.auth.email)
//   return activities.add({ text: 'a new tutorial request was added' });
}
if (collection === 'MDBUsers') {
    console.log('使用者資料')
    console.log(snap.data().name);
    console.log(context.auth.email)
//   return activities.add({ text: 'a new user signed up'});
}

return null;

});



// //備份全部資料指令    gcloud firestore export gs://mdb_backup
// //還原全部資料指令    gcloud firestore import gs://mdb_backup/2020-09-08T02:18:55_34393/
// //注意：如果數據庫中的文檔不受導入影響，則導入後它將保留在數據庫中。


/*================================================================================================
 資料庫備份，利用pub/sub 呼叫cloud function exportDB，再用scheduler 排程執行
 要在 Storage 建立值區 gs://BUCKET_NAME
*/

const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();

/* 
底下程式碼要修改的部分
將BUCKET_NAME替換為您的存儲桶的名稱。
修改every 24 hours以設置您的導出時間表。
修改collectionIds: ['users', 'posts'] 僅導出指定的集合組。[]導出全部。

cron.yaml參考
every 24 hours
every monday 09:00
every 1 mins
every 5 minutes
every 5 minutes from 10:00 to 14:00
*/

// Replace BUCKET_NAME
// const bucket = 'gs://BUCKET_NAME';
const bucket = 'gs://mobiledatabank-backup'; //要改的部分

exports.scheduledFirestoreExport = functions.pubsub
    .schedule('every 24 hours') //要改的部分
    .onRun((context) => {
        const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
        const databaseName = client.databasePath(projectId, '(default)');

        return client.exportDocuments({
            name: databaseName,
            outputUriPrefix: bucket,
            // collectionIds: ['users', 'posts']
            collectionIds: ['現場紀錄表','MDBUsers'] //要改的部分 全部備份
        })
            .then(responses => {
                const response = responses[0];
                console.log(`Operation Name: ${response['name']}`);
            })
            .catch(err => {
                console.error(err);
                throw new Error('Export operation failed');
            });
    });

    /*
    上面程式執行權限會有問題，到這個頁面操作配置訪問權限，在網頁上先修改project-id後再拷貝，很方便。
    https://firebase.google.com/docs/firestore/solutions/schedule-export#configure_access_permissions
  
    gcloud projects add-iam-policy-binding modatabank \
    --member serviceAccount:modatabank@appspot.gserviceaccount.com \
    --role roles/datastore.importExportAdmin

    gsutil iam ch serviceAccount:modatabank@appspot.gserviceaccount.com:admin \
    gs://mobiledatabank-backup

    上面兩行命令執行完，就OK了！
    */
