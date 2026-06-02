import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Принимает RSVP-ответ гостя и отправляет письмо на почту организаторов."""

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body', '{}'))

    name = body.get('name', '')
    attending = body.get('attending', '')
    drinks = body.get('drinks', [])
    meal = body.get('meal', '')

    if not name or not attending:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Не заполнены обязательные поля'}, ensure_ascii=False)
        }

    attending_text = 'Буду присутствовать' if attending == 'yes' else 'Не смогу прийти'
    drinks_text = ', '.join(drinks) if drinks else 'Не указано'
    meal_text = meal if meal else 'Не указано'

    html_body = f"""
    <html>
    <body style="font-family: Georgia, serif; background: #f5f5f5; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px;">
        <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 8px;">Новый ответ на приглашение</h1>
        <p style="color: #888; font-size: 14px; margin-bottom: 32px;">Годовщина Егора и Дианы · 26 сентября 2026</p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px; width: 40%;">ИМЯ</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 16px; font-weight: bold;">{name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">ПРИСУТСТВИЕ</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 16px;">{attending_text}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">БЛЮДО</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-size: 16px;">{meal_text}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888; font-size: 13px;">НАПИТКИ</td>
            <td style="padding: 12px 0; color: #1a1a1a; font-size: 16px;">{drinks_text}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
    """

    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    to_email = '442843@gmail.com'
    from_email = '442843@gmail.com'

    if smtp_password:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'RSVP: {name} — {"придёт" if attending == "yes" else "не придёт"}'
        msg['From'] = from_email
        msg['To'] = to_email
        msg.attach(MIMEText(html_body, 'html'))

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(from_email, smtp_password)
            server.sendmail(from_email, to_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'success': True, 'message': f'Ответ от {name} сохранён'}, ensure_ascii=False)
    }
