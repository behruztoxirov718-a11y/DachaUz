export const sendBookingToTelegram = async (booking: any, dacha: any) => {
  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  const message = `
🏡 *Yangi bron!*

📍 *Dacha:* ${dacha.title}
📌 *Joylashuv:* ${dacha.district}

👤 *Mijoz:* ${booking.guestName}
📞 *Telefon:* ${booking.guestPhone}
👥 *Mehmonlar:* ${booking.guests} kishi

📅 *Kelish:* ${booking.checkIn}
📅 *Ketish:* ${booking.checkOut}

💰 *Jami:* ${booking.totalPrice.toLocaleString()} so'm
${booking.message ? `\n💬 *Izoh:* ${booking.message}` : ''}
  `.trim();

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    }),
  });
};