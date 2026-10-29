import os
from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import telebot
from telebot.types import Update

from src.sql.crud import SQLCRUD
from src.sql.dependencies import get_session
from src.redis.crud import UserStateCache

from chatbot_logic.processor import TextProcessor
from chatbot_logic.qachain import QAChain

load_dotenv()
API_KEY = os.getenv("TELEGRAM_API_KEY")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET")

bot = telebot.TeleBot(API_KEY, threaded=False)
redis = UserStateCache()
TTL_SECONDS = 600

app = FastAPI()


@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.send_message(message.chat.id, "\U0001F44B ¡Hola! Soy tu asistente documental.\nEstoy aquí para ayudarte.")
    show_main_menu(message)

def show_main_menu(message):
    with next(get_session()) as session:
        sql = SQLCRUD(session)
        cats = sql.get_cats()

        markup = telebot.types.InlineKeyboardMarkup()
        for cat in cats:
            markup.add(
                telebot.types.InlineKeyboardButton(
                    text=cat.name,
                    callback_data=f"cat_{cat.id}"
                )
            )

    bot.send_message(message.chat.id, "📂 Selecciona una categoría:", reply_markup=markup)


@bot.callback_query_handler(func=lambda call: call.data.startswith("cat_"))
def show_subcategories(call):
    with next(get_session()) as session:
        sql = SQLCRUD(session)
        category_id = call.data.split("cat_")[1]
        redis.set_user_state(call.from_user.id, "category", category_id, ttl=TTL_SECONDS)
        subs = sql.get_subs_by_cat_id(category_id)
        markup = telebot.types.InlineKeyboardMarkup()
        for sub in subs:
            markup.add(telebot.types.InlineKeyboardButton(text=sub.name, callback_data=f"sub_{sub.id}"))
        markup.add(telebot.types.InlineKeyboardButton(text="🔙 Volver", callback_data="back"))
        bot.edit_message_text(
            chat_id=call.message.chat.id,
            message_id=call.message.message_id,
            text=f"📁 Selecciona una subcategoría:",
            reply_markup=markup
        )


@bot.callback_query_handler(func=lambda call: call.data.startswith("sub_"))
def handle_subcategory(call):
    subcategory = call.data.split("sub_")[1]
    user_id = call.from_user.id
    redis.set_user_state(user_id, "subcategory", subcategory, ttl=TTL_SECONDS)
    state = redis.get_user_state(user_id)
    category = state.get("category", "Unknown")
    bot.answer_callback_query(call.id)
    bot.send_message(
        call.message.chat.id,
        # f"Has seleccionado la categoría {category} → subcategoría {subcategory}\n"
        f"📂 ¡Estoy listo para ayudarte! Pregúntame lo que quieras sobre este tema. 🤖"
    )


@bot.callback_query_handler(func=lambda call: call.data == "back")
def go_back_to_main_menu(call):
    with next(get_session()) as session:
        sql = SQLCRUD(session)
        cats = sql.get_cats()

        bot.answer_callback_query(call.id)
        markup = telebot.types.InlineKeyboardMarkup()
        for cat in cats:
            markup.add(
                telebot.types.InlineKeyboardButton(
                    text=cat.name,
                    callback_data=f"cat_{cat.id}"
                )
            )
        bot.edit_message_text(
            chat_id=call.message.chat.id,
            message_id=call.message.message_id,
            text="📂 Por favor elija una categoría:",
            reply_markup=markup
        )


@bot.message_handler(content_types=['text'])
def handle_text(message):
    user_id = message.from_user.id
    state = redis.get_user_state(user_id)
    if state and "category" in state and "subcategory" in state:
        text_processor = TextProcessor()
        truncated_query = text_processor.truncate_text(message.text)
        query = text_processor.clean_text(truncated_query)
        response = QAChain(state["category"], state["subcategory"]).get_retrieval_qa()
        result = response.invoke({"query": query})
        for i, doc in enumerate(result["source_documents"], start=1):
            print(f"\n--- Fuente {i} ---")
            print(doc.page_content[:200])
            print(doc.metadata)
        answer = result["result"]
        bot.send_message(message.chat.id, answer, parse_mode="Markdown")
    else:
        bot.send_message(message.chat.id,
                         "⚠️ Por favor, selecciona una categoría y subcategoría primero usando /start.",
                         parse_mode="Markdown")


@app.post("/webhook")
async def receive_update(request: Request, x_telegram_bot_api_secret_token: str = Header(None)):
    if not WEBHOOK_SECRET or x_telegram_bot_api_secret_token != WEBHOOK_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret token")

    data = await request.json()
    try:
        update = Update.de_json(data)
        bot.process_new_updates([update])
    except Exception as e:
        print(f"Error al procesar update: {e}", flush=True)
        return JSONResponse(content={"ok": False}, status_code=500)

    return {"ok": True}

