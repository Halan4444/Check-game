require('dotenv').config();

const AWS = require('aws-sdk'); // bạn cần add thư viện aws-sdk: yarn add aws-sdk

// Thông tin SES_AWS_ACCESS_KEY_ID, SES_AWS_SECRET_ACCESS_KEY nằm trong file credentials bạn đã download về ở trên nhé
const sesConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION, // đây là region của server nó là vùng bạn đã chọn khi tạo ses nếu Mumbai là ap-south-1
    apiVersion: '2010-12-01', // version của api
}

const sesAws = new AWS.SES(sesConfig);

const params = {
    Destination: {
        ToAddresses: ['Halan4444b@gmail.com'], // email người nhận
    },
    Source: process.env.SES_AWS_SMTP_SENDER, // email dùng để gửi đi
    Message: {
        Subject: {
            Data: 'Test SES AWS',
            Charset: 'UTF-8',
        },
        Body: {
            Text: {
                Data: 'Test SES AWS',
                Charset: 'UTF-8'
            }
        }
    },
}

const sendPromise = sesAws.sendEmail(params).promise();

sendPromise
    .then((data) => {
        console.log(data)
    }).SMTP
    .catch((error) => {
        console.log(error)
    })

