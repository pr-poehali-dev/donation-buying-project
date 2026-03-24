"""
Аутентификация: регистрация, вход, выход, получение текущего пользователя.
action: register | login | me | logout
"""
import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2


def get_conn():
    dsn = os.environ["DATABASE_URL"]
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    return psycopg2.connect(dsn, options=f"-c search_path={schema}")


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_token(headers: dict):
    auth = headers.get("x-authorization") or headers.get("authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    return None


def get_user_by_token(cur, token: str):
    cur.execute(
        """SELECT u.id, u.username, u.email, u.rank, u.balance
           FROM sessions s JOIN users u ON s.user_id = u.id
           WHERE s.token = %s AND s.expires_at > NOW()""",
        (token,)
    )
    return cur.fetchone()


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "POST")
    headers = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    body = json.loads(event.get("body") or "{}") if method == "POST" else {}
    action = body.get("action", "")

    conn = get_conn()
    cur = conn.cursor()

    try:
        if action == "register":
            username = (body.get("username") or "").strip()
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""

            if not username or not email or not password:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Все поля обязательны"})}
            if len(password) < 6:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

            cur.execute("SELECT id FROM users WHERE email = %s OR username = %s", (email, username))
            if cur.fetchone():
                return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Email или никнейм уже занят"})}

            cur.execute(
                "INSERT INTO users (username, email, password_hash, rank) VALUES (%s, %s, %s, 'user') RETURNING id",
                (username, email, hash_password(password))
            )
            user_id = cur.fetchone()[0]
            token = secrets.token_hex(32)
            expires = datetime.now() + timedelta(days=30)
            cur.execute(
                "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user_id, token, expires)
            )
            conn.commit()
            return {
                "statusCode": 200, "headers": CORS,
                "body": json.dumps({"token": token, "user": {"id": user_id, "username": username, "email": email, "rank": "user", "balance": 0}})
            }

        if action == "login":
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""
            cur.execute(
                "SELECT id, username, email, rank, balance FROM users WHERE email = %s AND password_hash = %s",
                (email, hash_password(password))
            )
            user = cur.fetchone()
            if not user:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}
            token = secrets.token_hex(32)
            expires = datetime.now() + timedelta(days=30)
            cur.execute("INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)", (user[0], token, expires))
            conn.commit()
            return {
                "statusCode": 200, "headers": CORS,
                "body": json.dumps({"token": token, "user": {"id": user[0], "username": user[1], "email": user[2], "rank": user[3], "balance": user[4]}})
            }

        if action == "me":
            token = get_token(headers)
            if not token:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user = get_user_by_token(cur, token)
            if not user:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}
            return {
                "statusCode": 200, "headers": CORS,
                "body": json.dumps({"user": {"id": user[0], "username": user[1], "email": user[2], "rank": user[3], "balance": user[4]}})
            }

        if action == "logout":
            token = get_token(headers)
            if token:
                cur.execute("UPDATE sessions SET expires_at = NOW() WHERE token = %s", (token,))
                conn.commit()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестное действие"})}

    finally:
        cur.close()
        conn.close()