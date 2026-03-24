"""
Панель администратора: управление пакетами, промокодами, пользователями и рангами.
action: get_packages | update_package | get_promos | create_promo | update_promo |
        get_users | set_rank | check_promo
"""
import json
import os
import psycopg2


def get_conn():
    dsn = os.environ["DATABASE_URL"]
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    return psycopg2.connect(dsn, options=f"-c search_path={schema}")


def get_token(headers: dict):
    auth = headers.get("x-authorization") or headers.get("authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    return None


def get_user(cur, token: str):
    cur.execute(
        """SELECT u.id, u.username, u.rank FROM sessions s
           JOIN users u ON s.user_id = u.id
           WHERE s.token = %s AND s.expires_at > NOW()""",
        (token,)
    )
    return cur.fetchone()


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}


def err(code, msg):
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg})}


def ok(data):
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "")

    conn = get_conn()
    cur = conn.cursor()

    try:
        token = get_token(headers)
        if not token:
            return err(401, "Не авторизован")
        user = get_user(cur, token)
        if not user:
            return err(401, "Сессия истекла")

        user_id, username, rank = user
        is_admin = rank in ("admin", "owner")
        is_owner = rank == "owner"

        # get_packages — список пакетов (для всех авторизованных)
        if action == "get_packages":
            cur.execute("SELECT id, name, price, emoji, color, description, popular, is_new, active, sort_order FROM packages ORDER BY sort_order")
            rows = cur.fetchall()
            return ok({"packages": [
                {"id": r[0], "name": r[1], "price": r[2], "emoji": r[3], "color": r[4],
                 "description": r[5], "popular": r[6], "is_new": r[7], "active": r[8], "sort_order": r[9]}
                for r in rows
            ]})

        # update_package — изменить название пакета (admin/owner)
        if action == "update_package":
            if not is_admin:
                return err(403, "Нет прав")
            pkg_id = body.get("id")
            name = (body.get("name") or "").strip()
            if not pkg_id or not name:
                return err(400, "id и name обязательны")
            cur.execute("UPDATE packages SET name = %s WHERE id = %s RETURNING id", (name, pkg_id))
            if not cur.fetchone():
                return err(404, "Пакет не найден")
            conn.commit()
            return ok({"ok": True})

        # get_promos — список промокодов (admin/owner)
        if action == "get_promos":
            if not is_admin:
                return err(403, "Нет прав")
            cur.execute("SELECT id, code, discount_percent, active, usage_limit, used_count, created_at FROM promo_codes ORDER BY created_at DESC")
            rows = cur.fetchall()
            return ok({"promos": [
                {"id": r[0], "code": r[1], "discount_percent": r[2], "active": r[3],
                 "usage_limit": r[4], "used_count": r[5], "created_at": r[6].isoformat()}
                for r in rows
            ]})

        # create_promo — создать промокод (admin/owner)
        if action == "create_promo":
            if not is_admin:
                return err(403, "Нет прав")
            code = (body.get("code") or "").strip().upper()
            discount = int(body.get("discount_percent") or 0)
            limit = body.get("usage_limit")
            if not code or discount <= 0 or discount > 100:
                return err(400, "Некорректные данные")
            cur.execute(
                "INSERT INTO promo_codes (code, discount_percent, usage_limit) VALUES (%s, %s, %s) RETURNING id",
                (code, discount, limit)
            )
            promo_id = cur.fetchone()[0]
            conn.commit()
            return ok({"id": promo_id, "code": code})

        # update_promo — изменить промокод (admin/owner)
        if action == "update_promo":
            if not is_admin:
                return err(403, "Нет прав")
            promo_id = body.get("id")
            if not promo_id:
                return err(400, "id обязателен")
            active = body.get("active")
            discount = body.get("discount_percent")
            if active is not None:
                cur.execute("UPDATE promo_codes SET active = %s WHERE id = %s", (active, promo_id))
            if discount is not None:
                cur.execute("UPDATE promo_codes SET discount_percent = %s WHERE id = %s", (int(discount), promo_id))
            conn.commit()
            return ok({"ok": True})

        # get_users — список пользователей (owner only)
        if action == "get_users":
            if not is_owner:
                return err(403, "Только для владельца")
            cur.execute("SELECT id, username, email, rank, balance, created_at FROM users ORDER BY created_at DESC")
            rows = cur.fetchall()
            return ok({"users": [
                {"id": r[0], "username": r[1], "email": r[2], "rank": r[3], "balance": r[4], "created_at": r[5].isoformat()}
                for r in rows
            ]})

        # set_rank — изменить ранг пользователя (owner only)
        if action == "set_rank":
            if not is_owner:
                return err(403, "Только для владельца")
            uid = body.get("user_id")
            new_rank = body.get("rank", "")
            if not uid:
                return err(400, "user_id обязателен")
            if new_rank not in ("user", "support", "admin"):
                return err(400, "Недопустимый ранг")
            cur.execute("SELECT rank FROM users WHERE id = %s", (uid,))
            target = cur.fetchone()
            if not target:
                return err(404, "Пользователь не найден")
            if target[0] == "owner":
                return err(403, "Нельзя изменить ранг владельца")
            cur.execute("UPDATE users SET rank = %s WHERE id = %s", (new_rank, uid))
            conn.commit()
            return ok({"ok": True})

        # check_promo — проверить промокод (для всех авторизованных)
        if action == "check_promo":
            code = (body.get("code") or "").strip().upper()
            cur.execute(
                "SELECT id, discount_percent, usage_limit, used_count FROM promo_codes WHERE code = %s AND active = true",
                (code,)
            )
            promo = cur.fetchone()
            if not promo:
                return err(404, "Промокод не найден или истёк")
            if promo[2] and promo[3] >= promo[2]:
                return err(410, "Промокод исчерпан")
            return ok({"discount_percent": promo[1]})

        return err(400, "Неизвестное действие")

    finally:
        cur.close()
        conn.close()