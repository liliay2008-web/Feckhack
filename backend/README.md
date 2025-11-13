Установка и запуск
1) Установить зависимости:
   npm install --prefix backend

2) Запуск:
   npm run --prefix backend start
   Сервер: http://localhost:3001

Основные эндпоинты
- GET /api/health

Авторизация:
- POST /api/auth/register { full_name, email?, login, password, role, groups? }
- POST /api/auth/login { login, password }
- GET /api/auth/me (заголовок Authorization: Bearer <token>)

Админ:
- GET /api/admin/groups
- POST /api/admin/groups { name }
- GET /api/admin/supervisors
- POST /api/admin/supervisors { full_name, phone }
- POST multipart/form-data /api/admin/upload/students (file: CSV)
  Заголовки: full_name, phone, group
- POST multipart/form-data /api/admin/upload/topics (file: CSV)
  Заголовки: title, description, commission, subject, supervisor_full_name
- POST multipart/form-data /api/admin/upload/supervisors (file: CSV)
  Заголовки: full_name, phone
- GET /api/admin/students?group_id=ID
- GET /api/admin/topics?only_free=1
- POST /api/admin/topics/:id/reassign { student_id|null }
- POST /api/admin/topics/:id/supervisor { supervisor_id|null }
- GET /api/admin/stats
- GET /api/admin/history

Староста:
- GET /api/starosta/topics
- GET /api/starosta/students?group_id=ID
- POST /api/starosta/topics/:id/reserve { group_id }
- POST /api/starosta/topics/:id/assign { student_id }

Экспорт:
- GET /api/export/csv?[group_id=&supervisor_id=&commission_id=]
- GET /api/export/csv/free?[filters]
- GET /api/export/pdf?[filters]

Резервирование
- Резерв действует 30 минут. Очистка срабатывает автоматически раз в минуту.

Данные хранятся в файле `backend/data.json` и обновляются автоматически. Для токенов используется JWT (12 часов, секрет `JWT_SECRET` можно переопределить через переменные окружения).


