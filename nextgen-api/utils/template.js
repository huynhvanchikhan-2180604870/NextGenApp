const getVerificationEmailTemplate = (verificationCode) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #516349;
          color: white;
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 32px 24px;
          background: white;
        }
        .verification-code {
          text-align: center;
          padding: 24px;
          margin: 24px 0;
          background: #f3f4f6;
          border-radius: 12px;
        }
        .code {
          font-size: 32px;
          font-weight: bold;
          color: #516349;
          letter-spacing: 4px;
        }
        .footer {
          text-align: center;
          padding: 24px;
          color: #6b7280;
          font-size: 14px;
          border-top: 1px solid #e5e7eb;
        }
        .note {
          font-size: 14px;
          color: #6b7280;
          text-align: center;
          margin-top: 16px;
        }
        .logo {
          font-size: 36px;
          margin-bottom: 16px;
        }
        @media only screen and (max-width: 600px) {
          .container {
            margin: 0;
            border-radius: 0;
          }
          .header {
            padding: 24px 16px;
          }
          .content {
            padding: 24px 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">NextGen</div>
          <h1>Xác Minh Email Của Bạn</h1>
        </div>
        <div class="content">
          <p>Xin chào,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã xác minh dưới đây:</p>
          
          <div class="verification-code">
            <div class="code">${verificationCode}</div>
          </div>
          
          <p class="note">Mã xác minh này sẽ hết hạn sau 10 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} NextGen. All rights reserved.</p>
          <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { getVerificationEmailTemplate };
