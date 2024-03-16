
const style = `
        background-color: #eee;
        padding: 20px;
        border-radius:20px`


export function emailTemplate (sendEmail, content, replyTo, subject) {
    return {
        Destination: {
            ToAddresses: [sendEmail.email],
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<html>
                              <div style="${style}">
                                <h1>Welcome to LTH Test App</h1>
                                ${content}
                                <p>&copy; ${new Date().getFullYear()}</p>
                               </div>
                            </html>
                              `
                    ,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
        },
        Source: replyTo,
    }
}