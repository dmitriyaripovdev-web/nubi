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

# ----- Картинки интерфейса (значки желаний, фоны блоков) -----
# Список img/ui/ui-urls.txt, строка: <имя> <ссылка> <icon|wide> [заново]
#   icon — квадрат 256×256 (значок), wide — 960×536 (фон блока)
UI = "img/ui"
ui_list = os.path.join(UI, "ui-urls.txt")
if os.path.exists(ui_list):
    for line in open(ui_list, encoding="utf-8"):
        parts = line.split()
        if len(parts) < 3 or parts[0].startswith("#"):
            continue
        name, url, kind = parts[0], parts[1], parts[2]
        again = len(parts) > 3 and parts[3] == "заново"
        out = os.path.join(UI, name + ".webp")
        if os.path.exists(out) and not again:
            continue
        req = urllib.request.Request(url, headers={"User-Agent": "nubi-art"})
        im = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=60).read())).convert("RGB")
        if kind == "icon":
            # значок: вырезаем середину (~78%), чтобы предмет занимал почти весь кружок
            W, H = im.size; m = int(min(W, H) * 0.11)
            im = im.crop((m, m, W - m, H - m))
        (crop_to(im, 256, 256) if kind == "icon" else crop_to(im, 960, 536)).save(out, "WEBP", quality=84)
        print("готово (ui):", name)
