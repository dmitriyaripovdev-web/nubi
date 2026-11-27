# Скачивает картинки легенд по списку img/legends/art-urls.txt.
# Строка списка: <id легенды> <ссылка на картинку>. Пустые строки и строки с # пропускаются.
# Уже готовые картинки не трогаем, если в конце строки нет слова «заново».
import io, os, urllib.request
from PIL import Image

DIR = "img/legends"
BIG = (960, 548)    # размер большой картинки, как у картинок Хвасона
THUMB = 168         # квадратная миниатюра для списков и печатей

def crop_to(im, w, h):
    # Обрезаем по центру до нужных пропорций и уменьшаем
    r = w / h
    W, H = im.size
    if W / H > r:
        nw = int(H * r); im = im.crop(((W - nw) // 2, 0, (W - nw) // 2 + nw, H))
    else:
        nh = int(W / r); im = im.crop((0, (H - nh) // 2, W, (H - nh) // 2 + nh))
    return im.resize((w, h), Image.LANCZOS)

made = 0
for line in open(os.path.join(DIR, "art-urls.txt"), encoding="utf-8"):
    parts = line.split()
    if len(parts) < 2 or parts[0].startswith("#"):
        continue
    lid, url = parts[0], parts[1]
    again = len(parts) > 2 and parts[2] == "заново"
    big = os.path.join(DIR, lid + ".webp")
    if os.path.exists(big) and not again:
        continue
    req = urllib.request.Request(url, headers={"User-Agent": "nubi-art"})
    im = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=60).read())).convert("RGB")
    crop_to(im, *BIG).save(big, "WEBP", quality=82)
    os.makedirs(os.path.join(DIR, "thumb"), exist_ok=True)
    crop_to(im, THUMB, THUMB).save(os.path.join(DIR, "thumb", lid + ".webp"), "WEBP", quality=80)
    print("готово:", lid)
    made += 1
print("картинок сделано:", made)
