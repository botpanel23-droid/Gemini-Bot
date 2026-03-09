// Variable Settings (Database එකට පසුව සම්බන්ධ කළ හැක)
let autoTyping = true;
let autoRecording = false;
let autoStatusView = true;
let autoStatusLike = true;
const likeEmojis = ['💗', '👽', '🔥', '☺️', '😼'];

// Connection එක සිදුවූ විගස (Deploy කළ පසු)
sock.ev.on('messages.upsert', async (chat) => {
    const msg = chat.messages[0];
    if (!msg.message) return;
    const from = msg.key.remoteJid;

    // --- AUTO TYPING / RECORDING ---
    if (autoTyping) {
        await sock.sendPresenceUpdate('composing', from);
    } else if (autoRecording) {
        await sock.sendPresenceUpdate('recording', from);
    }

    // --- AUTO STATUS VIEW & LIKE ---
    if (msg.key.remoteJid === 'status@broadcast' && autoStatusView) {
        await sock.readMessages([msg.key]); // Auto View
        
        if (autoStatusLike) {
            const randomEmoji = likeEmojis[Math.floor(Math.random() * likeEmojis.length)];
            // Status එකට Reaction එකක් යැවීම
            await sock.sendMessage(msg.key.remoteJid, { 
                react: { text: randomEmoji, key: msg.key } 
            }, { statusJidList: [msg.key.participant] });
        }
    }
});

