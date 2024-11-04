// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
const { Client, Events, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

// 設定ファイルからトークン情報を呼び出し、変数に保存します
const { token , channelId} = require('./config.json');

// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 明日の日付を取得する関数
function getTomorrowDate() {
    const now = new Date();
    now.setDate(now.getDate() + 1); // 現在の日付に1日を加算
    return now;
}

// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(Events.ClientReady, c => {
	console.log(`準備OKです! ${c.user.tag}がログインします。`);

    // スケジュールを設定して、毎晩11時40分にメッセージを送信
    cron.schedule('40 23 * * *', () => {
        const channel = client.channels.cache.get(channelId);

        if (channel) {
            const tomorrow = getFormattedDate(getTomorrowDate());
            channel.send(`@everyone  ${tomorrow} の参加申請行えのろま`);
            console.log('告知しました');
        } else {
            console.error('チャンネルが見つかりません');
        }
    },{
        scheduled: true,
        timezone: "Asia/Tokyo"
    });

    // スケジュールを設定して、毎晩8時にメッセージを送信
    cron.schedule('0 20 * * *', () => {
        const channel = client.channels.cache.get(channelId);

        if (channel) {
            const today = getFormattedDate(new Date());
            channel.send(`@everyone ${today} のチェックインはいたしましたでしょうか？もしまだなら是非実施していただけますと幸いです`);
            console.log('告知しました');
        } else {
            console.error('チャンネルが見つかりません');
        }
        
    },{
        scheduled: true,
        timezone: "Asia/Tokyo"
    });
});

// ログインします
client.login(token);