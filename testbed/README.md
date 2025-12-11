# Текстурирование в testbed

Ниже — соответствия пунктам из `task` с указанием кода.

1. **Загрузка изображения** — функция `loadTexture` в `testbed/main.cpp` (около начала файла): читает PNG через `lodepng::decode`, проверяет ошибку, конвертирует RGBA→BGRA и возвращает `veekay::graphics::Texture`.
2. **Создание текстуры** — там же (`loadTexture`): `new veekay::graphics::Texture(cmd, width, height, VK_FORMAT_B8G8R8A8_UNORM, image.data())` на GPU.
3. **Создание сэмплера** — в `initialize` два сэмплера:
   - `missing_texture_sampler` (fallback) и `default_sampler` (основной) с фильтрацией `LINEAR` и адресацией `REPEAT`.
4. **Запись дескрипторов** — функция `createMaterial` в `main.cpp`: аллоцирует `descriptor_set` из `descriptor_pool` и пишет три биндинга: `binding 0` `SceneUniforms` UBO, `binding 1` `ModelUniforms` UBO_DYNAMIC, `binding 2` `COMBINED_IMAGE_SAMPLER` (вид + сэмплер).
5. **Текстурные координаты в вершинах** — структуры `Vertex` и заполнение вершин в `initialize`:
   - Плоскость и куб задают `uv` в массивах `vertices` (см. блоки "Build plane mesh" и "Build cube mesh").
   - Вершинный шейдер (`shaders/shader.vert`) передает `v_uv` → `f_uv` (location 2).
6. **Сэмплинг в фрагментном шейдере** — `shaders/shader.frag`: `sampler2D textureSampler` (binding 2), выборка `texture(textureSampler, f_uv)`, умножение на `albedo_color`.
7. **Разные текстуры/сэмплеры для моделей** — в `initialize` создаются материалы из разных пар (текстура+сэмплер):
   - `materials[0] = createMaterial(missing_texture, missing_texture_sampler)`.
   - `materials[1] = createMaterial(lenna_texture, default_sampler)`.
   Модели сцены (`models.emplace_back(...)`) получают указатель на нужный `Material`, а в `render` биндинг `descriptor_set` материала происходит перед каждым `vkCmdDrawIndexed`.

## Файлы
- `testbed/main.cpp` — загрузка текстуры, создание сэмплеров, материалов, заполнение мешей с UV, выборка материалов при рендере.
- `shaders/shader.vert` — проброс текстурных координат.
- `shaders/shader.frag` — сэмплинг текстуры и умножение на цвет материала.

## Быстрый прогон
1. Сборка: `cmake --build --preset debug`
2. Запуск: `./build-debug/testbed/testbed`
3. Управление камерой: LMB + мышь (огляд), `WASDQZ` — движение.
