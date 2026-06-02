import json
import os
import hmac
import hashlib
import datetime
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET


def sign(key, msg):
    return hmac.new(key, msg.encode('utf-8'), hashlib.sha256).digest()


def get_signature_key(key, date_stamp, region, service):
    k_date = sign(('AWS4' + key).encode('utf-8'), date_stamp)
    k_region = sign(k_date, region)
    k_service = sign(k_region, service)
    k_signing = sign(k_service, 'aws4_request')
    return k_signing


def list_s3_files():
    access_key = os.environ['AWS_ACCESS_KEY_ID']
    secret_key = os.environ['AWS_SECRET_ACCESS_KEY']
    endpoint = 'bucket.poehali.dev'
    bucket = 'files'
    region = 'us-east-1'
    service = 's3'

    t = datetime.datetime.utcnow()
    amz_date = t.strftime('%Y%m%dT%H%M%SZ')
    date_stamp = t.strftime('%Y%m%d')

    host = endpoint
    canonical_uri = f'/{bucket}'
    canonical_querystring = 'list-type=2'
    canonical_headers = f'host:{host}\nx-amz-date:{amz_date}\n'
    signed_headers = 'host;x-amz-date'
    payload_hash = hashlib.sha256(b'').hexdigest()

    canonical_request = '\n'.join([
        'GET', canonical_uri, canonical_querystring,
        canonical_headers, signed_headers, payload_hash
    ])

    credential_scope = f'{date_stamp}/{region}/{service}/aws4_request'
    string_to_sign = '\n'.join([
        'AWS4-HMAC-SHA256', amz_date, credential_scope,
        hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()
    ])

    signing_key = get_signature_key(secret_key, date_stamp, region, service)
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()

    authorization = (
        f'AWS4-HMAC-SHA256 Credential={access_key}/{credential_scope}, '
        f'SignedHeaders={signed_headers}, Signature={signature}'
    )

    url = f'https://{endpoint}/{bucket}?{canonical_querystring}'
    req = urllib.request.Request(url, headers={
        'x-amz-date': amz_date,
        'Authorization': authorization,
    })

    with urllib.request.urlopen(req, timeout=15) as resp:
        content = resp.read().decode('utf-8')

    root = ET.fromstring(content)
    ns_uri = root.tag.split('}')[0].strip('{') if '}' in root.tag else ''
    ns = {'s3': ns_uri} if ns_uri else {}
    prefix = 's3:' if ns_uri else ''

    files = []
    for obj in root.iter(f'{"{" + ns_uri + "}" if ns_uri else ""}Contents'):
        key_el = obj.find(f'{"{" + ns_uri + "}" if ns_uri else ""}Key')
        size_el = obj.find(f'{"{" + ns_uri + "}" if ns_uri else ""}Size')
        if key_el is None:
            continue
        key = key_el.text
        size = int(size_el.text) if size_el is not None else 0
        cdn_url = f'https://cdn.poehali.dev/projects/{access_key}/bucket/{key}'
        files.append({'key': key, 'url': cdn_url, 'size': size})
    return files, content[:500]


def handler(event: dict, context) -> dict:
    """Возвращает список файлов из S3-хранилища проекта."""

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    files, raw = list_s3_files()

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'files': files, 'count': len(files), 'raw': raw}, ensure_ascii=False)
    }