### Описание

Galène является сервером, предназначенным для организации видеоконференций. Выполнен полный перевод на русский язык. Добавлен дополнительный режим "Только камера". Были внесены изменения в цветовую палитру, а также проведены различные мелкие корректировки в вёрстке. Добавлена функция локальной записи экрана. Для текстового чата добавлены Emoji, реализовано отображение одинаковых Emoji вне зависимости от используемой операционной системы. Чат автоматически скрывается.

Главная страница была переработана: теперь на ней появился логотип и генератор ссылок, предназначенный для групп с активированными подгруппами. Брендирование было выполнено в качестве примера, поэтому вы можете самостоятельно отредактировать логотип и favicon, чтобы они соответствовали вашим предпочтениям.

<p align="center">
 <img src="https://raw.githubusercontent.com/zerolabnet/galene-ru/master/docs/01-scr.png" width="100%">
 <img src="https://raw.githubusercontent.com/zerolabnet/galene-ru/master/docs/02-scr.png" width="100%">
</p>

### Установка, используя docker

```bash
docker run -d \
--network host \
--name galene \
--restart=unless-stopped \
-e GALENE_HTTP=:443 \
-e GALENE_TURN=:10000 \
-e GALENE_UDP_RANGE=10001-20000 \
-e GALENE_DATA=/data \
-e GALENE_GROUPS=/groups \
-v /data/galene/data:/data \
-v /data/galene/groups:/groups \
-v /data/galene/static:/opt/galene/static \
zerolabnet/galene:latest
```

Чтобы обеспечить возможность легкой правки, статические файлы переносятся в директорию, смонтированную для этой цели.
