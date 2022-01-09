import { MailerService } from "@nestjs-modules/mailer";

export const mailer = (
  fullName: any,
  code: string,
  userEmail: string,
  mailerServise: MailerService
) => {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><title>Registration</title>
    <style>.icons{border-top:1px solid #c7c7c7;padding-top:30px;display:flex;justify-content:center;padding-bottom:30px}.icon{width:70px;height:70px;margin:5px}</style></head>
    <body><div style="margin: 30px ;"><p>Hi ${fullName}</p><p>Welcome to wallet. Your registration is almost complete. Please enter this Code to confirm your email address.</p> 
    <br><h1>${code}</h1> <br><p>If the about code does not work, please try resend the code</p> <br> <br><p>Regards,</p><p>wallet.</p> <br><div></div> <br><div class="icons"> 
    <a href="#"><img class="icon" style="margin-right: 90px ;" src="http://134.122.127.152/images/emailfiles/googlePlay.png" alt=""></a> 
    <a href="#"><img class="icon" src="http://134.122.127.152/images/emailfiles/AppleStore.png" alt=""></a></div> <br><div class="icons"> 
    <a href="#"><img class="icon" src="http://134.122.127.152/images/emailfiles/Facebook.png" alt=""></a> <a href="#"><img class="icon" src="http://134.122.127.152/images/emailfiles/youtube.png" alt=""></a> 
    <a href="#"><img class="icon" src="http://134.122.127.152/images/emailfiles/linkedin.png" alt=""></a> <a href="#"><img class="icon" src="http://134.122.127.152/images/emailfiles/twitter.png" alt=""></a> 
    <a href="#"><img class="icon" src="http://134.122.127.152/images/emailfiles/instagram.png" alt=""></a></div></div></body></html>`;

  mailerServise
    .sendMail({
      from: "noreply@gmail.com", // sender address
      to: userEmail,
      subject: 'Account Activation In "wallet"',
      html,
    })
    .then((sendEmail) => {
      if (!sendEmail) {
        return false;
      }
    });
  return true;
};
