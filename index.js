
const TelegramBot = require('node-telegram-bot-api');

const express = require('express')

const cors = require('cors')


const token = "6495119642:AAFeovzLUUbn9F-K8-7QXLb1XZrXSuRtJwI"

const webAppUrl = 'https://silly-sunburst-5b7a04.netlify.app';

const bot = new TelegramBot(token, {polling: true});

const app = express()

app.use(express.json())
app.use(cors())


bot.on('message', async(msg) => {
  const chatId = msg.chat.id;

  const text = msg.text;


  if(text==="/start") {
    await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {
      reply_markup: {
        keyboard: [
          [{text: 'Enter the form, please', web_app: {url: webAppUrl + '/form'}}]
        ]
      }
    })


    await bot.sendMessage(chatId, "Go to our online-store", {
      reply_markup: {
        inline_keyboard: [
          [{text: 'Buy something', web_app: {url : webAppUrl}}]
        ]
      }
    }
)}

if(msg?.web_app_data?.data) {
  try{
    const data = JSON.parse(msg?.web_app_data?.data)

    await bot.sendMessage(chatId, 'Thank you for your answer!')
    await bot.sendMessage(chatId, 'Your country: ' + data?.country)
    await bot.sendMessage(chatId, 'Your street: ' + data?.street)

    setTimeout(async() => {
      await bot.sendMessage(chatId, 'All information you will get in this chat')
    }, 3000)
  }catch(e) {
    console.log(e);
  }
}


  // bot.sendMessage(chatId, 'Received your message');
});

app.post('/web-data', async (req, res) => {
  const {queryId, products, totalPrice} = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'All is ok',
      input_message_content: {message_text: 'Congratulations on your purchase! You have bought goods for the amount of ' + totalPrice}
    })

    return res.status(200).json({})
  }
  catch {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Error',
      input_message_content: {message_text: 'Failed to purchase the product, try again '}
    })

    return res.status(500).json({})
  }

 
})

const PORT = 8000;

app.listen(PORT, () => console.log(`server srarted on PORT ${PORT}`))